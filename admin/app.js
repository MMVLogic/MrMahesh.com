const appContainer = document.getElementById('app');

const BASE_URL = 'http://localhost:3000';

const API = {
    login: (username, password) => fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
    }).then(res => res.json()),

    logout: () => fetch(`${BASE_URL}/api/logout`, { method: 'POST', credentials: 'include' }).then(res => res.json()),

    checkAuth: () => fetch(`${BASE_URL}/api/check-auth`, { credentials: 'include' }).then(res => res.json()),

    getLayouts: () => fetch(`${BASE_URL}/api/layouts`, { credentials: 'include' }).then(res => res.json()),

    getContent: () => fetch(`${BASE_URL}/api/content`, { credentials: 'include' }).then(res => res.json()),

    getFile: (type, filename) => fetch(`${BASE_URL}/api/content/${type}/${filename}`, { credentials: 'include' }).then(res => res.json()),

    saveFile: (type, filename, content) => fetch(`${BASE_URL}/api/content/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content }),
        credentials: 'include',
    }).then(res => res.json()),

    deleteFile: (type, filename) => fetch(`${BASE_URL}/api/content/${type}/${filename}`, {
        method: 'DELETE',
        credentials: 'include',
    }).then(res => res.json()),

    getPreview: (markdown) => fetch(`${BASE_URL}/api/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown }),
        credentials: 'include',
    }).then(res => res.json()),
};

const parseFrontmatter = (content) => {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
    if (frontmatterMatch) {
        const frontmatterString = frontmatterMatch[1];
        const body = content.substring(frontmatterMatch[0].length);
        const frontmatter = frontmatterString.split('\n').reduce((acc, line) => {
            const [key, ...value] = line.split(':');
            if (key) {
                acc[key.trim()] = value.join(':').trim();
            }
            return acc;
        }, {});
        return { frontmatter, body };
    }
    return { frontmatter: {}, body: content };
};

const stringifyFrontmatter = (frontmatter) => {
    return Object.entries(frontmatter).map(([key, value]) => `${key}: ${value}`).join('\n');
};


const renderLoginPage = () => {
    appContainer.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title text-center">CMS Login</h3>
                        <form id="login-form">
                            <div class="mb-3">
                                <label for="username" class="form-label">Username</label>
                                <input type="text" class="form-control" id="username" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Login</button>
                            <p id="login-error" class="text-danger mt-2"></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const result = await API.login(username, password);
        if (result.success) {
            init();
        } else {
            document.getElementById('login-error').textContent = 'Invalid credentials';
        }
    });
};

