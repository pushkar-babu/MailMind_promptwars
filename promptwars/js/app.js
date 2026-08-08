/**
 * MailMind AI — Application Controller & UI State Manager
 */

// Application State
const state = {
  activeTab: 'inbox',
  emails: [...SAMPLE_EMAILS],
  activeEmailId: 'sample-1',
  activeCategoryFilter: 'all',
  searchQuery: '',
  activeTone: 'Professional',
  currentAnalysis: null,
  allTasks: [],
  apiKey: localStorage.getItem('mailmind_gemini_key') || '',
  activeApiSnippetTab: 'js'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  renderEmailList();
  selectEmail('sample-1');
  renderFormulaSpec();
  updateApiKeyStatusUI();
  updateTasksCountBadge();
}

// Tab Navigation Switcher
function switchTab(tabId) {
  state.activeTab = tabId;

  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

  const targetPane = document.getElementById(`tab-${tabId}`);
  const targetBtn = document.getElementById(`nav-${tabId}-btn`);

  if (targetPane) targetPane.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');

  if (tabId === 'tasks') {
    renderActionItemsMasterList();
  } else if (tabId === 'formula') {
    renderFormulaSpec();
  }

  lucide.createIcons();
}

// Render Sidebar Email List
function renderEmailList() {
  const container = document.getElementById('email-list-container');
  if (!container) return;

  const filtered = state.emails.filter(email => {
    const matchesCategory = state.activeCategoryFilter === 'all' ||
      (state.activeCategoryFilter === 'Phishing' && email.subject.toLowerCase().includes('critical')) ||
      (state.activeCategoryFilter === 'Work' && !email.subject.toLowerCase().includes('invoice') && !email.subject.toLowerCase().includes('invitation')) ||
      (state.activeCategoryFilter === 'Meetings' && (email.subject.toLowerCase().includes('invitation') || email.subject.toLowerCase().includes('sync'))) ||
      (state.activeCategoryFilter === 'Finance' && email.subject.toLowerCase().includes('invoice'));

    const text = `${email.sender} ${email.subject} ${email.body}`.toLowerCase();
    const matchesSearch = !state.searchQuery || text.includes(state.searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  document.getElementById('sample-emails-count').innerText = `${filtered.length} Emails`;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-muted text-sm p-4 text-center">No emails match your filter.</div>`;
    return;
  }

  container.innerHTML = filtered.map(email => {
    const isActive = email.id === state.activeEmailId ? 'active' : '';
    const isPhishing = email.subject.toLowerCase().includes('critical') || email.sender.includes('verify');
    const isHighPriority = email.subject.toLowerCase().includes('urgent') || isPhishing;
    const isMediumPriority = email.subject.toLowerCase().includes('invitation') || email.subject.toLowerCase().includes('invoice');

    const prioClass = isHighPriority ? 'high' : (isMediumPriority ? 'medium' : 'low');
    const prioLabel = isHighPriority ? 'High' : (isMediumPriority ? 'Medium' : 'Low');

    const riskClass = isPhishing ? 'high-risk' : 'safe';
    const riskLabel = isPhishing ? 'Phishing' : 'Safe';

    return `
      <div class="email-item ${isActive}" onclick="selectEmail('${email.id}')">
        <div class="email-item-top">
          <span class="email-item-sender">${escapeHtml(email.sender.split('<')[0])}</span>
          <span class="email-item-time">${escapeHtml(email.date.split('at')[0])}</span>
        </div>
        <div class="email-item-subject">${escapeHtml(email.subject)}</div>
        <div class="email-item-meta">
          <span class="mini-badge ${prioClass}">${prioLabel}</span>
          <span class="mini-badge ${riskClass}">${riskLabel}</span>
        </div>
      </div>
    `;
  }).join('');
}

// Select & Trigger Analysis on an Email
async function selectEmail(emailId) {
  state.activeEmailId = emailId;
  renderEmailList();

  const email = state.emails.find(e => e.id === emailId);
  if (!email) return;

  // Update header meta info
  document.getElementById('view-email-subject').innerText = email.subject;
  document.getElementById('view-email-sender').innerText = email.sender;
  document.getElementById('view-email-recipient').innerText = email.recipient;
  document.getElementById('view-email-date').innerText = email.date;
  document.getElementById('view-email-body-text').innerText = email.body;

  const initials = email.sender.substring(0, 2).toUpperCase();
  document.getElementById('email-avatar').innerText = initials;

  let extras = '';
  if (email.attachments && email.attachments !== 'None') {
    extras += `📎 Attachments: ${email.attachments}  `;
  }
  if (email.links && email.links.length > 0) {
    extras += `🔗 Links: ${email.links.join(', ')}`;
  }
  document.getElementById('view-email-extras').innerText = extras;

  await runAnalysisOnCurrentEmail();
}

// Execute AI Analysis Engine
async function runAnalysisOnCurrentEmail() {
  const email = state.emails.find(e => e.id === state.activeEmailId);
  if (!email) return;

  // UI loading state
  const reportContainer = document.getElementById('analysis-report-container');
  const loadingState = document.getElementById('analysis-loading-state');

  reportContainer.classList.add('hidden');
  loadingState.classList.remove('hidden');

  // Trigger analysis
  const report = await AIAnalyzerEngine.analyze(email, state.apiKey, state.activeTone);
  state.currentAnalysis = report;

  // Update tasks cache
  updateTasksCache(email.id, email.subject, report.tasks);

  // Render Intelligence View
  renderIntelligenceReport(report);

  loadingState.classList.add('hidden');
  reportContainer.classList.remove('hidden');

  lucide.createIcons();
}

// Render Intelligence Report Dashboard
function renderIntelligenceReport(report) {
  // 1. Priority Card
  const priorityBadge = document.getElementById('priority-badge');
  priorityBadge.className = `priority-badge ${report.priority.toLowerCase()}`;
  priorityBadge.innerText = report.priority;

  document.getElementById('priority-reason').innerText = report.priorityReason;
  document.getElementById('category-tag').innerHTML = `<i data-lucide="folder"></i> ${report.category}`;
  document.getElementById('sentiment-tag').innerHTML = `<i data-lucide="smile"></i> ${report.sentiment}`;

  // 2. Risk Card
  const riskBadge = document.getElementById('risk-badge');
  const riskClass = report.risk === 'High Risk' ? 'high-risk' : (report.risk === 'Suspicious' ? 'suspicious' : 'safe');
  riskBadge.className = `risk-badge ${riskClass}`;
  riskBadge.innerText = report.risk;

  const indicatorsContainer = document.getElementById('risk-indicators-container');
  indicatorsContainer.innerHTML = report.riskIndicators.map(ind => {
    const isAlert = report.risk !== 'Safe';
    const icon = isAlert ? 'shield-alert' : 'shield-check';
    const itemClass = isAlert ? 'risk-alert' : 'safe-item';
    return `<div class="indicator-item ${itemClass}"><i data-lucide="${icon}"></i> ${escapeHtml(ind)}</div>`;
  }).join('');

  // 3. Summary
  document.getElementById('summary-text').innerText = report.summary;

  // 4. Extracted Tasks
  const tasksContainer = document.getElementById('tasks-list-container');
  document.getElementById('extracted-tasks-count').innerText = `${report.tasks.length} Tasks`;

  if (report.tasks.length === 0 || report.tasks[0].description.includes('No actionable tasks')) {
    tasksContainer.innerHTML = `<p class="text-muted text-sm">No actionable tasks detected in this email.</p>`;
  } else {
    tasksContainer.innerHTML = report.tasks.map((task, idx) => {
      const urgencyClass = task.urgency.toLowerCase();
      const completedClass = task.completed ? 'completed' : '';
      return `
        <div class="task-item">
          <div class="task-checkbox-wrapper">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion('${state.activeEmailId}', ${idx})">
            <div class="task-content">
              <span class="task-desc ${completedClass}">${escapeHtml(task.description)}</span>
              <div class="task-submeta">
                <span><i data-lucide="user"></i> Assignee: <strong>${escapeHtml(task.responsible)}</strong></span>
                <span><i data-lucide="clock"></i> Deadline: <strong>${escapeHtml(task.deadline)}</strong></span>
              </div>
            </div>
          </div>
          <span class="task-urgency-tag ${urgencyClass}">${task.urgency}</span>
        </div>
      `;
    }).join('');
  }

  // 5. Meeting / Event Details
  const meetingContainer = document.getElementById('meeting-details-container');
  const icsBtn = document.getElementById('download-ics-btn');

  if (report.meeting) {
    icsBtn.classList.remove('hidden');
    meetingContainer.innerHTML = `
      <div class="event-details-box">
        <div class="event-title"><i data-lucide="calendar"></i> ${escapeHtml(report.meeting.title)}</div>
        <div class="event-meta-item"><i data-lucide="clock"></i> Date & Time: ${escapeHtml(report.meeting.date)} (${escapeHtml(report.meeting.startTime)} - ${escapeHtml(report.meeting.endTime)})</div>
        <div class="event-meta-item"><i data-lucide="map-pin"></i> Location / Link: <a href="${escapeHtml(report.meeting.location)}" target="_blank" class="btn-text-sm">${escapeHtml(report.meeting.location)}</a></div>
        <div class="event-meta-item"><i data-lucide="users"></i> Participants: ${escapeHtml(report.meeting.participants)}</div>
        ${report.meeting.notes ? `<div class="event-meta-item"><i data-lucide="info"></i> Notes: ${escapeHtml(report.meeting.notes)}</div>` : ''}
      </div>
    `;
  } else {
    icsBtn.classList.add('hidden');
    meetingContainer.innerHTML = `<p class="text-muted text-sm">No calendar events or meeting invitations detected.</p>`;
  }

  // 6. Follow-up Suggestion
  document.getElementById('followup-suggestion').innerHTML = `<i data-lucide="bell"></i> ${escapeHtml(report.followup)}`;

  // 7. Smart Reply & Language
  document.getElementById('detected-language-badge').innerText = `Language: ${report.language}`;
  document.getElementById('smart-reply-textarea').value = report.suggestedReply;

  // 8. Raw Standardized Structured Output
  document.getElementById('raw-prompt-output-text').innerText = report.formattedRawReport;
}

// Change Reply Tone
function changeReplyTone(tone) {
  state.activeTone = tone;
  document.querySelectorAll('.tone-btn').forEach(btn => {
    btn.classList.toggle('active', btn.innerText === tone);
  });

  if (state.currentAnalysis) {
    const email = state.emails.find(e => e.id === state.activeEmailId);
    const newReply = AIAnalyzerEngine.generateSmartReply(
      email,
      state.currentAnalysis.category,
      state.currentAnalysis.tasks,
      state.currentAnalysis.meeting,
      state.currentAnalysis.language,
      tone,
      state.currentAnalysis.risk
    );
    document.getElementById('smart-reply-textarea').value = newReply;
  }
}

// Tasks & Action Center Management
function updateTasksCache(emailId, emailSubject, tasks) {
  state.allTasks = state.allTasks.filter(t => t.emailId !== emailId);
  tasks.forEach((task, idx) => {
    if (!task.description.includes('No actionable tasks')) {
      state.allTasks.push({
        ...task,
        emailId,
        emailSubject,
        taskIdx: idx
      });
    }
  });
  updateTasksCountBadge();
}

function updateTasksCountBadge() {
  const pending = state.allTasks.filter(t => !t.completed).length;
  const badge = document.getElementById('tasks-count-badge');
  if (badge) badge.innerText = pending;
}

function toggleTaskCompletion(emailId, taskIdx) {
  const task = state.allTasks.find(t => t.emailId === emailId && t.taskIdx === taskIdx);
  if (task) {
    task.completed = !task.completed;
    if (task.completed && typeof confetti === 'function') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
  }
  if (state.activeEmailId === emailId && state.currentAnalysis) {
    state.currentAnalysis.tasks[taskIdx].completed = !state.currentAnalysis.tasks[taskIdx].completed;
    renderIntelligenceReport(state.currentAnalysis);
  }
  updateTasksCountBadge();
}

function renderActionItemsMasterList(filterStatus = 'all') {
  const container = document.getElementById('action-items-master-list');
  if (!container) return;

  const items = state.allTasks.filter(t => {
    if (filterStatus === 'pending') return !t.completed;
    if (filterStatus === 'completed') return t.completed;
    return true;
  });

  if (items.length === 0) {
    container.innerHTML = `<div class="glass-card text-center p-6 text-muted">No action items found in this view.</div>`;
    return;
  }

  container.innerHTML = items.map(task => `
    <div class="glass-card mb-3">
      <div class="task-item">
        <div class="task-checkbox-wrapper">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion('${task.emailId}', ${task.taskIdx}); renderActionItemsMasterList('${filterStatus}');">
          <div class="task-content">
            <span class="task-desc ${task.completed ? 'completed' : ''}">${escapeHtml(task.description)}</span>
            <div class="task-submeta mt-1">
              <span><i data-lucide="mail"></i> Email: <strong>${escapeHtml(task.emailSubject)}</strong></span>
              <span><i data-lucide="user"></i> Assignee: <strong>${escapeHtml(task.responsible)}</strong></span>
              <span><i data-lucide="clock"></i> Due: <strong>${escapeHtml(task.deadline)}</strong></span>
            </div>
          </div>
        </div>
        <span class="task-urgency-tag ${task.urgency.toLowerCase()}">${task.urgency}</span>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function filterActionItems(filter) {
  document.querySelectorAll('.tasks-filter-group .filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderActionItemsMasterList(filter);
}

// Download .ics Calendar File
function downloadIcsFile() {
  if (!state.currentAnalysis || !state.currentAnalysis.meeting) return;
  const m = state.currentAnalysis.meeting;

  const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MailMind AI//Email Assistant Calendar Export//EN
BEGIN:VEVENT
SUMMARY:${m.title}
DESCRIPTION:${m.notes || 'Exported from MailMind AI Email Assistant'}
LOCATION:${m.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${m.title.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Calendar event downloaded as .ics file!");
}

// Formula Spec Page Renderer
function renderFormulaSpec() {
  const promptEl = document.getElementById('formula-system-prompt-display');
  if (promptEl) promptEl.innerText = SYSTEM_PROMPT_FORMULA;

  switchApiTab(state.activeApiSnippetTab);
}

function switchApiTab(lang) {
  state.activeApiSnippetTab = lang;
  document.querySelectorAll('.code-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(lang));
  });

  const snippetEl = document.getElementById('api-snippet-display');
  if (snippetEl && API_SNIPPETS[lang]) {
    snippetEl.innerText = API_SNIPPETS[lang];
  }
}

function copyPromptFormula() {
  copyToClipboard(SYSTEM_PROMPT_FORMULA, "Full Magic System Prompt copied to clipboard!");
}

// Custom Email Submission
function openNewEmailModal() {
  document.getElementById('modal-email-input').classList.remove('hidden');
}

function handleCustomEmailSubmit(e) {
  e.preventDefault();

  const sender = document.getElementById('input-sender').value;
  const recipient = document.getElementById('input-recipient').value;
  const subject = document.getElementById('input-subject').value;
  const date = document.getElementById('input-date').value || new Date().toLocaleString();
  const body = document.getElementById('input-body').value;
  const attachments = document.getElementById('input-attachments').value || 'None';
  const language = document.getElementById('input-language').value;

  const newEmail = {
    id: `custom-${Date.now()}`,
    sender,
    recipient,
    subject,
    date,
    body,
    attachments,
    links: [],
    userLanguage: language
  };

  state.emails.unshift(newEmail);
  closeModal('modal-email-input');
  document.getElementById('custom-email-form').reset();

  showToast("Custom email added!");
  selectEmail(newEmail.id);
}

// Search & Filter Handlers
function handleSearchFilter() {
  state.searchQuery = document.getElementById('email-search-input').value;
  renderEmailList();
}

function filterByCategory(cat) {
  state.activeCategoryFilter = cat;
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.innerText.toLowerCase() === cat.toLowerCase());
  });
  renderEmailList();
}

// API Key Modal
function openApiKeyModal() {
  document.getElementById('api-key-input').value = state.apiKey;
  document.getElementById('modal-api-key').classList.remove('hidden');
}

function saveApiKey() {
  const key = document.getElementById('api-key-input').value.trim();
  state.apiKey = key;
  localStorage.setItem('mailmind_gemini_key', key);
  updateApiKeyStatusUI();
  closeModal('modal-api-key');
  showToast(key ? "Gemini API Key saved!" : "Using built-in offline NLP engine.");
  runAnalysisOnCurrentEmail();
}

function clearApiKey() {
  state.apiKey = '';
  localStorage.removeItem('mailmind_gemini_key');
  document.getElementById('api-key-input').value = '';
  updateApiKeyStatusUI();
  closeModal('modal-api-key');
  showToast("Cleared API key.");
  runAnalysisOnCurrentEmail();
}

function updateApiKeyStatusUI() {
  const label = document.getElementById('api-key-status-label');
  const statusBox = document.getElementById('api-status-box');
  if (state.apiKey) {
    if (label) label.innerText = "Gemini LLM (Active)";
    if (statusBox) statusBox.innerHTML = `<i data-lucide="check-circle"></i> Live Gemini 1.5 API Active`;
  } else {
    if (label) label.innerText = "LLM Settings";
    if (statusBox) statusBox.innerHTML = `<i data-lucide="info"></i> Built-in Magic Prompt Rule Engine`;
  }
}

// Helper Utilities
function toggleRawEmail() {
  const container = document.getElementById('raw-email-container');
  container.classList.toggle('hidden');
}

function triggerCurrentAnalysis() {
  runAnalysisOnCurrentEmail();
  showToast("Re-analyzed email intelligence.");
}

function sendReplySimulation() {
  showToast("Smart reply dispatched to recipient!");
}

function copyText(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.value || el.innerText;
  copyToClipboard(text, "Copied to clipboard!");
}

function copyToClipboard(text, msg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(msg);
  }).catch(() => {
    showToast("Failed to copy.");
  });
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i data-lucide="sparkles"></i> <span>${escapeHtml(msg)}</span>`;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
