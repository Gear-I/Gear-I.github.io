// ── GitHub repos via Cloudflare Worker proxy ──

// Repos to exclude from the portfolio display (case-insensitive match on repo name).
// These stay public on GitHub — they're just not shown here.
// Add more names to this list to hide additional repos.
const HIDDEN_REPOS = ['gear-i.github.io', 'ileapp', 'aleapp', 'dleapp', 'plaso', 'velociraptor', 'corrobora'];

// Per-repo icon shown next to the name (case-insensitive match on repo name).
// Add an entry here any time you want a specific repo to get its own icon —
// anything not listed falls back to DEFAULT_REPO_ICON.
const REPO_ICONS = {
    'aleapp': '🤖',
    'ileapp': '📱',
    'dleapp': '🖥️',
    'corrobora': '🛡️',
    'plaso': '⏱️',
    'velociraptor': '🦖',
    'browser_ai': '🌐',
    'cyberhawk_enumerator': '🦅',
    'passgen': '🔑',
    'public-test-data': '🔍',
};
const DEFAULT_REPO_ICON = '📦';

// Maps GitHub's repo.language values to Simple Icons slugs (simpleicons.org)
// for the small tech-logo icon on each project row. Unmapped languages just
// skip the icon — add more entries here as needed.
const LANGUAGE_ICONS = {
    'JavaScript': 'javascript',
    'TypeScript': 'typescript',
    'Python': 'python',
    'Java': 'openjdk',
    'C': 'c',
    'C++': 'cplusplus',
    'C#': 'csharp',
    'Go': 'go',
    'Rust': 'rust',
    'Ruby': 'ruby',
    'PHP': 'php',
    'Swift': 'swift',
    'Kotlin': 'kotlin',
    'Dart': 'dart',
    'HTML': 'html5',
    'CSS': 'css3',
    'Shell': 'gnubash',
    'PowerShell': 'powershell',
    'Jupyter Notebook': 'jupyter',
    'Vue': 'vuedotjs',
    'R': 'r',
    'Perl': 'perl',
    'Scala': 'scala',
    'Lua': 'lua',
    'Dockerfile': 'docker',
    'Objective-C': 'apple',
};

function languageIconHTML(language) {
    const slug = language && LANGUAGE_ICONS[language];
    if (!slug) return '';
    return `<img class="lang-icon" src="https://cdn.simpleicons.org/${slug}" alt="${language}" title="${language}" onerror="this.remove()" />`;
}

async function fetchGitHubRepos() {
    const projectList = document.querySelector('.projects-list');
    const repoCountEl = document.getElementById('stat-repos');
    const starsEl = document.getElementById('stat-stars');
    const workerUrl = 'https://gear.ddenoon748.workers.dev';
    try {
        const response = await fetch(workerUrl);
        if (!response.ok) throw new Error('Proxy error or rate issue');
        const repos = await response.json();
        // Show everything except explicitly hidden repos (forks included,
        // e.g. iLEAPP/ALEAPP contributions).
        const visibleRepos = repos.filter(repo => !HIDDEN_REPOS.includes(repo.name.toLowerCase()));

        if (repoCountEl) repoCountEl.textContent = visibleRepos.length;
        if (starsEl) {
            const totalStars = visibleRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
            starsEl.textContent = totalStars;
        }

        projectList.innerHTML = '';
        visibleRepos.forEach(repo => {
            const details = document.createElement('details');
            details.className = 'reveal in';
            const repoIcon = REPO_ICONS[repo.name.toLowerCase()] || DEFAULT_REPO_ICON;
            const tagsHTML = repo.topics && repo.topics.length > 0
                ? repo.topics.map(topic => `<span class="tag">${topic}</span>`).join('')
                : '';
            details.innerHTML = `
                <summary>
                    <span class="repo-summary-main">
                        <span class="repo-icon" aria-hidden="true">${repoIcon}</span>
                        ${repo.name}
                        ${languageIconHTML(repo.language)}
                    </span>
                </summary>
                <div class="db">
                    <p>${repo.description || 'No description provided.'}</p>
                    ${tagsHTML ? `<div class="tags">${tagsHTML}</div>` : ''}
                    <p><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub ↗</a></p>
                </div>
            `;
            projectList.appendChild(details);
        });
    } catch (error) {
        console.error('Error fetching data through proxy:', error);
        projectList.innerHTML = '<p style="color: var(--slate); font-size: 0.85rem;">Failed to load project items.</p>';
    }
}
document.addEventListener('DOMContentLoaded', fetchGitHubRepos);