const renderDashboard = (content) => {
    appContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Dashboard</h1>
            <button id="logout-btn" class="btn btn-danger">Logout</button>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h3>Homelab Reports (_projects)</h3>
                <div class="list-group" id="projects-list">
                    ${content.projects.map(p => `
                        <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                            <a href="#" data-type="projects" data-filename="${p}">${p}</a>
                            <button class="btn btn-danger btn-sm delete-btn" data-type="projects" data-filename="${p}">Delete</button>
                        </div>
                    `).join('')}
                </div>
                 <button class="btn btn-success mt-2" id="new-project-btn">New Project</button>
            </div>
            <div class="col-md-6">
                <h3>Weekly Updates (_posts)</h3>
                <div class="list-group" id="posts-list">
                    ${content.posts.map(p => `
                        <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                            <a href="#" data-type="posts" data-filename="${p}">${p}</a>
                            <button class="btn btn-danger btn-sm delete-btn" data-type="posts" data-filename="${p}">Delete</button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-success mt-2" id="new-post-btn">New Post</button>
            </div>
        </div>
    `;

    document.getElementById('logout-btn').addEventListener('click', async () => {
        await API.logout();
        init();
    });

    appContainer.addEventListener('click', async (e) => {
        if (e.target.matches('a')) {
            e.preventDefault();
            const { type, filename } = e.target.dataset;
            renderEditor(type, filename);
        }

        if (e.target.matches('.delete-btn')) {
            const { type, filename } = e.target.dataset;
            if (confirm(`Are you sure you want to delete ${filename}?`)) {
                const result = await API.deleteFile(type, filename);
                if (result.success) {
                    init();
                } else {
                    alert('Error deleting file');
                }
            }
        }
    });
    
    document.getElementById('new-project-btn').addEventListener('click', () => renderEditor('projects'));
    document.getElementById('new-post-btn').addEventListener('click', () => renderEditor('posts'));
};

const renderEditor = async (type, filename) => {
    const [file, layouts] = await Promise.all([
        filename ? API.getFile(type, filename) : { content: '---\ntitle: New Post\nlayout: default\nstatus: In Progress\ntags: \n---\n\n' },
        API.getLayouts()
    ]);

    const { frontmatter, body } = parseFrontmatter(file.content);
    const newFilename = filename ? filename : 'new-post-' + Date.now() + '.md';

    appContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Editor</h2>
            <button id="back-btn" class="btn btn-secondary">Back to Dashboard</button>
        </div>
        <form id="editor-form">
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="filename" class="form-label">Filename</label>
                        <input type="text" class="form-control" id="filename" value="${newFilename}" required>
                    </div>
                    <div class="mb-3">
                        <label for="title" class="form-label">Title</label>
                        <input type="text" class="form-control" id="title" value="${frontmatter.title || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="layout" class="form-label">Layout</label>
                        <select class="form-control" id="layout">
                            ${layouts.map(l => `<option value="${l.replace('.html', '')}" ${frontmatter.layout === l.replace('.html', '') ? 'selected' : ''}>${l.replace('.html', '')}</option>`).join('')}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="status" class="form-label">Status</label>
                        <select class="form-control" id="status">
                            <option value="In Progress" ${frontmatter.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Completed" ${frontmatter.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="On Hold" ${frontmatter.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="tags" class="form-label">Tags</label>
                        <div id="tags-container" class="d-flex flex-wrap gap-2 mb-2"></div>
                        <input type="text" class="form-control" id="tags-input" placeholder="Add tags, separated by commas">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="content" class="form-label">Content (Markdown)</label>
                        <textarea class="form-control" id="content" rows="20">${body}</textarea>
                    </div>
                </div>
            </div>
             <div class="row">
                <div class="col-md-12">
                     <label class="form-label">Preview</label>
                     <div id="preview" class="border p-2" style="min-height: 200px; background: white; overflow-y: auto; max-height: 400px;"></div>
                </div>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Save</button>
        </form>
    `;

    const contentEl = document.getElementById('content');
    const previewEl = document.getElementById('preview');
    const tagsContainer = document.getElementById('tags-container');
    const tagsInput = document.getElementById('tags-input');

    let tags = frontmatter.tags ? frontmatter.tags.split(',').map(t => t.trim()) : [];

    const renderTags = () => {
        tagsContainer.innerHTML = tags.map(tag => `
            <span class="badge bg-secondary d-flex align-items-center">
                ${tag}
                <button type="button" class="btn-close ms-2" aria-label="Remove tag" data-tag="${tag}"></button>
            </span>
        `).join('');
    };

    const addTag = (tag) => {
        if (tag && !tags.includes(tag)) {
            tags.push(tag);
            renderTags();
        }
    };

    tagsInput.addEventListener('keydown', (e) => {
        if (e.key === ',') {
            e.preventDefault();
            addTag(tagsInput.value.trim());
            tagsInput.value = '';
        }
    });

    tagsContainer.addEventListener('click', (e) => {
        if (e.target.matches('.btn-close')) {
            const tagToRemove = e.target.dataset.tag;
            tags = tags.filter(tag => tag !== tagToRemove);
            renderTags();
        }
    });

    renderTags();

    const updatePreview = async () => {
        const preview = await API.getPreview(contentEl.value);
        previewEl.innerHTML = preview.html;
    };

    contentEl.addEventListener('input', updatePreview);
    updatePreview();

    document.getElementById('back-btn').addEventListener('click', init);

    document.getElementById('editor-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newFilename = document.getElementById('filename').value;
        const title = document.getElementById('title').value;
        const layout = document.getElementById('layout').value;
        const status = document.getElementById('status').value;
        const body = document.getElementById('content').value;

        const newFrontmatter = { title, layout, status, tags: tags.join(', ') };
        const newContent = `---\n${stringifyFrontmatter(newFrontmatter)}\n---\n\n${body}`;

        const result = await API.saveFile(type, newFilename, newContent);
        if (result.success) {
            init();
        } else {
            alert('Error saving file');
        }
    });
};


const init = async () => {
    const authStatus = await API.checkAuth();
    if (authStatus.authenticated) {
        const content = await API.getContent();
        renderDashboard(content);
    } else {
        renderLoginPage();
    }
};

init();
