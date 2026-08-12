const appContainer = document.getElementById('app');

const BASE_URL = '';

const API = {
  login: (username, password) =>
    fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    }).then((res) => res.json()),

  logout: () =>
    fetch(`${BASE_URL}/api/logout`, { method: 'POST', credentials: 'include' }).then(
      (res) => res.json()
    ),

  checkAuth: () =>
    fetch(`${BASE_URL}/api/check-auth`, { credentials: 'include' }).then((res) =>
      res.json()
    ),

  getGitStatus: () =>
    fetch(`${BASE_URL}/api/git/status`, { credentials: 'include' }).then((res) =>
      res.json()
    ),

  getGitDiff: () =>
    fetch(`${BASE_URL}/api/git/diff`, { credentials: 'include' }).then((res) =>
      res.json()
    ),

  gitPull: () =>
    fetch(`${BASE_URL}/api/git/pull`, { method: 'POST', credentials: 'include' }).then(
      (res) => res.json()
    ),

  gitPublish: (message) =>
    fetch(`${BASE_URL}/api/git/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      credentials: 'include',
    }).then((res) => res.json()),

  getDeployKey: () =>
    fetch(`${BASE_URL}/api/git/deploy-key`, { credentials: 'include' }).then((res) =>
      res.json()
    ),

  getLayouts: () =>
    fetch(`${BASE_URL}/api/layouts`, { credentials: 'include' }).then((res) =>
      res.json()
    ),

  getContent: () =>
    fetch(`${BASE_URL}/api/content`, { credentials: 'include' }).then((res) =>
      res.json()
    ),

  getFile: (type, filename) =>
    fetch(`${BASE_URL}/api/content/${type}/${encodeURIComponent(filename)}`, {
      credentials: 'include',
    }).then((res) => res.json()),

  saveFile: (type, filename, content) =>
    fetch(`${BASE_URL}/api/content/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, content }),
      credentials: 'include',
    }).then((res) => res.json()),

  deleteFile: (type, filename) =>
    fetch(`${BASE_URL}/api/content/${type}/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((res) => res.json()),

  getPreview: (markdown) =>
    fetch(`${BASE_URL}/api/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdown }),
      credentials: 'include',
    }).then((res) => res.json()),
};

const parseFrontmatter = (content) => {
  if (typeof content !== 'string') return { frontmatter: {}, body: '' };
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (frontmatterMatch) {
    const frontmatterString = frontmatterMatch[1];
    const body = content.substring(frontmatterMatch[0].length);
    const frontmatter = frontmatterString.split('\n').reduce((acc, line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        acc[key] = value;
      }
      return acc;
    }, {});
    return { frontmatter, body };
  }
  return { frontmatter: {}, body: content };
};

const stringifyFrontmatter = (frontmatter) => {
  return Object.entries(frontmatter)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
};

// Render Login
const renderLoginPage = () => {
  appContainer.innerHTML = `
    <div class="row justify-content-center pt-5">
      <div class="col-md-5">
        <div class="card p-4">
          <div class="card-body">
            <div class="text-center mb-4">
              <h2 class="card-title mb-1">MrMahesh CMS</h2>
              <p class="text-muted small">Live Homelab & Website Content Manager</p>
            </div>
            <form id="login-form">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" value="admin" required autofocus>
              </div>
              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required>
              </div>
              <button type="submit" class="btn btn-primary w-100 py-2" id="login-btn">
                <span>Sign In</span>
              </button>
              <div id="login-error" class="text-danger mt-3 text-center small fw-semibold"></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    const err = document.getElementById('login-error');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Signing in...`;
    err.textContent = '';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
      const result = await API.login(username, password);
      if (result.success) {
        init();
      } else {
        err.textContent = result.message || 'Invalid username or password';
        btn.disabled = false;
        btn.innerHTML = 'Sign In';
      }
    } catch (e) {
      err.textContent = 'Connection error. Please retry.';
      btn.disabled = false;
      btn.innerHTML = 'Sign In';
    }
  });
};

