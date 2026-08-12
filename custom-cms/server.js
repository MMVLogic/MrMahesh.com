require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

let marked;
(async () => {
  try {
    const m = await import('marked');
    marked = m.marked || m.default;
  } catch (err) {
    console.error('Failed to load marked:', err);
  }
})();

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:4000',
    'https://cms.mrmahesh.com',
    'http://cms.mrmahesh.com',
    'https://mrmahesh.com'
  ],
  credentials: true,
}));

const { db } = require('./database.js');

// --- Configuration ---
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined. Please create a .env file.');
  process.exit(1);
}

const contentDir = process.env.CONTENT_DIR || path.join(__dirname, '..');
const projectsDir = path.join(contentDir, '_projects');
const postsDir = path.join(contentDir, '_posts');
const recipesDir = path.join(contentDir, '_recipes');
const guidesDir = path.join(contentDir, '_guides');
const productsDir = path.join(contentDir, '_products');
const layoutsDir = path.join(contentDir, '_layouts');

// --- Git Helper ---
const runGit = async (command) => {
  const sshCmd = process.env.GIT_SSH_COMMAND || 'ssh -i /root/.ssh/cms_deploy_key -o StrictHostKeyChecking=accept-new';
  const env = { ...process.env, GIT_SSH_COMMAND: sshCmd };
  return execPromise(command, { cwd: contentDir, env });
};

// Ensure Git safe directory
(async () => {
  try {
    await execPromise('git config --global --add safe.directory /content');
    await execPromise('git config --global --add safe.directory "*"');
    await execPromise('git config --global user.name "MrMahesh CMS"');
    await execPromise('git config --global user.email "m@mrmahesh.com"');
  } catch (err) {
    console.warn('Git safe directory warning:', err.message);
  }
})();

// --- Middleware ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", 'https://cdn.jsdelivr.net'],
        'style-src': ["'self'", 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com', "'unsafe-inline'"],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'connect-src': [
          "'self'",
          'https://cdn.jsdelivr.net',
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'http://localhost:4000',
          'https://cms.mrmahesh.com',
          'http://cms.mrmahesh.com',
          'https://mrmahesh.com'
        ],
      },
    },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again later',
});

// --- Authentication Middleware ---
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

const checkAuthStatusMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.isAuthenticated = false;
    return next();
  }
  try {
    jwt.verify(token, JWT_SECRET);
    req.isAuthenticated = true;
    next();
  } catch (error) {
    req.isAuthenticated = false;
    next();
  }
};

