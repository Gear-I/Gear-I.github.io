// ── GitHub repos via Cloudflare Worker proxy ──
async function fetchGitHubRepos() {
    const projectGrid = document.querySelector('.projects-grid');
    const repoCountEl = document.getElementById('repo-count');
    const workerUrl = 'https://gear.ddenoon748.workers.dev';
    try {
        const response = await fetch(workerUrl);
        if (!response.ok) throw new Error('Proxy error or rate issue');
        const repos = await response.json();
        const visibleRepos = repos.filter(repo => !repo.fork);

        if (repoCountEl) repoCountEl.textContent = visibleRepos.length;

        projectGrid.innerHTML = '';
        visibleRepos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';
            const tagsHTML = repo.topics && repo.topics.length > 0
                ? repo.topics.map(topic => `<span class="tag">${topic}</span>`).join('')
                : `<span class="tag">${repo.language || 'Project'}</span>`;
            card.innerHTML = `
                <h3>
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor" style="color: var(--muted);"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8Z"></path></svg>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
                </h3>
                <p>${repo.description || 'No description provided.'}</p>
                <div class="tags">${tagsHTML}</div>
            `;
            projectGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching data through proxy:', error);
        projectGrid.innerHTML = '<p style="color: var(--muted); font-size: 0.85rem;">Failed to load project items.</p>';
    }
}
document.addEventListener('DOMContentLoaded', fetchGitHubRepos);// JavaScript source code