// Render Dashboard
const renderDashboard = async (content) => {
  let gitStatus = { branch: 'main', uncommittedCount: 0, lastCommit: '', isClean: true };
  try {
    gitStatus = await API.getGitStatus();
  } catch (e) {}

  const uncommittedBadge = gitStatus.uncommittedCount > 0
    ? `<span class="badge bg-warning text-dark px-3 py-2">🟡 ${gitStatus.uncommittedCount} Uncommitted Changes</span>`
    : `<span class="badge bg-success px-3 py-2">🟢 Synced with Git</span>`;

  appContainer.innerHTML = `
    <!-- Top Action Header -->
    <div class="card mb-4 p-3">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <div class="d-flex align-items-center gap-2">
            <h2 class="h4 mb-0 fw-bold">MrMahesh CMS</h2>
            <span class="badge bg-secondary">Branch: ${gitStatus.branch || 'main'}</span>
            ${uncommittedBadge}
          </div>
          <p class="text-muted small mb-0 mt-1">
            Last Commit: <span class="font-monospace text-light">${gitStatus.lastCommit || 'Checking...'}</span>
          </p>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2">
          <button id="pull-btn" class="btn btn-secondary btn-sm" title="Pull latest changes from GitHub">
            <span>🔄 Pull Latest</span>
          </button>
          <button id="deploy-key-btn" class="btn btn-secondary btn-sm" title="View GitHub Deploy Key">
            <span>🔑 Deploy Key</span>
          </button>
          <button id="publish-btn" class="btn btn-primary btn-sm px-3" title="Push all changes to GitHub">
            <span>🚀 Publish to GitHub</span>
          </button>
          <button id="logout-btn" class="btn btn-danger btn-sm">
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Live Status Banner -->
    <div id="action-banner" class="mb-4" style="display: none;"></div>

    <!-- Search & Collection Navigation -->
    <div class="mb-4">
      <input type="text" id="search-input" class="form-control form-control-lg" placeholder="🔍 Search articles, recipes, guides, or projects...">
    </div>

    <!-- Collections Grid -->
    <div class="row g-4" id="collections-container">
      
      <!-- Homelab Reports (_projects) -->
      <div class="col-md-6 collection-col">
        <div class="card h-100 p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="h5 mb-0">🛠️ Projects <span class="badge bg-secondary ms-1">${content.projects ? content.projects.length : 0}</span></h3>
            <button class="btn btn-success btn-sm new-btn" data-type="projects">+ New Project</button>
          </div>
          <div class="list-group flex-grow-1 file-list" id="projects-list">
            ${renderFileList(content.projects, 'projects')}
          </div>
        </div>
      </div>

      <!-- Weekly Updates (_posts) -->
      <div class="col-md-6 collection-col">
        <div class="card h-100 p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="h5 mb-0">📰 Posts <span class="badge bg-secondary ms-1">${content.posts ? content.posts.length : 0}</span></h3>
            <button class="btn btn-success btn-sm new-btn" data-type="posts">+ New Post</button>
          </div>
          <div class="list-group flex-grow-1 file-list" id="posts-list">
            ${renderFileList(content.posts, 'posts')}
          </div>
        </div>
      </div>

      <!-- Recipes (_recipes) -->
      <div class="col-md-6 collection-col">
        <div class="card h-100 p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="h5 mb-0">🍳 Recipes <span class="badge bg-secondary ms-1">${content.recipes ? content.recipes.length : 0}</span></h3>
            <button class="btn btn-success btn-sm new-btn" data-type="recipes">+ New Recipe</button>
          </div>
          <div class="list-group flex-grow-1 file-list" id="recipes-list">
            ${renderFileList(content.recipes, 'recipes')}
          </div>
        </div>
      </div>

      <!-- Guides (_guides) -->
      <div class="col-md-6 collection-col">
        <div class="card h-100 p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="h5 mb-0">📚 Guides <span class="badge bg-secondary ms-1">${content.guides ? content.guides.length : 0}</span></h3>
            <button class="btn btn-success btn-sm new-btn" data-type="guides">+ New Guide</button>
          </div>
          <div class="list-group flex-grow-1 file-list" id="guides-list">
            ${renderFileList(content.guides, 'guides')}
          </div>
        </div>
      </div>

      <!-- Store Products (_products) -->
      <div class="col-md-6 collection-col">
        <div class="card h-100 p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="h5 mb-0">🛒 Store Products <span class="badge bg-secondary ms-1">${content.products ? content.products.length : 0}</span></h3>
            <button class="btn btn-success btn-sm new-btn" data-type="products">+ New Product</button>
          </div>
          <div class="list-group flex-grow-1 file-list" id="products-list">
            ${renderFileList(content.products, 'products')}
          </div>
        </div>
      </div>

      <!-- Standalone Pages -->
      <div class="col-md-12 collection-col">
        <div class="card p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="h5 mb-0">🌐 Website Pages <span class="badge bg-secondary ms-1">${content.pages ? content.pages.length : 0}</span></h3>
          </div>
          <div class="list-group file-list" id="pages-list">
            ${renderFileList(content.pages, 'pages')}
          </div>
        </div>
      </div>

    </div>
  `;

  // Search filter
  document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.file-item').forEach((item) => {
      const name = item.dataset.filename.toLowerCase();
      item.style.display = name.includes(term) ? 'flex' : 'none';
    });
  });

  // Pull Button
  document.getElementById('pull-btn').addEventListener('click', async () => {
    const btn = document.getElementById('pull-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>Pulling...`;
    try {
      const res = await API.gitPull();
      showBanner(res.message || 'Pulled latest from GitHub', res.success ? 'success' : 'danger');
      if (res.success) {
        setTimeout(init, 1200);
      }
    } catch (e) {
      showBanner('Failed to pull from GitHub', 'danger');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `🔄 Pull Latest`;
    }
  });

  // Publish Button
  document.getElementById('publish-btn').addEventListener('click', async () => {
    const commitMsg = prompt('Enter a commit message for this publication (or leave default):', `CMS Update: ${new Date().toLocaleDateString()}`);
    if (commitMsg === null) return;

    const btn = document.getElementById('publish-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>Publishing...`;

    try {
      const res = await API.gitPublish(commitMsg);
      showBanner(res.message || 'Published to GitHub!', res.success ? 'success' : 'danger');
      if (res.success) {
        setTimeout(init, 1500);
      }
    } catch (e) {
      showBanner('Publishing failed: ' + e.message, 'danger');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `🚀 Publish to GitHub`;
    }
  });

  // Deploy Key Button
  document.getElementById('deploy-key-btn').addEventListener('click', async () => {
    try {
      const res = await API.getDeployKey();
      prompt('Copy this SSH Deploy Key and add it to GitHub (Repo Settings -> Deploy keys -> Allow write access):', res.key);
    } catch (e) {
      alert('Error fetching deploy key');
    }
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await API.logout();
    init();
  });

  // New Content Button
  document.querySelectorAll('.new-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      renderEditor(btn.dataset.type);
    });
  });

  // File clicks & Deletes
  appContainer.addEventListener('click', async (e) => {
    const editLink = e.target.closest('.edit-link');
    if (editLink) {
      e.preventDefault();
      const { type, filename } = editLink.dataset;
      renderEditor(type, filename);
      return;
    }

    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
      e.preventDefault();
      const { type, filename } = deleteBtn.dataset;
      if (confirm(`Are you sure you want to delete "${filename}"?`)) {
        const result = await API.deleteFile(type, filename);
        if (result.success) {
          showBanner(`Deleted ${filename}`, 'info');
          setTimeout(init, 800);
        } else {
          alert('Error deleting file: ' + result.message);
        }
      }
    }
  });
};

