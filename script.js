// Edit this array to add, remove, or update checklist entries.
const programs = [
  {
    id: 'steam',
    name: 'Steam',
    icon: 'S',
    description: 'A popular place to buy, download, and play PC games.',
    downloadUrl: 'https://store.steampowered.com/about/',
    steps: [
      'Open the <a href="https://store.steampowered.com/about/" target="_blank" rel="noopener noreferrer">official Steam download page</a> and select <strong>Install Steam</strong>. Save the installer when your browser asks.',
      'Open your <strong>Downloads</strong> folder and double-click <strong>SteamSetup.exe</strong>. If Windows asks whether to allow this app to make changes, check that the publisher is Valve and choose <strong>Yes</strong>. Never bypass a warning if the publisher or file looks unexpected.',
      'Choose your language and where to install Steam, or keep the suggested choices. Select <strong>Install</strong>, then <strong>Finish</strong>. Steam may update itself; let it complete.',
      'Choose <strong>Create a Free Account</strong> if you are new, then follow the email verification steps. If you already have an account, sign in with your Steam name and password. Use Steam Guard if prompted; it helps protect your account.',
      'When the Steam Library or Store opens, the installation is working. You do not need to buy or download a game to finish setup.'
    ],
    problems: [
      '<strong>The installer will not open:</strong> Check Downloads for SteamSetup.exe and download it again from the official page. If Windows Security blocks it, stop and confirm the file came from store.steampowered.com; do not turn off security protection.',
      '<strong>Steam is updating for a long time:</strong> Check your internet connection and give it a few minutes. Restart Steam and your PC if it appears stuck.',
      '<strong>I cannot sign in:</strong> Check the account name and password, then use Steam’s official account recovery. Never share your password or Steam Guard code.'
    ]
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: 'D',
    description: 'Chat with friends using text, voice, and video.',
    downloadUrl: 'https://discord.com/download',
    steps: [
      'Go to the <a href="https://discord.com/download" target="_blank" rel="noopener noreferrer">official Discord download page</a> and choose the Windows download. Save the installer.',
      'Open your <strong>Downloads</strong> folder and double-click the Discord setup file. If Windows asks for permission, check that the app is Discord and choose <strong>Yes</strong> only if you downloaded it from discord.com.',
      'Discord installs and opens automatically. Let it finish any updates. You can also launch it later from the Start menu by searching for Discord.',
      'Create an account with an email address, username, and password, or sign in to an existing account. Follow any email verification prompt. You can skip joining a server until you have an invite.',
      'When the Discord home screen appears and you can see your account, it is ready. Allow microphone or notification access only if you want to use those features.'
    ],
    problems: [
      '<strong>It keeps updating or will not start:</strong> Close Discord from the system tray near the clock, then open it again. Restart your PC if needed.',
      '<strong>I did not receive a verification email:</strong> Check spam or junk mail and confirm the address you entered. Use Discord’s account help if it still does not arrive.',
      '<strong>Windows Security shows a warning:</strong> Do not disable antivirus. Confirm you used discord.com and check the publisher before deciding whether to continue.'
    ]
  },
  {
    id: 'epic-games',
    name: 'Epic Games Launcher',
    icon: 'E',
    description: 'Browse, download, and launch games from Epic Games.',
    downloadUrl: 'https://store.epicgames.com/en-US/download',
    steps: [
      'Visit the <a href="https://store.epicgames.com/en-US/download" target="_blank" rel="noopener noreferrer">official Epic Games download page</a> and select <strong>Download Epic Games Launcher</strong>. Save the Windows installer.',
      'Open your <strong>Downloads</strong> folder and double-click the Epic Games Launcher installer. If Windows requests permission, confirm it is from Epic Games before selecting <strong>Yes</strong>.',
      'Follow the installer prompts and keep the suggested options if you are unsure. When installation finishes, the launcher may open and download updates.',
      'Sign in with an Epic Games account or choose the option to create one. Complete any email verification. You can also use a supported sign-in option shown by Epic if you already use one.',
      'When the launcher opens to its Store or Library page and shows your account, setup is complete. You can close it and reopen it later from the Start menu.'
    ],
    problems: [
      '<strong>The installer is blocked or looks unfamiliar:</strong> Stop and make sure it came from store.epicgames.com. Do not ignore Windows warnings or disable antivirus.',
      '<strong>The launcher is stuck updating:</strong> Check your internet connection, close and reopen the launcher, and restart your PC if the update does not move.',
      '<strong>I cannot access my account:</strong> Check your email and password, then use Epic’s official account recovery page. Never give anyone your password or verification code.'
    ]
  }
];

const STORAGE_KEY = 'setup-checklist-installed-v1';
const list = document.querySelector('#software-list');
const searchInput = document.querySelector('#search');
const emptyState = document.querySelector('#empty-state');
const progressTitle = document.querySelector('#progress-title');
const progressBar = document.querySelector('.progress-track');
const progressFill = document.querySelector('#progress-fill');
const toast = document.querySelector('#toast');
let activeFilter = 'all';
let toastTimer;

function readProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter(id => programs.some(program => program.id === id)) : []);
  } catch {
    showToast('Progress cannot be loaded or saved in this browser.');
    return new Set();
  }
}

const installed = readProgress();

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...installed]));
    return true;
  } catch {
    showToast('Progress could not be saved in this browser.');
    return false;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function renderCard(program) {
  const isInstalled = installed.has(program.id);
  const safeId = escapeHtml(program.id);
  const safeName = escapeHtml(program.name);
  const safeDescription = escapeHtml(program.description);
  const safeUrl = escapeHtml(program.downloadUrl);
  const steps = program.steps.map(step => `<li>${step}</li>`).join('');
  const problems = program.problems.map(problem => `<li>${problem}</li>`).join('');
  return `
    <article class="software-card" data-id="${safeId}" data-installed="${isInstalled}">
      <div class="card-main">
        <div class="program-identity">
          <div><h3 class="program-name">${safeName}</h3><p class="program-description">${safeDescription}</p></div>
        </div>
        <div class="card-actions">
          <label class="installed-label" for="installed-${safeId}">
            <input id="installed-${safeId}" type="checkbox" data-installed-id="${safeId}" ${isInstalled ? 'checked' : ''}>
            <span>I have installed this</span>
          </label>
          <a class="download-button" href="${safeUrl}" target="_blank" rel="noopener noreferrer">Official download <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <button class="help-toggle" type="button" aria-expanded="false" aria-controls="help-${safeId}">
        <span>Help me install it <span class="guide-platform">(Windows 11)</span></span>
        <span class="chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="help-content" id="help-${safeId}" hidden>
        <h3>Install ${safeName}</h3>
        <ol>${steps}</ol>
        <h3>Having trouble?</h3>
        <ul>${problems}</ul>
      </div>
    </article>`;
}

function updateProgress() {
  const total = programs.length;
  const done = programs.filter(program => installed.has(program.id)).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  progressTitle.textContent = `${done} of ${total} programs installed`;
  progressBar.setAttribute('aria-valuemax', String(total));
  progressBar.setAttribute('aria-valuenow', String(done));
  progressBar.setAttribute('aria-valuetext', `${percent}% complete`);
  progressFill.style.width = `${percent}%`;
  document.querySelector('#count-all').textContent = String(total);
  document.querySelector('#count-todo').textContent = String(total - done);
  document.querySelector('#count-done').textContent = String(done);
}

function renderList() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const visiblePrograms = programs.filter(program => {
    const matchesSearch = `${program.name} ${program.description}`.toLocaleLowerCase().includes(query);
    const matchesFilter = activeFilter === 'all' || (activeFilter === 'installed' ? installed.has(program.id) : !installed.has(program.id));
    return matchesSearch && matchesFilter;
  });
  list.innerHTML = visiblePrograms.map(renderCard).join('');
  emptyState.hidden = visiblePrograms.length > 0;
  updateProgress();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
}

function showCopyFallback(url) {
  const existing = document.querySelector('.copy-fallback');
  if (existing) existing.remove();
  const fallback = document.createElement('div');
  fallback.className = 'copy-fallback';
  fallback.setAttribute('role', 'status');
  fallback.innerHTML = '<label for="share-url">Copy this link manually</label><input id="share-url" type="text" readonly><button type="button" aria-label="Close link field">Close</button>';
  fallback.querySelector('input').value = url;
  fallback.querySelector('button').addEventListener('click', () => fallback.remove());
  document.body.append(fallback);
  fallback.querySelector('input').focus();
  fallback.querySelector('input').select();
  showToast('Select the link and copy it to share.');
}

list.addEventListener('change', event => {
  const checkbox = event.target.closest('[data-installed-id]');
  if (!checkbox) return;
  checkbox.checked ? installed.add(checkbox.dataset.installedId) : installed.delete(checkbox.dataset.installedId);
  saveProgress();
  renderList();
});

list.addEventListener('click', event => {
  const toggle = event.target.closest('.help-toggle');
  if (!toggle) return;
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  document.getElementById(toggle.getAttribute('aria-controls')).hidden = expanded;
});

searchInput.addEventListener('input', renderList);
document.querySelector('.filters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter-button').forEach(filterButton => {
    const active = filterButton === button;
    filterButton.classList.toggle('active', active);
    filterButton.setAttribute('aria-pressed', String(active));
  });
  renderList();
});

document.querySelector('#reset-progress').addEventListener('click', () => document.querySelector('#reset-dialog').showModal());
document.querySelector('#confirm-reset').addEventListener('click', event => {
  event.preventDefault();
  installed.clear();
  saveProgress();
  renderList();
  document.querySelector('#reset-dialog').close();
  showToast('Your checkmarks have been reset.');
});

document.querySelector('#copy-link').addEventListener('click', async () => {
  const url = window.location.href;
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(url);
    showToast('Checklist link copied. Your progress is not included.');
  } catch {
    showCopyFallback(url);
  }
});

document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    searchInput.focus();
  }
});

renderList();