// --- Auth Routes ---
app.post('/api/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    try {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (isMatch) {
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
        res.json({ success: true, username: user.username });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

app.get('/api/check-auth', checkAuthStatusMiddleware, (req, res) => {
  res.json({ authenticated: req.isAuthenticated });
});

// --- Git Management Routes ---

// 1. Git Status
app.get('/api/git/status', authMiddleware, async (req, res) => {
  try {
    const { stdout: statusOut } = await runGit('git status --porcelain');
    const changedFiles = statusOut.split('\n').filter(Boolean).map(line => {
      const status = line.substring(0, 2).trim();
      const file = line.substring(3).trim();
      return { status, file };
    });

    let branch = 'main';
    try {
      const { stdout: branchOut } = await runGit('git rev-parse --abbrev-ref HEAD');
      branch = branchOut.trim();
    } catch (e) {}

    let lastCommit = '';
    try {
      const { stdout: logOut } = await runGit('git log -1 --format="%h - %s (%cr)"');
      lastCommit = logOut.trim();
    } catch (e) {}

    res.json({
      branch,
      uncommittedCount: changedFiles.length,
      changedFiles,
      lastCommit,
      isClean: changedFiles.length === 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking git status', error: error.message });
  }
});

// 2. Git Diff
app.get('/api/git/diff', authMiddleware, async (req, res) => {
  try {
    const { stdout } = await runGit('git diff');
    res.json({ diff: stdout });
  } catch (error) {
    res.status(500).json({ message: 'Error getting git diff', error: error.message });
  }
});

// 3. Git Pull
app.post('/api/git/pull', authMiddleware, async (req, res) => {
  try {
    const { stdout, stderr } = await runGit('git pull origin main');
    res.json({ success: true, message: 'Pulled latest changes from GitHub', output: stdout || stderr });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Git pull failed', error: error.message });
  }
});

// 4. Git Publish (Commit & Push)
app.post('/api/git/publish', authMiddleware, async (req, res) => {
  const commitMsg = req.body.message || `CMS: Content update ${new Date().toISOString().replace('T', ' ').substring(0, 19)}`;
  try {
    await runGit('git add .');
    const { stdout: statusOut } = await runGit('git status --porcelain');
    if (!statusOut.trim()) {
      return res.json({ success: true, message: 'No changes to publish. Repository is already up to date.' });
    }
    await runGit(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
    const { stdout: pushOut, stderr: pushErr } = await runGit('git push origin main');
    const { stdout: commitHash } = await runGit('git rev-parse --short HEAD');
    res.json({
      success: true,
      message: `Successfully published to GitHub! (Commit: ${commitHash.trim()})`,
      commit: commitHash.trim(),
      output: pushOut || pushErr
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Publish to GitHub failed', error: error.message });
  }
});

// 5. Deploy Key Info
app.get('/api/git/deploy-key', authMiddleware, async (req, res) => {
  const defaultKey = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIL8EJf5UASe+PjAIHC6OGD1L8Tgi3NF5yobaLDznTUkl cms@mrmahesh.com';
  try {
    const keyPath = '/root/.ssh/cms_deploy_key.pub';
    if (await fs.pathExists(keyPath)) {
      const key = await fs.readFile(keyPath, 'utf8');
      return res.json({ key: key.trim() });
    }
  } catch (e) {}
  res.json({ key: defaultKey });
});

// --- Content Management Routes ---

// Layouts
app.get('/api/layouts', authMiddleware, async (req, res) => {
  try {
    if (!(await fs.pathExists(layoutsDir))) {
      return res.json(['default', 'post', 'project', 'recipe']);
    }
    const layouts = await fs.readdir(layoutsDir);
    res.json(layouts.filter(l => l.endsWith('.html')).map(l => l.replace('.html', '')));
  } catch (error) {
    res.json(['default', 'post', 'project', 'recipe']);
  }
});

// Get all content organized by collection
app.get('/api/content', authMiddleware, async (req, res) => {
  try {
    const projects = (await fs.pathExists(projectsDir)) ? await fs.readdir(projectsDir) : [];
    const posts = (await fs.pathExists(postsDir)) ? await fs.readdir(postsDir) : [];
    const recipes = (await fs.pathExists(recipesDir)) ? await fs.readdir(recipesDir) : [];
    const guides = (await fs.pathExists(guidesDir)) ? await fs.readdir(guidesDir) : [];
    const products = (await fs.pathExists(productsDir)) ? await fs.readdir(productsDir) : [];

    // Root standalone pages
    const rootFiles = (await fs.pathExists(contentDir)) ? await fs.readdir(contentDir) : [];
    const pages = rootFiles.filter(f => f.endsWith('.html') && !f.startsWith('.') && !f.startsWith('_'));

    res.json({
      projects: projects.filter(p => (p.endsWith('.md') || p.endsWith('.html')) && !p.startsWith('.')),
      posts: posts.filter(p => (p.endsWith('.md') || p.endsWith('.html')) && !p.startsWith('.')),
      recipes: recipes.filter(r => (r.endsWith('.md') || r.endsWith('.html')) && !r.startsWith('.')),
      guides: guides.filter(g => (g.endsWith('.md') || g.endsWith('.html')) && !g.startsWith('.')),
      products: products.filter(pr => (pr.endsWith('.md') || pr.endsWith('.html')) && !pr.startsWith('.')),
      pages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error reading content directories', error: error.message });
  }
});

// Get single content item
app.get('/api/content/:type/:filename', authMiddleware, async (req, res) => {
  const { type, filename } = req.params;
  let dir;
  if (type === 'projects') dir = projectsDir;
  else if (type === 'posts') dir = postsDir;
  else if (type === 'recipes') dir = recipesDir;
  else if (type === 'guides') dir = guidesDir;
  else if (type === 'products') dir = productsDir;
  else if (type === 'pages') dir = contentDir;
  else return res.status(400).json({ message: 'Invalid content type' });

  const filePath = path.join(dir, filename);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    res.json({ content: fileContent, filename, type });
  } catch (error) {
    res.status(500).json({ message: 'Error reading file', error: error.message });
  }
});

// Save content item
app.post('/api/content/:type', authMiddleware, async (req, res) => {
  const { type } = req.params;
  const { filename, content } = req.body;
  let dir;
  if (type === 'projects') dir = projectsDir;
  else if (type === 'posts') dir = postsDir;
  else if (type === 'recipes') dir = recipesDir;
  else if (type === 'guides') dir = guidesDir;
  else if (type === 'products') dir = productsDir;
  else if (type === 'pages') dir = contentDir;
  else return res.status(400).json({ message: 'Invalid content type' });

  await fs.ensureDir(dir);
  const filePath = path.join(dir, filename);
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    res.json({ success: true, message: 'File saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving file', error: error.message });
  }
});

// Delete content item
app.delete('/api/content/:type/:filename', authMiddleware, async (req, res) => {
  const { type, filename } = req.params;
  let dir;
  if (type === 'projects') dir = projectsDir;
  else if (type === 'posts') dir = postsDir;
  else if (type === 'recipes') dir = recipesDir;
  else if (type === 'guides') dir = guidesDir;
  else if (type === 'products') dir = productsDir;
  else if (type === 'pages') dir = contentDir;
  else return res.status(400).json({ message: 'Invalid content type' });

  const filePath = path.join(dir, filename);
  try {
    await fs.unlink(filePath);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
});

// Markdown Preview
app.post('/api/preview', authMiddleware, async (req, res) => {
  const { markdown } = req.body;
  if (typeof markdown !== 'string') {
    return res.status(400).json({ message: 'Invalid Markdown content' });
  }
  if (!marked) {
    const m = await import('marked');
    marked = m.marked || m.default;
  }
  const html = (marked && marked.parse) ? marked.parse(markdown) : (typeof marked === 'function' ? marked(markdown) : markdown);
  res.json({ html });
});

// Server listener
app.listen(port, () => {
  console.log(`MrMahesh CMS running at http://localhost:${port}`);
  console.log(`Serving content from: ${contentDir}`);
});