const renderFileList = (files, type) => {
  if (!files || files.length === 0) {
    return `<div class="text-muted p-3 text-center small">No items yet in this collection.</div>`;
  }
  return files
    .map(
      (f) => `
      <div class="list-group-item d-flex justify-content-between align-items-center file-item" data-filename="${f}">
        <a href="#" class="edit-link text-truncate me-2" data-type="${type}" data-filename="${f}">
          📄 ${f}
        </a>
        <button class="btn btn-danger btn-sm delete-btn px-2 py-1" data-type="${type}" data-filename="${f}" title="Delete">
          🗑️
        </button>
      </div>
    `
    )
    .join('');
};

const showBanner = (message, type = 'info') => {
  const banner = document.getElementById('action-banner');
  if (!banner) return;
  banner.className = `alert alert-${type} alert-dismissible fade show`;
  banner.innerHTML = `
    <span>${message}</span>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  banner.style.display = 'block';
};

// Render Editor
const renderEditor = async (type, filename) => {
  appContainer.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-muted mt-2">Loading editor...</p>
    </div>
  `;

  let defaultContent = `---\ntitle: New ${type.slice(0, -1)}\nlayout: ${type === 'posts' ? 'post' : type === 'projects' ? 'project' : type === 'recipes' ? 'recipe' : 'default'}\ndate: ${new Date().toISOString().split('T')[0]}\nstatus: In Progress\ntags: \n---\n\nWrite your markdown content here...`;
  
  if (type === 'products') {
    defaultContent = `---\ntitle: "New Product Blueprint"\nprice: 9.00\ncategory: "woodworking"\ncategory_label: "🪵 Woodworking"\nstripe_link: "https://buy.stripe.com/..."\nfeatures:\n  - "Scalable dimensional cut list"\n  - "Step-by-step PDF assembly guide"\n  - "Instant digital download package"\nlayout: default\n---\n\n### Overview\nParametric building plans and schematics for workshop builders...\n`;
  }

  const [file, layouts] = await Promise.all([
    filename
      ? API.getFile(type, filename)
      : { content: defaultContent },
    API.getLayouts(),
  ]);

  const { frontmatter, body } = parseFrontmatter(file.content);
  const isPage = type === 'pages';
  const defaultExt = isPage ? '.html' : '.md';
  const newFilename = filename || `${new Date().toISOString().split('T')[0]}-new-${type.slice(0, -1)}${defaultExt}`;

  appContainer.innerHTML = `
    <div class="card p-3 mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="h4 mb-0 fw-bold">${filename ? 'Edit' : 'Create'} ${type}</h2>
          <span class="text-muted small font-monospace">${filename || 'Unsaved Document'}</span>
        </div>
        <div class="d-flex gap-2">
          <button id="back-btn" class="btn btn-secondary btn-sm">← Back to Dashboard</button>
        </div>
      </div>
    </div>

    <form id="editor-form">
      <div class="row g-4">
        <!-- Metadata Sidebar -->
        <div class="col-md-4">
          <div class="card p-3 h-100">
            <h3 class="h6 mb-3 text-muted text-uppercase">Document Settings</h3>

            <div class="mb-3">
              <label for="filename" class="form-label">Filename</label>
              <input type="text" class="form-control font-monospace" id="filename" value="${newFilename}" required>
            </div>

            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input type="text" class="form-control" id="title" value="${frontmatter.title || ''}">
            </div>

            <div class="mb-3">
              <label for="layout" class="form-label">Layout</label>
              <select class="form-select" id="layout">
                ${layouts
                  .map(
                    (l) =>
                      `<option value="${l}" ${frontmatter.layout === l ? 'selected' : ''}>${l}</option>`
                  )
                  .join('')}
              </select>
            </div>

            <div class="mb-3">
              <label for="date" class="form-label">Date</label>
              <input type="date" class="form-control" id="date" value="${frontmatter.date || new Date().toISOString().split('T')[0]}">
            </div>

            <div class="mb-3">
              <label for="status" class="form-label">Status</label>
              <select class="form-select" id="status">
                <option value="Completed" ${frontmatter.status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="In Progress" ${frontmatter.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Draft" ${frontmatter.status === 'Draft' ? 'selected' : ''}>Draft</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="tags" class="form-label">Tags</label>
              <div id="tags-container" class="d-flex flex-wrap gap-1 mb-2"></div>
              <input type="text" class="form-control" id="tags-input" placeholder="Type tag and press Enter or comma">
            </div>

            <div class="mt-auto pt-3 border-top">
              <button type="submit" class="btn btn-primary w-100 py-2 mb-2" id="save-btn">
                💾 Save Document
              </button>
            </div>
          </div>
        </div>

        <!-- Markdown / Code Editor & Preview -->
        <div class="col-md-8">
          <div class="card p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h3 class="h6 mb-0 text-muted text-uppercase">Markdown Editor</h3>
              <span id="word-count" class="text-muted small">0 words</span>
            </div>
            <textarea class="form-control mb-3" id="content" rows="16">${body}</textarea>

            <h3 class="h6 mb-2 text-muted text-uppercase">Live Preview</h3>
            <div id="preview" class="preview-pane"></div>
          </div>
        </div>
      </div>
    </form>
  `;

  const contentEl = document.getElementById('content');
  const previewEl = document.getElementById('preview');
  const tagsContainer = document.getElementById('tags-container');
  const tagsInput = document.getElementById('tags-input');
  const wordCountEl = document.getElementById('word-count');

  let tags = frontmatter.tags ? frontmatter.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  const renderTags = () => {
    tagsContainer.innerHTML = tags
      .map(
        (tag) => `
        <span class="badge bg-secondary d-inline-flex align-items-center gap-1">
          ${tag}
          <span class="btn-close btn-close-white ms-1" style="font-size: 0.5rem; cursor: pointer;" data-tag="${tag}"></span>
        </span>
      `
      )
      .join('');
  };

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      tags.push(tag);
      renderTags();
    }
  };

  tagsInput.addEventListener('keydown', (e) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      addTag(tagsInput.value.trim());
      tagsInput.value = '';
    }
  });

  tagsContainer.addEventListener('click', (e) => {
    if (e.target.dataset.tag) {
      tags = tags.filter((t) => t !== e.target.dataset.tag);
      renderTags();
    }
  });

  renderTags();

  const updatePreview = async () => {
    const text = contentEl.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    wordCountEl.textContent = `${words} words`;

    const preview = await API.getPreview(text);
    previewEl.innerHTML = preview.html;
  };

  contentEl.addEventListener('input', updatePreview);
  updatePreview();

  document.getElementById('back-btn').addEventListener('click', init);

  document.getElementById('editor-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>Saving...`;

    const saveFilename = document.getElementById('filename').value.trim();
    const title = document.getElementById('title').value.trim();
    const layout = document.getElementById('layout').value;
    const date = document.getElementById('date').value;
    const status = document.getElementById('status').value;
    const bodyContent = document.getElementById('content').value;

    const newFrontmatter = {
      ...frontmatter,
      title,
      layout,
      date,
      status,
      tags: tags.join(', '),
    };

    const newFullContent = `---\n${stringifyFrontmatter(newFrontmatter)}\n---\n\n${bodyContent}`;

    const result = await API.saveFile(type, saveFilename, newFullContent);
    if (result.success) {
      alert(`"${saveFilename}" saved successfully!`);
      init();
    } else {
      alert('Error saving file: ' + result.message);
      saveBtn.disabled = false;
      saveBtn.innerHTML = `💾 Save Document`;
    }
  });
};

// Application Bootstrap
const init = async () => {
  try {
    const authStatus = await API.checkAuth();
    if (authStatus.authenticated) {
      const content = await API.getContent();
      renderDashboard(content);
    } else {
      renderLoginPage();
    }
  } catch (e) {
    renderLoginPage();
  }
};

init();
