require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));


// --- Configuration ---
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
// For initial setup, we use a pre-hashed password for "password" if the .env is not set.
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$f/2.z6.iPz5v.AP89a369uP/2a.YotX.V.p55KxGj3sY4f3j2.i';

if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined. Please create a .env file.');
  process.exit(1);
}
if (ADMIN_PASSWORD_HASH === '$2b$10$f/2.z6.iPz5v.AP89a369uP/2a.YotX.V.p55KxGj3sY4f3j2.i') {
    console.warn('WARNING: Using default password. Please set a secure ADMIN_PASSWORD_HASH in your .env file.');
}


const contentDir = path.join(__dirname, '..');
const projectsDir = path.join(contentDir, '_projects');
const postsDir = path.join(contentDir, '_posts');
const layoutsDir = path.join(contentDir, '_layouts');

// --- Middleware ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", 'https://cdn.jsdelivr.net'],
        'style-src': ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
        'connect-src': ["'self'", 'https://cdn.jsdelivr.net', 'http://localhost:3000', 'http://127.0.0.1:3000'],
      },
    },
  })
); // Apply security headers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter for the login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

// --- Simple Authentication Middleware ---
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

// A middleware to check authentication status without returning 401
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

// --- API Routes ---

// --- Login ---
app.post('/api/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  try {
    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (isMatch) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
      res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
});

// --- Logout ---
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

app.get('/api/check-auth', checkAuthStatusMiddleware, (req, res) => {
  res.json({ authenticated: req.isAuthenticated });
});

// --- Get all layouts ---
app.get('/api/layouts', authMiddleware, async (req, res) => {
    try {
        const layouts = await fs.readdir(layoutsDir);
        res.json(layouts.filter(l => l.endsWith('.html')));
    } catch (error) {
        res.status(500).json({ message: 'Error reading layouts directory', error });
    }
});

// --- Get all content ---
app.get('/api/content', authMiddleware, async (req, res) => {
  try {
    const projects = await fs.readdir(projectsDir);
    const posts = await fs.readdir(postsDir);
    res.json({
      projects: projects.filter(p => p.endsWith('.md')),
      posts: posts.filter(p => p.endsWith('.md')),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error reading content directories', error: error.message, stack: error.stack });
  }
});

// --- Get single content item ---
app.get('/api/content/:type/:filename', authMiddleware, async (req, res) => {
    const { type, filename } = req.params;
    const dir = type === 'projects' ? projectsDir : postsDir;
    const filePath = path.join(dir, filename);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        res.json({ content: fileContent });
    } catch (error) {
        res.status(500).json({ message: 'Error reading file', error });
    }
});

// --- Save content item ---
app.post('/api/content/:type', authMiddleware, async (req, res) => {
    const { type } = req.params;
    const { filename, content } = req.body;
    const dir = type === 'projects' ? projectsDir : postsDir;
    const filePath = path.join(dir, filename);

    try {
        await fs.writeFile(filePath, content, 'utf-8');
        res.json({ success: true, message: 'File saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving file', error });
    }
});

// --- Delete content item ---
app.delete('/api/content/:type/:filename', authMiddleware, async (req, res) => {
    const { type, filename } = req.params;
    const dir = type === 'projects' ? projectsDir : postsDir;
    const filePath = path.join(dir, filename);

    try {
        await fs.unlink(filePath);
        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting file', error });
    }
});

// --- Markdown Preview ---
app.post('/api/preview', authMiddleware, (req, res) => {
    const { markdown } = req.body;
    if (typeof markdown !== 'string') {
        return res.status(400).json({ message: 'Invalid Markdown content' });
    }
    const html = marked(markdown);
    res.json({ html });
});


// --- Server ---
app.listen(port, () => {
  console.log(`Custom CMS running at http://localhost:${port}`);
});
