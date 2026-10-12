/**
 * Skill Nexus - Industry SkillBridge
 * Application Engine & Reactive State Controller
 */

// ==========================================================================
// STATE MANAGEMENT & PERSISTENCE
// ==========================================================================

const STORAGE_KEY = 'skill_nexus_v1_data';

class AppState {
  constructor() {
    this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.students = parsed.students || INITIAL_STUDENTS;
        this.companies = parsed.companies || INITIAL_COMPANIES;
        this.opportunities = parsed.opportunities || INITIAL_OPPORTUNITIES;
        this.applications = parsed.applications || INITIAL_APPLICATIONS;
        this.learningPrograms = parsed.learningPrograms || INITIAL_LEARNING_PROGRAMS;
        this.scheduledInterventions = parsed.scheduledInterventions || [
          {
            id: "int_1",
            type: "Workshop",
            partner: "TechNova",
            skill: "SQL",
            date: "2026-10-18",
            scope: "Hands-on SQL query optimization and enterprise warehouse schemas."
          },
          {
            id: "int_2",
            type: "Guest Lecture",
            partner: "CodeSphere",
            skill: "Problem Solving",
            date: "2026-10-22",
            scope: "Algorithmic patterns and scalability in backend distributed systems."
          }
        ];
        this.currentRole = parsed.currentRole || 'landing'; // 'landing', 'student', 'industry', 'institution'
        this.currentStudentId = parsed.currentStudentId || 'stud_1'; // Arun Kumar default
        this.currentCompanyId = parsed.currentCompanyId || 'comp_1'; // TechNova default
        this.currentView = parsed.currentView || 'landing';
        this.selectedOpportunityId = parsed.selectedOpportunityId || this.opportunities[0].id;
        this.deptFilter = parsed.deptFilter || 'All';
        return;
      } catch (e) {
        console.error('Failed to parse state from localStorage, resetting', e);
      }
    }
    this.resetToDefaults();
  }

  saveState() {
    const dataToSave = {
      students: this.students,
      companies: this.companies,
      opportunities: this.opportunities,
      applications: this.applications,
      learningPrograms: this.learningPrograms,
      scheduledInterventions: this.scheduledInterventions,
      currentRole: this.currentRole,
      currentStudentId: this.currentStudentId,
      currentCompanyId: this.currentCompanyId,
      currentView: this.currentView,
      selectedOpportunityId: this.selectedOpportunityId,
      deptFilter: this.deptFilter
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }

  resetToDefaults() {
    this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
    this.companies = JSON.parse(JSON.stringify(INITIAL_COMPANIES));
    this.opportunities = JSON.parse(JSON.stringify(INITIAL_OPPORTUNITIES));
    this.applications = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));
    this.learningPrograms = JSON.parse(JSON.stringify(INITIAL_LEARNING_PROGRAMS));
    this.scheduledInterventions = [
      {
        id: "int_1",
        type: "Workshop",
        partner: "TechNova",
        skill: "SQL",
        date: "2026-10-18",
        scope: "Hands-on SQL query optimization and enterprise warehouse schemas."
      },
      {
        id: "int_2",
        type: "Guest Lecture",
        partner: "CodeSphere",
        skill: "Problem Solving",
        date: "2026-10-22",
        scope: "Algorithmic patterns and scalability in backend distributed systems."
      }
    ];
    this.currentRole = 'landing';
    this.currentStudentId = 'stud_1';
    this.currentCompanyId = 'comp_1';
    this.currentView = 'landing';
    this.selectedOpportunityId = 'opp_1';
    this.deptFilter = 'All';
    this.saveState();
  }

  getCurrentStudent() {
    return this.students.find(s => s.id === this.currentStudentId) || this.students[0];
  }

  getCurrentCompany() {
    return this.companies.find(c => c.id === this.currentCompanyId) || this.companies[0];
  }

  updateStudentSkills(studentId, newSkills, targetRole = null) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.skills = { ...student.skills, ...newSkills };
      student.assessed = true;
      if (targetRole) student.targetRole = targetRole;
      this.saveState();
    }
  }

  boostSkill(studentId, skillName, amount = 20) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      const current = student.skills[skillName] || 0;
      student.skills[skillName] = Math.min(100, current + amount);
      student.assessed = true;
      this.saveState();
    }
  }

  applyForOpportunity(studentId, opportunityId) {
    const opp = this.opportunities.find(o => o.id === opportunityId);
    const student = this.students.find(s => s.id === studentId);
    if (!opp || !student) return null;

    // Check if already applied
    const existing = this.applications.find(a => a.studentId === studentId && a.opportunityId === opportunityId);
    if (existing) return existing;

    const matchInfo = calculateMatch(student.skills, opp.requiredSkills);
    const newApp = {
      id: 'app_' + Date.now(),
      studentId,
      opportunityId,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      matchPercentage: matchInfo.matchPercentage,
      feedback: ''
    };
    this.applications.unshift(newApp);
    this.saveState();
    return newApp;
  }

  updateApplicationStatus(applicationId, newStatus, feedback = '') {
    const app = this.applications.find(a => a.id === applicationId);
    if (app) {
      app.status = newStatus;
      if (feedback) app.feedback = feedback;
      this.saveState();
      return app;
    }
    return null;
  }

  ensureApplicationForCandidate(studentId, opportunityId, newStatus, feedback = '') {
    let app = this.applications.find(a => a.studentId === studentId && a.opportunityId === opportunityId);
    if (app) {
      app.status = newStatus;
      if (feedback) app.feedback = feedback;
    } else {
      const student = this.students.find(s => s.id === studentId);
      const opp = this.opportunities.find(o => o.id === opportunityId);
      const matchInfo = calculateMatch(student.skills, opp.requiredSkills);
      app = {
        id: 'app_' + Date.now(),
        studentId,
        opportunityId,
        status: newStatus,
        appliedDate: new Date().toISOString().split('T')[0],
        matchPercentage: matchInfo.matchPercentage,
        feedback: feedback || `Candidate status set to ${newStatus} by industry partner.`
      };
      this.applications.unshift(app);
    }
    this.saveState();
    return app;
  }

  addOpportunity(newOpp) {
    this.opportunities.unshift(newOpp);
    this.saveState();
  }
}

const state = new AppState();

// ==========================================================================
// CORE MATCHING ENGINE (EXACT FORMULA SPECIFICATION)
// ==========================================================================

/**
 * EXACT MATCHING FORMULA IMPLEMENTATION:
 * For each required skill i with required level req_i and weight w_i (default 1):
 *   skill_match_i = min(student_score_i / req_i, 1)   (missing skill = 0)
 *   Match % = round( Σ(w_i * skill_match_i) / Σ w_i * 100 )
 * Status: ✓ Met if student_score_i >= req_i, otherwise ⚠ Gap, with gap_size = req_i - student_score_i
 * Top gaps = Gap skills sorted by gap_size, descending (top 3)
 * Labels: >=80% Strong Match, 60-79% Good Match, <60% Stretch
 */
function calculateMatch(studentScores = {}, requiredSkills = {}, weights = {}) {
  const reqEntries = Object.entries(requiredSkills);
  if (reqEntries.length === 0) {
    return {
      matchPercentage: 0,
      label: 'Stretch',
      labelClass: 'badge-stretch',
      breakdown: [],
      topGaps: [],
      metCount: 0,
      totalRequired: 0,
      formulaString: 'No requirements specified'
    };
  }

  let weightedMatchSum = 0;
  let totalWeights = 0;
  const breakdown = [];
  const gaps = [];
  const contributions = [];

  reqEntries.forEach(([skill, reqLevel]) => {
    const studentScore = studentScores[skill] || 0;
    const weight = weights[skill] || 1;
    totalWeights += weight;

    // skill_match_i = min(student_score_i / req_i, 1)
    const ratio = reqLevel > 0 ? Math.min(studentScore / reqLevel, 1) : 1;
    weightedMatchSum += weight * ratio;

    const isMet = studentScore >= reqLevel;
    const gapSize = Math.max(0, reqLevel - studentScore);

    const item = {
      skill,
      required: reqLevel,
      current: studentScore,
      ratio: ratio,
      status: isMet ? 'met' : 'gap',
      gapSize,
      weight
    };

    breakdown.push(item);
    if (!isMet && gapSize > 0) {
      gaps.push(item);
    }

    // Format for formula breakdown demonstration
    const formattedRatio = Number(ratio.toFixed(2));
    if (weight !== 1) {
      contributions.push(`(${weight}×${formattedRatio})`);
    } else {
      contributions.push(formattedRatio);
    }
  });

  // Match % = round( Σ(w_i * skill_match_i) / Σ w_i * 100 )
  const matchPercentage = Math.round((weightedMatchSum / totalWeights) * 100);

  // Sort gaps descending by gap_size
  gaps.sort((a, b) => b.gapSize - a.gapSize);
  const topGaps = gaps.slice(0, 3);

  let label = 'Stretch';
  let labelClass = 'badge-stretch';
  if (matchPercentage >= 80) {
    label = 'Strong Match';
    labelClass = 'badge-strong';
  } else if (matchPercentage >= 60) {
    label = 'Good Match';
    labelClass = 'badge-good';
  }

  const denom = totalWeights % 1 === 0 ? totalWeights : Number(totalWeights.toFixed(1));
  const formulaString = `(${contributions.join(' + ')}) / ${denom} = ${matchPercentage}%`;

  return {
    matchPercentage,
    label,
    labelClass,
    breakdown,
    topGaps,
    metCount: breakdown.filter(b => b.status === 'met').length,
    totalRequired: reqEntries.length,
    formulaString
  };
}

/**
 * Career Readiness Calculation vs Target Role
 */
function getStudentCareerReadiness(student) {
  if (!student || !student.assessed) {
    return {
      matchPercentage: 0,
      label: 'Not Assessed',
      labelClass: 'badge-stretch',
      breakdown: [],
      topGaps: [],
      targetRole: student ? student.targetRole : 'Data Analyst'
    };
  }

  const roleDef = TARGET_ROLES[student.targetRole] || TARGET_ROLES['Data Analyst'];
  const matchResult = calculateMatch(student.skills, roleDef.requirements);
  return {
    ...matchResult,
    targetRole: student.targetRole
  };
}

// ==========================================================================
// TOAST & MODAL UTILITIES
// ==========================================================================

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function openModal(title, bodyHtml, footerHtml = '') {
  const overlay = document.getElementById('globalModalOverlay');
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalBody');
  const footerEl = document.getElementById('modalFooter');

  titleEl.innerText = title;
  bodyEl.innerHTML = bodyHtml;
  footerEl.innerHTML = footerHtml;

  overlay.classList.add('open');
}

function closeModal() {
  const overlay = document.getElementById('globalModalOverlay');
  overlay.classList.remove('open');
}

// ==========================================================================
// RENDERERS: ROUTING & VIEWS
// ==========================================================================

function setRole(role) {
  state.currentRole = role;
  if (role === 'landing') {
    state.currentView = 'landing';
  } else if (role === 'student') {
    state.currentView = 'student-dashboard';
  } else if (role === 'industry') {
    state.currentView = 'industry-dashboard';
  } else if (role === 'institution') {
    state.currentView = 'institution-dashboard';
  }
  state.saveState();
  renderApp();
}

function navigateTo(view) {
  state.currentView = view;
  state.saveState();
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderApp() {
  renderHeader();
  renderSidebar();
  renderMainView();
}

// Header Renderer
function renderHeader() {
  const headerUserPill = document.getElementById('headerUserPill');
  const roleButtons = document.querySelectorAll('.role-switch-btn');

  roleButtons.forEach(btn => {
    const role = btn.dataset.role;
    if (role === state.currentRole) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (state.currentRole === 'landing') {
    headerUserPill.innerHTML = `
      <span style="font-size:0.8rem; font-weight:700; color:var(--slate-500)">Role Selector</span>
    `;
    return;
  }

  if (state.currentRole === 'student') {
    const student = state.getCurrentStudent();
    headerUserPill.innerHTML = `
      <div class="user-avatar-small">${student.avatar}</div>
      <div style="display:flex; flex-direction:column; line-height:1.2;">
        <span style="font-weight:700; font-size:0.8rem; color:var(--slate-900);">${student.name}</span>
        <span style="font-size:0.68rem; color:var(--primary-700); font-weight:600;">Student (${student.targetRole})</span>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    `;
    headerUserPill.onclick = () => openStudentSwitcherModal();
  } else if (state.currentRole === 'industry') {
    const company = state.getCurrentCompany();
    headerUserPill.innerHTML = `
      <div class="user-avatar-small" style="background:var(--blue-600)">${company.logo}</div>
      <div style="display:flex; flex-direction:column; line-height:1.2;">
        <span style="font-weight:700; font-size:0.8rem; color:var(--slate-900);">${company.name}</span>
        <span style="font-size:0.68rem; color:var(--blue-600); font-weight:600;">Industry Recruiter</span>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    `;
    headerUserPill.onclick = () => openCompanySwitcherModal();
  } else if (state.currentRole === 'institution') {
    headerUserPill.innerHTML = `
      <div class="user-avatar-small" style="background:#7c3aed">IN</div>
      <div style="display:flex; flex-direction:column; line-height:1.2;">
        <span style="font-weight:700; font-size:0.8rem; color:var(--slate-900);">Campus Academic Dean</span>
        <span style="font-size:0.68rem; color:#7c3aed; font-weight:600;">Institution Dashboard</span>
      </div>
    `;
    headerUserPill.onclick = null;
  }
}

// Sidebar Renderer
function renderSidebar() {
  const sidebar = document.getElementById('appSidebar');
  const sidebarNavList = document.getElementById('sidebarNavList');
  const sidebarProfile = document.getElementById('sidebarProfile');

  if (state.currentRole === 'landing') {
    sidebar.style.display = 'none';
    return;
  } else {
    sidebar.style.display = 'flex';
  }

  let navItems = [];
  let profileHtml = '';

  if (state.currentRole === 'student') {
    const student = state.getCurrentStudent();
    const readiness = getStudentCareerReadiness(student);
    const myAppsCount = state.applications.filter(a => a.studentId === student.id).length;

    profileHtml = `
      <div class="sidebar-avatar">${student.avatar}</div>
      <div class="sidebar-user-meta">
        <div class="sidebar-user-name">${student.name}</div>
        <div class="sidebar-user-role">${student.targetRole} • ${student.assessed ? readiness.matchPercentage + '% Ready' : 'Unassessed'}</div>
      </div>
    `;

    navItems = [
      { id: 'student-dashboard', label: 'Student Dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
      { id: 'student-assessment', label: 'Skill Assessment', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', badge: student.assessed ? 'Retake' : 'Start' },
      { id: 'student-profile-gaps', label: 'Skill Profile & Gaps', icon: 'M18 20V10 M12 20V4 M6 20v-6' },
      { id: 'student-opportunities', label: 'Recommended Opportunities', icon: 'M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2' },
      { id: 'student-applications', label: 'My Applications', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2', badge: myAppsCount > 0 ? myAppsCount : null }
    ];
  } else if (state.currentRole === 'industry') {
    const company = state.getCurrentCompany();
    const companyOpps = state.opportunities.filter(o => o.companyName === company.name);
    const companyApps = state.applications.filter(a => companyOpps.some(o => o.id === a.opportunityId));

    profileHtml = `
      <div class="sidebar-avatar" style="background:var(--blue-600);">${company.logo}</div>
      <div class="sidebar-user-meta">
        <div class="sidebar-user-name">${company.name}</div>
        <div class="sidebar-user-role">${company.industry}</div>
      </div>
    `;

    navItems = [
      { id: 'industry-dashboard', label: 'Industry Dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
      { id: 'industry-post-opp', label: 'Post Opportunity', icon: 'M12 5v14M5 12h14' },
      { id: 'industry-my-opps', label: 'My Opportunities', icon: 'M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2', badge: companyOpps.length },
      { id: 'industry-candidates', label: 'Candidate Matches', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', badge: companyApps.length }
    ];
  } else if (state.currentRole === 'institution') {
    profileHtml = `
      <div class="sidebar-avatar" style="background:#7c3aed;">IN</div>
      <div class="sidebar-user-meta">
        <div class="sidebar-user-name">Institution Portal</div>
        <div class="sidebar-user-role">Academia & Placement</div>
      </div>
    `;

    navItems = [
      { id: 'institution-dashboard', label: 'Institution Dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
      { id: 'institution-gaps', label: 'Student Skill Analytics', icon: 'M18 20V10 M12 20V4 M6 20v-6' },
      { id: 'institution-roster', label: 'Student Cohort Roster', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }
    ];
  }

  sidebarProfile.innerHTML = profileHtml;

  sidebarNavList.innerHTML = navItems.map(item => `
    <li class="sidebar-nav-item ${state.currentView === item.id ? 'active' : ''}">
      <button onclick="navigateTo('${item.id}')">
        <span class="sidebar-nav-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="${item.icon}"/>
          </svg>
        </span>
        <span>${item.label}</span>
        ${item.badge ? `<span class="sidebar-badge">${item.badge}</span>` : ''}
      </button>
    </li>
  `).join('');
}

// Main View Router
function renderMainView() {
  const container = document.getElementById('mainViewport');
  if (!container) return;

  switch (state.currentView) {
    case 'landing':
      container.innerHTML = renderLandingView();
      break;
    case 'student-dashboard':
      container.innerHTML = renderStudentDashboard();
      break;
    case 'student-assessment':
      container.innerHTML = renderAssessmentView();
      initAssessmentStepEvents();
      break;
    case 'student-profile-gaps':
      container.innerHTML = renderStudentProfileGaps();
      break;
    case 'student-opportunities':
      container.innerHTML = renderRecommendedOpportunities();
      break;
    case 'student-applications':
      container.innerHTML = renderStudentApplications();
      break;
    case 'industry-dashboard':
      container.innerHTML = renderIndustryDashboard();
      break;
    case 'industry-post-opp':
      container.innerHTML = renderPostOpportunityForm();
      initPostOppFormEvents();
      break;
    case 'industry-my-opps':
      container.innerHTML = renderMyOpportunities();
      break;
    case 'industry-candidates':
      container.innerHTML = renderCandidateMatches();
      break;
    case 'institution-dashboard':
    case 'institution-gaps':
    case 'institution-roster':
      container.innerHTML = renderInstitutionDashboard();
      renderInstitutionCharts();
      break;
    default:
      container.innerHTML = renderLandingView();
  }
}

// ==========================================================================
// VIEW 1: LANDING & ROLE SELECTION SCREEN
// ==========================================================================
function renderLandingView() {
  return `
    <div class="landing-hero">
      <div class="landing-pill">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
        <span>Live Hackathon Interactive Demo</span>
      </div>
      <h1 class="landing-title">
        Skill Nexus – <span>Industry SkillBridge</span>
      </h1>
      <p class="landing-tagline">"Know what to learn. Know where to apply. Know what industry needs."</p>
      <p class="landing-desc">
        A skill-intelligence and opportunity matching platform connecting Students, Industries, and Institutions with precision formula-driven gap analysis, live matching, and closed-loop skills feedback.
      </p>
      
      <div style="display:flex; justify-content:center; gap:1rem; margin-top:1.75rem;">
        <button class="btn btn-primary btn-lg" onclick="startDemoAsArun()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Launch Student Flow (Arun Kumar)
        </button>
        <button class="btn btn-secondary btn-lg" onclick="openDemoGuideModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          View End-to-End Walkthrough Guide
        </button>
      </div>
    </div>

    <!-- Role Selection Cards -->
    <div class="role-cards-grid">
      <!-- Student Role Card -->
      <div class="role-card">
        <span class="role-card-badge">Learn & Apply</span>
        <div class="role-card-icon role-student-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <h3>Student Portal</h3>
        <p>Assess your 8 core technical and soft skills, identify your industry readiness gaps, enroll in targeted learning, and get matched to high-fit internships.</p>
        <ul class="role-card-features">
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            8-Skill Interactive Adaptive Assessment
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Exact Mathematical Match % vs Industry Roles
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Real-time Application Tracker & Skill Boost Loop
          </li>
        </ul>
        <button class="btn btn-primary" onclick="setRole('student')">Enter as Student &rarr;</button>
      </div>

      <!-- Industry Role Card -->
      <div class="role-card">
        <span class="role-card-badge">Hire & Upskill</span>
        <div class="role-card-icon role-industry-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
        </div>
        <h3>Industry Portal</h3>
        <p>Define precise skill profiles with granular thresholds, publish internships or live projects, and instantly rank applicant talent with automated match scores.</p>
        <ul class="role-card-features">
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Post Opportunities with Custom Skill Sliders
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Automated Candidate Ranking Engine (≥60% filter)
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            1-Click Shortlist, Interview & Selection Pipeline
          </li>
        </ul>
        <button class="btn btn-outline-primary" onclick="setRole('industry')">Enter as Industry &rarr;</button>
      </div>

      <!-- Institution Role Card -->
      <div class="role-card">
        <span class="role-card-badge">Skill Analytics</span>
        <div class="role-card-icon role-institution-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4"/>
          </svg>
        </div>
        <h3>Institution Portal</h3>
        <p>Aggregated skill analytics across student batches. Detect curriculum gaps vs actual industry demand and initiate corporate training interventions.</p>
        <ul class="role-card-features">
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Macro Skill Gap Analytics Across Cohorts
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Average Student Level vs Industry Market Demand
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Curriculum Intervention & Workshop Organizer
          </li>
        </ul>
        <button class="btn btn-secondary" onclick="setRole('institution')">Enter as Institution &rarr;</button>
      </div>
    </div>
  `;
}

// ==========================================================================
// VIEW 2: STUDENT DASHBOARD
// ==========================================================================
function renderStudentDashboard() {
  const student = state.getCurrentStudent();
  const readiness = getStudentCareerReadiness(student);

  // Compute count of opportunities with match >= 60%
  let matchingOpportunitiesCount = 0;
  state.opportunities.forEach(opp => {
    const m = calculateMatch(student.skills, opp.requiredSkills);
    if (m.matchPercentage >= 60) {
      matchingOpportunitiesCount++;
    }
  });

  // Count assessed skills (skills > 0)
  const assessedSkillsCount = Object.values(student.skills).filter(v => v > 0).length;
  const myApps = state.applications.filter(a => a.studentId === student.id);

  // Top gaps text for computed message
  let gapsText = '';
  if (readiness.topGaps.length >= 2) {
    gapsText = `Improve <strong>${readiness.topGaps[0].skill}</strong> and <strong>${readiness.topGaps[1].skill}</strong> to increase your readiness.`;
  } else if (readiness.topGaps.length === 1) {
    gapsText = `Improve <strong>${readiness.topGaps[0].skill}</strong> to reach full industry readiness.`;
  } else {
    gapsText = `You meet all skill requirements for your target role!`;
  }

  const computedMessage = student.assessed
    ? `Your current industry readiness is <strong>${readiness.matchPercentage}%</strong>. ${gapsText} You have <strong>${matchingOpportunitiesCount}</strong> opportunities matching your current skills.`
    : `You have not yet completed your 8-skill assessment. Take the assessment now to compute your exact readiness score and unlock matched opportunities!`;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Welcome back, ${student.name} 👋</h1>
        <p class="page-subtitle">Target Career Role: <strong>${student.targetRole}</strong> • ${student.department}</p>
      </div>
      <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="openSkillTranscriptModal()" title="View and print verified skill transcript">
          📜 Verified Transcript
        </button>
        <button class="btn btn-secondary" onclick="openTargetRoleSwitcherModal()">
          Change Target Role
        </button>
        ${!student.assessed ? `
          <button class="btn btn-accent" onclick="navigateTo('student-assessment')">
            Take Assessment Now &rarr;
          </button>
        ` : `
          <button class="btn btn-primary" onclick="navigateTo('student-opportunities')">
            Browse Matched Jobs &rarr;
          </button>
        `}
      </div>
    </div>

    <!-- Computed Insight Banner -->
    <div class="insight-banner">
      <div class="insight-banner-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </div>
      <div class="insight-banner-content">
        <h4>Skill Intelligence Insight</h4>
        <p>${computedMessage}</p>
      </div>
    </div>

    <!-- KPI Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <span class="kpi-label">Career Readiness</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${student.assessed ? readiness.matchPercentage + '%' : 'N/A'}</span>
          <span class="kpi-badge ${readiness.labelClass}">${readiness.label}</span>
        </div>
        <span class="kpi-subtext">vs. Target ${student.targetRole} profile</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Skills Assessed</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${assessedSkillsCount} / 8</span>
          <span class="kpi-badge ${student.assessed ? 'badge-strong' : 'badge-stretch'}">
            ${student.assessed ? 'Complete' : 'Pending'}
          </span>
        </div>
        <span class="kpi-subtext">Verified through skill assessment</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Matching Opportunities</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${matchingOpportunitiesCount}</span>
          <span class="kpi-badge badge-good">≥ 60% Match</span>
        </div>
        <span class="kpi-subtext">Active industry roles available</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Active Applications</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${myApps.length}</span>
          <span class="kpi-badge badge-strong">Tracked</span>
        </div>
        <span class="kpi-subtext">Submitted to industry partners</span>
      </div>
    </div>

    <!-- Two Column Section: Quick Actions & Top Gaps -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:1.5rem; margin-bottom:2rem;">
      <!-- Top Gaps Card -->
      <div class="profile-overview-card" style="margin-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--slate-900);">Top Skill Gaps vs Industry</h3>
          <button class="btn btn-sm btn-secondary" onclick="navigateTo('student-profile-gaps')">View Full Roadmap</button>
        </div>

        ${readiness.topGaps.length === 0 ? `
          <div style="padding:1.5rem; text-align:center; color:var(--slate-500);">
            ${student.assessed ? '🎉 No skill gaps detected! You exceed requirements.' : 'Complete assessment to view identified skill gaps.'}
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; gap:0.85rem;">
            ${readiness.topGaps.map(g => `
              <div style="background:var(--slate-50); border:1px solid var(--slate-200); border-radius:var(--radius-md); padding:0.85rem 1rem; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:700; font-size:0.9rem; color:var(--slate-900);">${g.skill}</div>
                  <div style="font-size:0.75rem; color:var(--slate-500);">Current: ${g.current}% • Target: ${g.required}%</div>
                </div>
                <div style="text-align:right;">
                  <span class="chip-gap">⚠ Gap: ${g.gapSize}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Quick Actions / Next Steps -->
      <div class="profile-overview-card" style="margin-bottom:0;">
        <h3 style="font-size:1.1rem; font-weight:800; color:var(--slate-900); margin-bottom:1.25rem;">Recommended Next Steps</h3>
        <div style="display:flex; flex-direction:column; gap:0.85rem;">
          ${!student.assessed ? `
            <div style="padding:1rem; border-radius:var(--radius-md); background:var(--primary-50); border:1px solid var(--primary-100); display:flex; align-items:center; justify-content:space-between;">
              <div>
                <strong style="color:var(--primary-900); font-size:0.9rem;">1. Take 8-Question Assessment</strong>
                <p style="font-size:0.78rem; color:var(--slate-600);">Takes ~2 minutes. Evaluates 8 core competencies.</p>
              </div>
              <button class="btn btn-sm btn-primary" onclick="navigateTo('student-assessment')">Start</button>
            </div>
          ` : `
            <div style="padding:1rem; border-radius:var(--radius-md); background:var(--primary-50); border:1px solid var(--primary-100); display:flex; align-items:center; justify-content:space-between;">
              <div>
                <strong style="color:var(--primary-900); font-size:0.9rem;">1. Upskill to Close Identified Gaps</strong>
                <p style="font-size:0.78rem; color:var(--slate-600);">Enroll in modular micro-courses to boost scores.</p>
              </div>
              <button class="btn btn-sm btn-primary" onclick="navigateTo('student-profile-gaps')">Upskill</button>
            </div>
          `}

          <div style="padding:1rem; border-radius:var(--radius-md); background:var(--blue-50); border:1px solid var(--blue-100); display:flex; align-items:center; justify-content:space-between;">
            <div>
              <strong style="color:var(--blue-900); font-size:0.9rem;">2. Apply to Matched Opportunities</strong>
              <p style="font-size:0.78rem; color:var(--slate-600);">${matchingOpportunitiesCount} roles aligned with your skill profile.</p>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="navigateTo('student-opportunities')">Browse</button>
          </div>

          <div style="padding:1rem; border-radius:var(--radius-md); background:var(--slate-50); border:1px solid var(--slate-200); display:flex; align-items:center; justify-content:space-between;">
            <div>
              <strong style="color:var(--slate-900); font-size:0.9rem;">3. Track Application Pipeline</strong>
              <p style="font-size:0.78rem; color:var(--slate-600);">${myApps.length} active submissions with real-time status.</p>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="navigateTo('student-applications')">Status</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// VIEW 3: STUDENT SKILL ASSESSMENT (ONE QUESTION AT A TIME + PROGRESS BAR)
// ==========================================================================

let assessmentCurrentStep = 0; // 0 to 7 (8 questions)
let assessmentScores = {};
let assessmentTargetRole = 'Data Analyst';

function renderAssessmentView() {
  const student = state.getCurrentStudent();
  if (Object.keys(assessmentScores).length === 0) {
    assessmentScores = { ...student.skills };
    assessmentTargetRole = student.targetRole || 'Data Analyst';
  }

  const currentQ = ASSESSMENT_QUESTIONS[assessmentCurrentStep];
  const questionNumber = assessmentCurrentStep + 1;
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progressPercent = Math.round((questionNumber / totalQuestions) * 100);

  const selectedScore = assessmentScores[currentQ.skill] || null;

  return `
    <div class="assessment-container">
      <div class="page-header" style="text-align:center; justify-content:center;">
        <div>
          <h1 class="page-title">Skill Assessment & Intelligence Quiz</h1>
          <p class="page-subtitle">Answer 8 practical proficiency questions to benchmark your industry readiness.</p>
        </div>
      </div>

      <!-- Target Career Goal Selector -->
      <div class="target-role-select-box">
        <div>
          <label for="assessmentRoleSelect">Select Target Career Goal:</label>
          <div style="font-size:0.78rem; color:var(--slate-500);">Your readiness will be benchmarked against this role's industry standards.</div>
        </div>
        <select id="assessmentRoleSelect" class="custom-select" onchange="assessmentTargetRole = this.value">
          ${Object.keys(TARGET_ROLES).map(role => `
            <option value="${role}" ${assessmentTargetRole === role ? 'selected' : ''}>${role}</option>
          `).join('')}
        </select>
      </div>

      <!-- Progress Bar -->
      <div class="assessment-progress-bar-wrap">
        <div class="assessment-progress-fill" style="width: ${progressPercent}%;"></div>
      </div>
      <div class="assessment-meta-row">
        <span>Question ${questionNumber} of ${totalQuestions}</span>
        <span>${progressPercent}% Completed</span>
      </div>

      <!-- Question Card -->
      <div class="assessment-card">
        <div class="skill-tag-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          Skill: ${currentQ.skill}
        </div>
        <h2 class="assessment-question-text">${currentQ.question}</h2>

        <div class="options-list">
          ${currentQ.options.map(opt => `
            <div class="option-item ${selectedScore === opt.score ? 'selected' : ''}" onclick="selectAssessmentOption('${currentQ.skill}', ${opt.score})">
              <div class="option-radio"></div>
              <div class="option-content">
                <div class="option-level-row">
                  <span class="option-level-name">${opt.level}</span>
                  <span class="option-score-badge">${opt.score} pts</span>
                </div>
                <div class="option-desc">${opt.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Navigation Row -->
      <div class="assessment-nav-row">
        <button class="btn btn-secondary" onclick="prevAssessmentStep()" ${assessmentCurrentStep === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
          &larr; Previous Question
        </button>

        ${assessmentCurrentStep < totalQuestions - 1 ? `
          <button class="btn btn-primary" onclick="nextAssessmentStep()">
            Next Question &rarr;
          </button>
        ` : `
          <button class="btn btn-accent btn-lg" onclick="finishAssessment()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Complete Assessment & View Gaps
          </button>
        `}
      </div>
    </div>
  `;
}

function initAssessmentStepEvents() {
  // Can be used for keyboard listeners if needed
}

function updateAssessmentView() {
  const container = document.getElementById('mainViewport');
  if (container) {
    container.innerHTML = renderAssessmentView();
  }
}

function selectAssessmentOption(skill, score) {
  assessmentScores[skill] = score;
  updateAssessmentView();
}

function nextAssessmentStep() {
  const currentSkill = ASSESSMENT_QUESTIONS[assessmentCurrentStep].skill;
  if (!assessmentScores[currentSkill]) {
    showToast('Please select your proficiency level before proceeding.', 'info');
    return;
  }
  if (assessmentCurrentStep < ASSESSMENT_QUESTIONS.length - 1) {
    assessmentCurrentStep++;
    updateAssessmentView();
  }
}

function prevAssessmentStep() {
  if (assessmentCurrentStep > 0) {
    assessmentCurrentStep--;
    updateAssessmentView();
  }
}

function finishAssessment() {
  const currentSkill = ASSESSMENT_QUESTIONS[assessmentCurrentStep].skill;
  if (!assessmentScores[currentSkill]) {
    showToast('Please select your proficiency level for the final skill.', 'info');
    return;
  }

  const student = state.getCurrentStudent();
  state.updateStudentSkills(student.id, assessmentScores, assessmentTargetRole);

  showToast(`Skill Assessment completed! Your profile and gap intelligence have been generated.`, 'success');
  assessmentCurrentStep = 0;
  assessmentScores = {};
  navigateTo('student-profile-gaps');
}

// ==========================================================================
// VIEW 4: SKILL PROFILE & GAPS
// ==========================================================================
function renderStudentProfileGaps() {
  const student = state.getCurrentStudent();
  const readiness = getStudentCareerReadiness(student);
  const targetRoleDef = TARGET_ROLES[student.targetRole] || TARGET_ROLES['Data Analyst'];

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Skill Profile & Gap Analysis</h1>
        <p class="page-subtitle">Benchmark of your capabilities vs. <strong>${student.targetRole}</strong> industry expectations.</p>
      </div>
      <div style="display:flex; gap:0.75rem;">
        <button class="btn btn-secondary" onclick="navigateTo('student-assessment')">
          Retake Assessment
        </button>
        <button class="btn btn-primary" onclick="navigateTo('student-opportunities')">
          Explore Matched Opportunities &rarr;
        </button>
      </div>
    </div>

    <!-- Readiness Overview Card -->
    <div class="profile-overview-card">
      <div class="readiness-score-header">
        <div class="readiness-metric">
          <div class="readiness-circle" style="--score-pct: ${readiness.matchPercentage};">
            <span class="readiness-circle-val">${readiness.matchPercentage}%</span>
          </div>
          <div class="readiness-text">
            <h3>Overall Industry Readiness</h3>
            <p>Calculated across ${readiness.totalRequired} core required competencies for <strong>${student.targetRole}</strong></p>
          </div>
        </div>
        <div>
          <span class="kpi-badge ${readiness.labelClass}" style="font-size:0.95rem; padding:0.4rem 1rem;">
            ${readiness.label}
          </span>
        </div>
      </div>

      <!-- Horizontal Progress Bars Grid (Green = Met, Amber = Gap) -->
      <h3 style="font-size:1.05rem; font-weight:800; color:var(--slate-900); margin-bottom:1rem;">Competency Breakdown vs Target Requirements</h3>
      <div class="skills-progress-grid">
        ${readiness.breakdown.map(item => `
          <div class="skill-bar-card">
            <div class="skill-bar-header">
              <span class="skill-bar-title">
                ${item.skill}
                ${item.status === 'met' 
                  ? '<span class="chip-met" style="font-size:0.68rem; padding:0.1rem 0.4rem;">✓ Met</span>' 
                  : `<span class="chip-gap" style="font-size:0.68rem; padding:0.1rem 0.4rem;">⚠ Gap -${item.gapSize}%</span>`}
              </span>
              <span class="skill-bar-scores">${item.current} / ${item.required}%</span>
            </div>
            <div class="bar-track">
              <div class="${item.status === 'met' ? 'bar-fill-met' : 'bar-fill-gap'}" style="width: ${Math.min(100, item.current)}%;"></div>
            </div>
            <div class="skill-bar-footer">
              <span>Required: ${item.required}%</span>
              <span>Match contribution: ${Math.round(item.ratio * 100)}%</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Gap Table (Current vs Required) -->
    <div class="data-table-card">
      <div class="table-header-box">
        <h3>Detailed Gap Table</h3>
        <span style="font-size:0.8rem; color:var(--slate-500);">${readiness.topGaps.length} areas requiring development</span>
      </div>
      <table class="nexus-table">
        <thead>
          <tr>
            <th>Skill Name</th>
            <th>Your Current Level</th>
            <th>Required Level</th>
            <th>Gap Size</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${readiness.breakdown.map(item => `
            <tr>
              <td><strong>${item.skill}</strong></td>
              <td>${item.current}%</td>
              <td>${item.required}%</td>
              <td>
                ${item.gapSize > 0 
                  ? `<span style="color:var(--rose-800); font-weight:700;">-${item.gapSize}%</span>` 
                  : `<span style="color:var(--accent-green-dark); font-weight:700;">None (+${item.current - item.required}%)</span>`}
              </td>
              <td>
                ${item.status === 'met' 
                  ? '<span class="chip-met">✓ Met</span>' 
                  : '<span class="chip-gap">⚠ Gap</span>'}
              </td>
              <td>
                ${item.gapSize > 0 ? `
                  <button class="btn btn-sm btn-outline-primary" onclick="scrollOrBoostSkill('${item.skill}')">
                    Upskill +20%
                  </button>
                ` : `
                  <span style="font-size:0.78rem; color:var(--slate-400);">Target Reached</span>
                `}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Seeded Learning Programs (5 Seeded Programs with "Improve My Skills" Loop) -->
    <div style="margin-top:2.5rem;">
      <div class="page-header" style="margin-bottom:1.25rem;">
        <div>
          <h2 class="page-title" style="font-size:1.4rem;">Targeted Learning Programs to Close Gaps</h2>
          <p class="page-subtitle">Completing these programs feeds directly back into your Skill Match and automatically updates your Skill Gap.</p>
        </div>
      </div>

      <div class="learning-programs-grid">
        ${state.learningPrograms.map(prog => {
          const currentSkillScore = student.skills[prog.targetSkill] || 0;
          return `
            <div class="program-card">
              <div class="program-badge-row">
                <span class="program-skill-tag">${prog.targetSkill}</span>
                <span class="program-boost-tag">+${prog.scoreBoost}% Score Boost</span>
              </div>
              <h4 class="program-title">${prog.title}</h4>
              <p class="program-provider">By ${prog.provider} • ${prog.duration} • ${prog.modules} Modules</p>
              <p class="program-desc">${prog.description}</p>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; pt-2;">
                <span style="font-size:0.78rem; color:var(--slate-500);">Current: ${currentSkillScore}%</span>
                <button class="btn btn-accent btn-sm" onclick="triggerSkillBoost('${student.id}', '${prog.targetSkill}', ${prog.scoreBoost}, '${prog.title}')">
                  ⚡ Improve My Skills (+${prog.scoreBoost}%)
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function triggerSkillBoost(studentId, skillName, boostAmount, programTitle) {
  state.boostSkill(studentId, skillName, boostAmount);
  showToast(`Congratulations! Completed "${programTitle}". ${skillName} increased by +${boostAmount}%. Gap analysis and readiness updated!`, 'success');
  renderApp();
}

function scrollOrBoostSkill(skillName) {
  const student = state.getCurrentStudent();
  state.boostSkill(student.id, skillName, 20);
  showToast(`Fast-track practice completed! ${skillName} boosted by +20%.`, 'success');
  renderApp();
}

// ==========================================================================
// VIEW 5: RECOMMENDED OPPORTUNITIES (MATCH PERCENTAGE & DETAILS)
// ==========================================================================
let oppSearchQuery = '';
let oppTypeFilter = 'All';
let oppMatchFilter = 'All';

function setOppFilter(type, val) {
  if (type === 'search') oppSearchQuery = val;
  if (type === 'type') oppTypeFilter = val;
  if (type === 'match') oppMatchFilter = val;
  const container = document.getElementById('mainViewport');
  if (container) container.innerHTML = renderRecommendedOpportunities();
}

function renderRecommendedOpportunities() {
  const student = state.getCurrentStudent();

  // Compute match for each opportunity and sort descending
  const opportunitiesWithMatch = state.opportunities.map(opp => {
    const match = calculateMatch(student.skills, opp.requiredSkills, opp.skillWeights || {});
    const existingApp = state.applications.find(a => a.studentId === student.id && a.opportunityId === opp.id);
    return {
      ...opp,
      match,
      application: existingApp
    };
  });

  // Filter based on user query and dropdowns
  let filteredOpps = opportunitiesWithMatch.filter(opp => {
    if (oppTypeFilter !== 'All' && opp.type !== oppTypeFilter) return false;
    if (oppMatchFilter === 'Strong' && opp.match.matchPercentage < 80) return false;
    if (oppMatchFilter === 'Good' && (opp.match.matchPercentage < 60 || opp.match.matchPercentage >= 80)) return false;
    if (oppMatchFilter === 'Stretch' && opp.match.matchPercentage >= 60) return false;
    if (oppSearchQuery) {
      const q = oppSearchQuery.toLowerCase();
      const matchText = (opp.roleTitle + ' ' + opp.companyName + ' ' + opp.location + ' ' + Object.keys(opp.requiredSkills).join(' ')).toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  filteredOpps.sort((a, b) => b.match.matchPercentage - a.match.matchPercentage);

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Recommended Industry Opportunities</h1>
        <p class="page-subtitle">Ranked by exact mathematical skill match against your verified profile.</p>
      </div>
      <div>
        <span class="kpi-badge badge-good" style="padding:0.4rem 0.85rem; font-size:0.85rem;">
          Showing ${filteredOpps.length} of ${opportunitiesWithMatch.length} Postings
        </span>
      </div>
    </div>

    <!-- Filter and Search Toolbar -->
    <div style="background:var(--white); border:1px solid var(--slate-200); border-radius:var(--radius-lg); padding:1rem 1.25rem; margin-bottom:1.5rem; display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between;">
      <div style="display:flex; align-items:center; gap:0.5rem; flex:1; min-width:240px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--slate-400)" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" class="form-input" style="padding:0.45rem 0.75rem; width:100%;" placeholder="Search by role, company, or required skill..." value="${oppSearchQuery}" oninput="setOppFilter('search', this.value)"/>
      </div>

      <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:0.4rem;">
          <span style="font-size:0.8rem; font-weight:700; color:var(--slate-500);">Type:</span>
          <select class="custom-select" style="padding:0.4rem 0.6rem; font-size:0.82rem;" onchange="setOppFilter('type', this.value)">
            <option value="All" ${oppTypeFilter === 'All' ? 'selected' : ''}>All Types</option>
            <option value="Internship" ${oppTypeFilter === 'Internship' ? 'selected' : ''}>Internship</option>
            <option value="Full-time Job" ${oppTypeFilter === 'Full-time Job' ? 'selected' : ''}>Full-time Job</option>
            <option value="Apprenticeship" ${oppTypeFilter === 'Apprenticeship' ? 'selected' : ''}>Apprenticeship</option>
            <option value="Live Project" ${oppTypeFilter === 'Live Project' ? 'selected' : ''}>Live Project</option>
          </select>
        </div>

        <div style="display:flex; align-items:center; gap:0.4rem;">
          <span style="font-size:0.8rem; font-weight:700; color:var(--slate-500);">Match Tier:</span>
          <select class="custom-select" style="padding:0.4rem 0.6rem; font-size:0.82rem;" onchange="setOppFilter('match', this.value)">
            <option value="All" ${oppMatchFilter === 'All' ? 'selected' : ''}>All Tiers</option>
            <option value="Strong" ${oppMatchFilter === 'Strong' ? 'selected' : ''}>Strong (≥80%)</option>
            <option value="Good" ${oppMatchFilter === 'Good' ? 'selected' : ''}>Good (60–79%)</option>
            <option value="Stretch" ${oppMatchFilter === 'Stretch' ? 'selected' : ''}>Stretch (&lt;60%)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Opportunities Grid -->
    <div class="opportunities-grid">
      ${filteredOpps.map(opp => `
        <div class="opportunity-card">
          <div class="opp-card-top">
            <div class="opp-company-badge">
              <div class="company-logo-avatar">${opp.companyName.substring(0, 2).toUpperCase()}</div>
              <div>
                <div class="opp-meta-company">${opp.companyName}</div>
                <div class="opp-meta-type">${opp.type} • ${opp.location}</div>
              </div>
            </div>
            <div class="opp-match-pill">
              <span class="opp-match-percentage" style="color:${opp.match.matchPercentage >= 80 ? 'var(--accent-green-dark)' : opp.match.matchPercentage >= 60 ? 'var(--blue-600)' : 'var(--amber-800)'}">
                ${opp.match.matchPercentage}%
              </span>
              <span class="kpi-badge ${opp.match.labelClass} opp-match-label">${opp.match.label}</span>
            </div>
          </div>

          <h3 class="opp-title">${opp.roleTitle}</h3>
          
          <div class="opp-details-row">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              ${opp.duration}
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              ${opp.stipend}
            </span>
          </div>

          <p class="opp-desc">${opp.description}</p>

          <div class="opp-skills-label">Skill Requirements vs Your Scores</div>
          <div class="opp-skills-chips-wrap">
            ${opp.match.breakdown.map(b => `
              <span class="${b.status === 'met' ? 'chip-met' : 'chip-gap'}">
                ${b.status === 'met' ? '✓' : '⚠'} ${b.skill} (${b.current}/${b.required}%)
              </span>
            `).join('')}
          </div>

          <!-- Expandable "How is this calculated?" Accordion -->
          <div class="calc-accordion" id="calc_${opp.id}">
            <button class="calc-accordion-trigger" onclick="toggleCalcAccordion('calc_${opp.id}')">
              <span>📐 How is this calculated? (${opp.match.formulaString})</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="calc-accordion-body">
              <div class="calc-formula-box">
                Formula: Match % = round( Σ(w_i × min(score_i / req_i, 1)) / Σ w_i × 100 )
              </div>
              <p style="margin-bottom:0.5rem; font-size:0.75rem;">Breakdown for each required skill:</p>
              <ul style="list-style:none; display:flex; flex-direction:column; gap:0.25rem;">
                ${opp.match.breakdown.map(b => `
                  <li style="display:flex; justify-content:space-between; font-size:0.75rem; border-bottom:1px dashed #e2e8f0; padding-bottom:0.2rem;">
                    <span>• <strong>${b.skill}</strong> (Req: ${b.required}%, You: ${b.current}%):</span>
                    <span>min(${b.current}/${b.required}, 1) = <strong>${Number(b.ratio.toFixed(2))}</strong></span>
                  </li>
                `).join('')}
              </ul>
              <div style="margin-top:0.4rem; font-weight:700; color:var(--primary-800); text-align:right;">
                Result: ${opp.match.formulaString}
              </div>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="opp-card-actions">
            <button class="btn btn-secondary btn-sm" onclick="openOpportunityDetailsModal('${opp.id}')">
              View Details
            </button>
            ${opp.application ? `
              <button class="btn btn-sm btn-outline-primary" style="margin-left:auto; cursor:default;">
                Status: <strong>${opp.application.status}</strong>
              </button>
            ` : `
              <button class="btn btn-primary btn-sm" style="margin-left:auto;" onclick="applyForOpportunityDirect('${student.id}', '${opp.id}')">
                Apply Now &rarr;
              </button>
            `}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function toggleCalcAccordion(accordionId) {
  const el = document.getElementById(accordionId);
  if (el) {
    el.classList.toggle('open');
  }
}

function applyForOpportunityDirect(studentId, oppId) {
  const opp = state.opportunities.find(o => o.id === oppId);
  const app = state.applyForOpportunity(studentId, oppId);
  if (app) {
    showToast(`Application successfully submitted for ${opp.roleTitle} at ${opp.companyName}!`, 'success');
    renderApp();
  }
}

function openOpportunityDetailsModal(oppId) {
  const opp = state.opportunities.find(o => o.id === oppId);
  const student = state.getCurrentStudent();
  const match = calculateMatch(student.skills, opp.requiredSkills);
  const existingApp = state.applications.find(a => a.studentId === student.id && a.opportunityId === opp.id);

  const bodyHtml = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem;">
      <div>
        <h2 style="font-size:1.35rem; font-weight:800; color:var(--slate-900);">${opp.roleTitle}</h2>
        <div style="font-size:0.9rem; color:var(--slate-600); font-weight:600;">${opp.companyName} • ${opp.type}</div>
      </div>
      <span class="kpi-badge ${match.labelClass}" style="font-size:0.9rem; padding:0.35rem 0.75rem;">
        ${match.matchPercentage}% ${match.label}
      </span>
    </div>

    <div class="opp-details-row" style="margin-bottom:1.25rem;">
      <span><strong>Location:</strong> ${opp.location}</span>
      <span><strong>Duration:</strong> ${opp.duration}</span>
      <span><strong>Stipend / Comp:</strong> ${opp.stipend}</span>
      <span><strong>Posted:</strong> ${opp.postedDate}</span>
    </div>

    <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:0.4rem; color:var(--slate-900);">Role Overview & Scope</h4>
    <p style="font-size:0.88rem; color:var(--slate-700); line-height:1.5; margin-bottom:1.25rem;">${opp.description}</p>

    <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:0.4rem; color:var(--slate-900);">Required Skill Thresholds</h4>
    <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.5rem;">
      ${Object.entries(opp.requiredSkills).map(([skill, req]) => {
        const studentScore = student.skills[skill] || 0;
        const isMet = studentScore >= req;
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--slate-50); padding:0.5rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--slate-200);">
            <span style="font-weight:700; font-size:0.85rem;">${skill}</span>
            <span style="font-size:0.8rem;">
              Required: ${req}% | Your Score: ${studentScore}%
              ${isMet ? '<span class="chip-met" style="margin-left:0.5rem;">✓ Met</span>' : '<span class="chip-gap" style="margin-left:0.5rem;">⚠ Gap</span>'}
            </span>
          </div>
        `;
      }).join('')}
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    ${existingApp ? `
      <button class="btn btn-outline-primary" style="cursor:default;">
        Current Status: ${existingApp.status}
      </button>
    ` : `
      <button class="btn btn-primary" onclick="closeModal(); applyForOpportunityDirect('${student.id}', '${opp.id}')">
        Submit Application &rarr;
      </button>
    `}
  `;

  openModal(`Opportunity Overview: ${opp.roleTitle}`, bodyHtml, footerHtml);
}

// ==========================================================================
// VIEW 6: MY APPLICATIONS (REAL-TIME STATUS TRACKING)
// ==========================================================================
function renderStudentApplications() {
  const student = state.getCurrentStudent();
  const myApps = state.applications.filter(a => a.studentId === student.id);

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">My Application Pipeline</h1>
        <p class="page-subtitle">Track your submitted opportunities and real-time review stages from industry partners.</p>
      </div>
      <div>
        <button class="btn btn-primary" onclick="navigateTo('student-opportunities')">
          Browse More Roles &rarr;
        </button>
      </div>
    </div>

    ${myApps.length === 0 ? `
      <div class="data-table-card" style="padding:3rem 1.5rem; text-align:center;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--slate-400)" stroke-width="1.5" style="margin:0 auto 1rem auto;">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--slate-800); margin-bottom:0.5rem;">No Applications Submitted Yet</h3>
        <p style="font-size:0.9rem; color:var(--slate-500); max-width:440px; margin:0 auto 1.5rem auto;">
          Browse our recommended industry opportunities, review your match percentage, and apply with 1-click.
        </p>
        <button class="btn btn-primary" onclick="navigateTo('student-opportunities')">Explore Opportunities</button>
      </div>
    ` : `
      <div class="data-table-card">
        <div class="table-header-box">
          <h3>Submitted Applications (${myApps.length})</h3>
          <span style="font-size:0.8rem; color:var(--slate-500);">Live status updates from industry</span>
        </div>
        <table class="nexus-table">
          <thead>
            <tr>
              <th>Role & Company</th>
              <th>Applied Date</th>
              <th>Match % at Submission</th>
              <th>Status Pipeline</th>
              <th>Industry Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${myApps.map(app => {
              const opp = state.opportunities.find(o => o.id === app.opportunityId) || {
                roleTitle: 'Opportunity',
                companyName: 'Partner Company',
                type: 'Internship'
              };

              let statusBadgeClass = 'badge-good';
              if (app.status === 'Shortlisted' || app.status === 'Selected') statusBadgeClass = 'badge-strong';
              else if (app.status === 'Rejected') statusBadgeClass = 'badge-stretch';

              return `
                <tr>
                  <td>
                    <div style="font-weight:800; color:var(--slate-900);">${opp.roleTitle}</div>
                    <div style="font-size:0.75rem; color:var(--slate-500);">${opp.companyName} • ${opp.type}</div>
                  </td>
                  <td>${app.appliedDate}</td>
                  <td>
                    <span style="font-weight:700; color:var(--primary-700);">${app.matchPercentage}%</span>
                  </td>
                  <td>
                    <span class="kpi-badge ${statusBadgeClass}">${app.status}</span>
                  </td>
                  <td>
                    <span style="font-size:0.82rem; color:var(--slate-600);">${app.feedback || 'In active review queue'}</span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="openOpportunityDetailsModal('${app.opportunityId}')">
                      View Role
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;
}

// ==========================================================================
// VIEW 7: INDUSTRY DASHBOARD
// ==========================================================================
function renderIndustryDashboard() {
  const company = state.getCurrentCompany();
  const companyOpps = state.opportunities.filter(o => o.companyName === company.name);
  const companyOppIds = companyOpps.map(o => o.id);

  const applicationsReceived = state.applications.filter(a => companyOppIds.includes(a.opportunityId));
  const shortlistedCount = applicationsReceived.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length;

  // Compute count of students with >= 60% match on any of company's opportunities
  let matchedStudentsCount = 0;
  state.students.forEach(student => {
    let hasMatch = false;
    for (const opp of companyOpps) {
      const m = calculateMatch(student.skills, opp.requiredSkills);
      if (m.matchPercentage >= 60) {
        hasMatch = true;
        break;
      }
    }
    if (hasMatch) matchedStudentsCount++;
  });

  const computedIndustryMessage = `${matchedStudentsCount} students currently match your posted opportunities.`;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">${company.name} Talent & Hiring Portal</h1>
        <p class="page-subtitle">${company.industry} • ${company.location}</p>
      </div>
      <div style="display:flex; gap:0.75rem;">
        <button class="btn btn-secondary" onclick="openCompanySwitcherModal()">
          Switch Company
        </button>
        <button class="btn btn-primary" onclick="navigateTo('industry-post-opp')">
          + Post New Opportunity
        </button>
      </div>
    </div>

    <!-- Computed Message Banner -->
    <div class="insight-banner">
      <div class="insight-banner-icon" style="background:var(--blue-600);">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
      </div>
      <div class="insight-banner-content">
        <h4>Talent Pool Matching</h4>
        <p><strong>${computedIndustryMessage}</strong> Review candidate skill rankings below or publish a new targeted vacancy.</p>
      </div>
    </div>

    <!-- KPI Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <span class="kpi-label">Active Opportunities</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${companyOpps.length}</span>
          <span class="kpi-badge badge-good">Live</span>
        </div>
        <span class="kpi-subtext">Published positions</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Applications Received</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${applicationsReceived.length}</span>
          <span class="kpi-badge badge-good">Submissions</span>
        </div>
        <span class="kpi-subtext">Across all posted openings</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Matching Candidates (≥60%)</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${matchedStudentsCount}</span>
          <span class="kpi-badge badge-strong">Qualified</span>
        </div>
        <span class="kpi-subtext">Students in candidate pool</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Shortlisted / Selected</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${shortlistedCount}</span>
          <span class="kpi-badge badge-strong">Pipeline</span>
        </div>
        <span class="kpi-subtext">Advanced candidates</span>
      </div>
    </div>

    <!-- Active Openings Table / Cards -->
    <div class="data-table-card">
      <div class="table-header-box">
        <h3>Your Active Openings (${companyOpps.length})</h3>
        <button class="btn btn-sm btn-primary" onclick="navigateTo('industry-post-opp')">+ Add Opening</button>
      </div>
      <table class="nexus-table">
        <thead>
          <tr>
            <th>Role Title</th>
            <th>Type</th>
            <th>Duration</th>
            <th>Required Skills Count</th>
            <th>Applicant Submissions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${companyOpps.map(opp => {
            const oppApps = applicationsReceived.filter(a => a.opportunityId === opp.id);
            return `
              <tr>
                <td><strong>${opp.roleTitle}</strong></td>
                <td><span class="kpi-badge badge-good">${opp.type}</span></td>
                <td>${opp.duration}</td>
                <td>${Object.keys(opp.requiredSkills).length} Skills</td>
                <td><strong>${oppApps.length}</strong> applicants</td>
                <td>
                  <button class="btn btn-sm btn-primary" onclick="viewCandidatesForOpp('${opp.id}')">
                    Review Candidates &rarr;
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function viewCandidatesForOpp(oppId) {
  state.selectedOpportunityId = oppId;
  state.saveState();
  navigateTo('industry-candidates');
}

// ==========================================================================
// VIEW 8: POST OPPORTUNITY FORM
// ==========================================================================
function renderPostOpportunityForm() {
  const company = state.getCurrentCompany();

  return `
    <div class="page-header" style="max-width:820px; margin:0 auto 1.5rem auto;">
      <div>
        <h1 class="page-title">Post New Industry Opportunity</h1>
        <p class="page-subtitle">Define required skill benchmarks. Matching candidates are ranked automatically.</p>
      </div>
    </div>

    <div class="form-card">
      <form id="postOpportunityForm" onsubmit="handlePostOpportunity(event)">
        <div class="form-grid-2">
          <div class="form-group">
            <label for="oppCompany">Company Name</label>
            <input type="text" id="oppCompany" class="form-input" value="${company.name}" readonly style="background:var(--slate-100);"/>
          </div>

          <div class="form-group">
            <label for="oppTitle">Role Title *</label>
            <input type="text" id="oppTitle" class="form-input" placeholder="e.g. Data Analyst Intern" required/>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="oppType">Opportunity Type *</label>
            <select id="oppType" class="form-select" required>
              <option value="Internship">Internship</option>
              <option value="Full-time Job">Full-time Job</option>
              <option value="Apprenticeship">Apprenticeship</option>
              <option value="Live Project">Live Project</option>
            </select>
          </div>

          <div class="form-group">
            <label for="oppLocation">Location *</label>
            <input type="text" id="oppLocation" class="form-input" placeholder="e.g. Bangalore / Hybrid or Remote" required/>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="oppDuration">Duration</label>
            <input type="text" id="oppDuration" class="form-input" placeholder="e.g. 6 Months" value="6 Months"/>
          </div>

          <div class="form-group">
            <label for="oppStipend">Stipend / CTC</label>
            <input type="text" id="oppStipend" class="form-input" placeholder="e.g. ₹35,000 / month" value="₹35,000 / month"/>
          </div>
        </div>

        <div class="form-group">
          <label for="oppDesc">Job Description & Project Scope *</label>
          <textarea id="oppDesc" class="form-textarea" rows="3" placeholder="Describe the day-to-day responsibilities and learning opportunities..." required></textarea>
        </div>

        <div style="margin: 1.5rem 0 1rem 0;">
          <h4 style="font-size:1rem; font-weight:800; color:var(--slate-900); margin-bottom:0.25rem;">Define Required Skills & Minimum % Thresholds</h4>
          <p style="font-size:0.8rem; color:var(--slate-500);">Move sliders to set the threshold. Skills set to 0% will not be required.</p>
        </div>

        <!-- 8 Skill Sliders with Granular Weight Customization -->
        <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.5rem;">
          ${SKILLS_LIST.map(skill => `
            <div class="form-slider-row">
              <span class="slider-label">${skill}</span>
              <input type="range" class="slider-input" id="slider_${skill}" min="0" max="100" step="10" value="${getDefaultSliderValue(skill)}" oninput="updateSliderBadge('${skill}', this.value)"/>
              <span class="slider-val-badge" id="badge_${skill}">${getDefaultSliderValue(skill)}%</span>
              <select class="custom-select" id="weight_${skill}" style="padding:0.25rem 0.5rem; font-size:0.75rem; border-radius:var(--radius-sm); margin-left:0.5rem;" title="Skill Weight in Matching Formula">
                <option value="1.0">Weight: 1.0x (Standard)</option>
                <option value="1.5">Weight: 1.5x (High Priority)</option>
                <option value="2.0">Weight: 2.0x (Core Critical)</option>
              </select>
            </div>
          `).join('')}
        </div>

        <div style="display:flex; justify-content:flex-end; gap:1rem;">
          <button type="button" class="btn btn-secondary" onclick="navigateTo('industry-dashboard')">Cancel</button>
          <button type="submit" class="btn btn-primary btn-lg">Publish Opportunity &rarr;</button>
        </div>
      </form>
    </div>
  `;
}

function getDefaultSliderValue(skill) {
  if (skill === 'Python') return 70;
  if (skill === 'SQL') return 80;
  if (skill === 'Data Analysis') return 70;
  return 0;
}

function updateSliderBadge(skill, val) {
  const badge = document.getElementById(`badge_${skill}`);
  if (badge) badge.innerText = `${val}%`;
}

function initPostOppFormEvents() {}

function handlePostOpportunity(e) {
  e.preventDefault();
  const company = state.getCurrentCompany();
  const roleTitle = document.getElementById('oppTitle').value;
  const type = document.getElementById('oppType').value;
  const location = document.getElementById('oppLocation').value;
  const duration = document.getElementById('oppDuration').value;
  const stipend = document.getElementById('oppStipend').value;
  const description = document.getElementById('oppDesc').value;

  const requiredSkills = {};
  const skillWeights = {};
  SKILLS_LIST.forEach(skill => {
    const slider = document.getElementById(`slider_${skill}`);
    const val = parseInt(slider ? slider.value : '0', 10);
    if (val > 0) {
      requiredSkills[skill] = val;
      const weightSelect = document.getElementById(`weight_${skill}`);
      skillWeights[skill] = parseFloat(weightSelect ? weightSelect.value : '1.0');
    }
  });

  if (Object.keys(requiredSkills).length === 0) {
    showToast('Please set at least one required skill threshold > 0%', 'info');
    return;
  }

  const newOpp = {
    id: 'opp_' + Date.now(),
    companyId: company.id,
    companyName: company.name,
    roleTitle,
    type,
    location,
    duration,
    stipend,
    description,
    requiredSkills,
    skillWeights,
    postedDate: new Date().toISOString().split('T')[0]
  };

  state.addOpportunity(newOpp);
  state.selectedOpportunityId = newOpp.id;
  showToast(`Opportunity "${roleTitle}" successfully posted with custom skill weights!`, 'success');
  navigateTo('industry-candidates');
}

// ==========================================================================
// VIEW 9: MY OPPORTUNITIES (INDUSTRY)
// ==========================================================================
function renderMyOpportunities() {
  const company = state.getCurrentCompany();
  const companyOpps = state.opportunities.filter(o => o.companyName === company.name);

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">My Posted Opportunities</h1>
        <p class="page-subtitle">Manage postings and inspect candidate matches for ${company.name}.</p>
      </div>
      <div>
        <button class="btn btn-primary" onclick="navigateTo('industry-post-opp')">+ Post New Opportunity</button>
      </div>
    </div>

    <div class="opportunities-grid">
      ${companyOpps.map(opp => {
        const apps = state.applications.filter(a => a.opportunityId === opp.id);
        const shortlisted = apps.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length;

        return `
          <div class="opportunity-card">
            <div class="opp-card-top">
              <div>
                <span class="kpi-badge badge-good" style="margin-bottom:0.4rem; display:inline-block;">${opp.type}</span>
                <h3 class="opp-title" style="font-size:1.15rem;">${opp.roleTitle}</h3>
                <div style="font-size:0.8rem; color:var(--slate-500);">${opp.location} • ${opp.duration}</div>
              </div>
            </div>

            <p class="opp-desc">${opp.description}</p>

            <div class="opp-skills-label">Required Thresholds:</div>
            <div class="opp-skills-chips-wrap">
              ${Object.entries(opp.requiredSkills).map(([s, val]) => `
                <span class="chip-met">${s}: ${val}%</span>
              `).join('')}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--slate-50); padding:0.6rem 0.85rem; border-radius:var(--radius-md); margin-bottom:1rem; border:1px solid var(--slate-200);">
              <span style="font-size:0.82rem; font-weight:700;">Submissions: <strong>${apps.length}</strong></span>
              <span style="font-size:0.82rem; font-weight:700; color:var(--primary-700);">Shortlisted: <strong>${shortlisted}</strong></span>
            </div>

            <div class="opp-card-actions">
              <button class="btn btn-primary btn-sm" style="width:100%;" onclick="viewCandidatesForOpp('${opp.id}')">
                View & Rank Candidates &rarr;
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ==========================================================================
// VIEW 10: CANDIDATE MATCHES (INDUSTRY: RANKED BY MATCH %, SHORTLIST, REJECT)
// ==========================================================================
function renderCandidateMatches() {
  const company = state.getCurrentCompany();
  const companyOpps = state.opportunities.filter(o => o.companyName === company.name);

  if (companyOpps.length === 0) {
    return `
      <div class="data-table-card" style="padding:3rem; text-align:center;">
        <h3>No Opportunities Posted</h3>
        <p style="margin-bottom:1rem; color:var(--slate-500);">Post an opportunity to start matching with candidate profiles.</p>
        <button class="btn btn-primary" onclick="navigateTo('industry-post-opp')">+ Post Opportunity</button>
      </div>
    `;
  }

  // Active selected opportunity
  let selectedOpp = companyOpps.find(o => o.id === state.selectedOpportunityId) || companyOpps[0];

  // Rank all 10 students by Match % for selected opportunity using the exact matching formula
  const rankedCandidates = state.students.map(student => {
    const match = calculateMatch(student.skills, selectedOpp.requiredSkills, selectedOpp.skillWeights || {});
    const existingApp = state.applications.find(a => a.studentId === student.id && a.opportunityId === selectedOpp.id);
    return {
      student,
      match,
      application: existingApp
    };
  });

  rankedCandidates.sort((a, b) => b.match.matchPercentage - a.match.matchPercentage);

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Candidate Skill Matching Engine</h1>
        <p class="page-subtitle">Candidates ranked in real-time by formula match against required competencies.</p>
      </div>
      <div>
        <label style="font-size:0.8rem; font-weight:700; color:var(--slate-600); margin-right:0.5rem;">Select Role:</label>
        <select class="custom-select" onchange="switchCandidateOpportunity(this.value)">
          ${companyOpps.map(o => `
            <option value="${o.id}" ${o.id === selectedOpp.id ? 'selected' : ''}>${o.roleTitle} (${o.type})</option>
          `).join('')}
        </select>
      </div>
    </div>

    <!-- Active Opportunity Meta Bar -->
    <div style="background:var(--white); border:1px solid var(--slate-200); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
      <div>
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--slate-900);">${selectedOpp.roleTitle}</h3>
        <p style="font-size:0.82rem; color:var(--slate-500);">${selectedOpp.companyName} • ${selectedOpp.location} • ${selectedOpp.duration}</p>
      </div>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        ${Object.entries(selectedOpp.requiredSkills).map(([skill, req]) => {
          const w = (selectedOpp.skillWeights && selectedOpp.skillWeights[skill]) ? selectedOpp.skillWeights[skill] : 1.0;
          return `
            <span class="chip-met" style="font-size:0.75rem;">
              ${skill}: ${req}% ${w !== 1.0 ? `(${w}x weight)` : ''}
            </span>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Candidates Ranked List -->
    <div>
      ${rankedCandidates.map(({ student, match, application }, idx) => {
        const currentStatus = application ? application.status : 'Not Applied';
        let statusBadgeClass = 'badge-good';
        if (currentStatus === 'Shortlisted' || currentStatus === 'Selected') statusBadgeClass = 'badge-strong';
        else if (currentStatus === 'Rejected') statusBadgeClass = 'badge-stretch';

        return `
          <div class="candidate-rank-card">
            <div class="candidate-left-meta">
              <span style="font-weight:800; font-size:1.1rem; color:var(--slate-400); width:24px;">#${idx + 1}</span>
              <div class="candidate-avatar-large">${student.avatar}</div>
              <div class="candidate-info">
                <h4>${student.name}</h4>
                <p>${student.department} • Batch ${student.batch} • ${student.assessed ? 'Assessed' : 'Pending Quiz'}</p>
              </div>
            </div>

            <!-- Match Score Pill -->
            <div style="text-align:center;">
              <div style="font-size:1.5rem; font-weight:800; color:${match.matchPercentage >= 80 ? 'var(--accent-green-dark)' : match.matchPercentage >= 60 ? 'var(--blue-600)' : 'var(--amber-800)'};">
                ${match.matchPercentage}%
              </div>
              <span class="kpi-badge ${match.labelClass}">${match.label}</span>
            </div>

            <!-- Skills Comparison Chips -->
            <div class="candidate-skills-summary">
              ${match.breakdown.map(b => `
                <span class="${b.status === 'met' ? 'chip-met' : 'chip-gap'}" style="font-size:0.72rem; padding:0.15rem 0.45rem;">
                  ${b.skill}: ${b.current}%
                </span>
              `).join('')}
            </div>

            <!-- Status & Action Buttons -->
            <div class="candidate-actions">
              <span class="kpi-badge ${statusBadgeClass}" style="margin-right:0.5rem;">
                ${currentStatus}
              </span>

              <button class="btn btn-sm btn-secondary" onclick="openStudentProfileModal('${student.id}')">
                View Profile
              </button>

              <button class="btn btn-sm btn-primary" onclick="industrySetCandidateStatus('${student.id}', '${selectedOpp.id}', 'Shortlisted')">
                Shortlist
              </button>

              <button class="btn btn-sm btn-accent" onclick="openCandidateSelectModal('${student.id}', '${selectedOpp.id}')">
                Select
              </button>

              <button class="btn btn-sm btn-secondary" style="color:var(--rose-800);" onclick="industrySetCandidateStatus('${student.id}', '${selectedOpp.id}', 'Rejected')">
                Reject
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function switchCandidateOpportunity(oppId) {
  state.selectedOpportunityId = oppId;
  state.saveState();
  const container = document.getElementById('mainViewport');
  if (container) {
    container.innerHTML = renderCandidateMatches();
  }
}

function industrySetCandidateStatus(studentId, oppId, status, feedback = '') {
  const student = state.students.find(s => s.id === studentId);
  state.ensureApplicationForCandidate(studentId, oppId, status, feedback);
  showToast(`Candidate ${student.name} marked as ${status}! Updated in student pipeline.`, 'success');
  renderApp();
}

function openCandidateSelectModal(studentId, oppId) {
  const student = state.students.find(s => s.id === studentId);
  const opp = state.opportunities.find(o => o.id === oppId);

  const bodyHtml = `
    <p style="margin-bottom:1rem; font-size:0.9rem; color:var(--slate-700);">
      Confirm selection of <strong>${student.name}</strong> for the <strong>${opp.roleTitle}</strong> role. Please provide constructive feedback for the candidate:
    </p>
    <div class="form-group">
      <label for="selectFeedback">Industry Evaluation & Constructive Feedback:</label>
      <textarea id="selectFeedback" class="form-textarea" rows="3">Outstanding problem-solving and domain aptitude. Selected for onboarding.</textarea>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-accent" onclick="confirmCandidateSelection('${studentId}', '${oppId}')">Confirm Selection</button>
  `;

  openModal(`Select Candidate: ${student.name}`, bodyHtml, footerHtml);
}

function confirmCandidateSelection(studentId, oppId) {
  const feedback = document.getElementById('selectFeedback').value;
  industrySetCandidateStatus(studentId, oppId, 'Selected', feedback);
  closeModal();
}

function openStudentProfileModal(studentId) {
  const student = state.students.find(s => s.id === studentId);
  const readiness = getStudentCareerReadiness(student);

  const bodyHtml = `
    <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
      <div class="candidate-avatar-large" style="width:56px; height:56px; font-size:1.25rem;">${student.avatar}</div>
      <div>
        <h3 style="font-size:1.25rem; font-weight:800; color:var(--slate-900);">${student.name}</h3>
        <p style="font-size:0.85rem; color:var(--slate-500);">${student.department} • Batch ${student.batch}</p>
        <div style="margin-top:0.25rem;">
          <span class="kpi-badge badge-good">Target Role: ${student.targetRole}</span>
          <span class="kpi-badge ${readiness.labelClass}" style="margin-left:0.4rem;">${student.assessed ? readiness.matchPercentage + '% Ready' : 'Unassessed'}</span>
        </div>
      </div>
    </div>

    <h4 style="font-size:0.95rem; font-weight:800; margin-bottom:0.75rem; color:var(--slate-900);">Verified Competency Scores (0 - 100%)</h4>
    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:0.65rem;">
      ${SKILLS_LIST.map(skill => {
        const val = student.skills[skill] || 0;
        return `
          <div style="background:var(--slate-50); padding:0.6rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--slate-200); display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.85rem; font-weight:700;">${skill}</span>
            <span style="font-weight:800; font-size:0.9rem; color:var(--primary-700);">${val}%</span>
          </div>
        `;
      }).join('')}
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary" onclick="closeModal()">Close Profile</button>
  `;

  openModal(`Student Skill Profile: ${student.name}`, bodyHtml, footerHtml);
}

// ==========================================================================
// VIEW 11: INSTITUTION DASHBOARD (ACADEMICIAN SINGLE PAGE + ANALYTICS)
// ==========================================================================
function renderInstitutionDashboard() {
  const departments = ['All Departments', 'Computer Science & Engineering', 'Information Technology', 'Data Science & AI', 'Management & Tech', 'Business Systems', 'Information Systems'];
  const cohortStudents = (state.deptFilter === 'All' || state.deptFilter === 'All Departments')
    ? state.students
    : state.students.filter(s => s.department === state.deptFilter);

  const totalStudents = cohortStudents.length;
  const assessedStudents = cohortStudents.filter(s => s.assessed);
  const assessedCount = assessedStudents.length;
  const activeOppsCount = state.opportunities.length;
  const totalAppsCount = state.applications.length;
  const shortlistedCount = state.applications.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length;
  const uniqueCompanies = new Set(state.opportunities.map(o => o.companyName)).size;

  // Compute Skill Gap Analytics across assessed cohort students
  // 1. Top Skill Gaps: % of assessed students below industry requirement per skill
  // Compute average industry requirement per skill across all opportunities
  const skillReqSums = {};
  const skillReqCounts = {};
  SKILLS_LIST.forEach(s => {
    skillReqSums[s] = 0;
    skillReqCounts[s] = 0;
  });

  state.opportunities.forEach(opp => {
    Object.entries(opp.requiredSkills).forEach(([s, req]) => {
      skillReqSums[s] += req;
      skillReqCounts[s]++;
    });
  });

  const avgIndustryReq = {};
  SKILLS_LIST.forEach(s => {
    avgIndustryReq[s] = skillReqCounts[s] > 0 ? Math.round(skillReqSums[s] / skillReqCounts[s]) : 60;
  });

  // For each skill, compute % of assessed students below avgIndustryReq
  const skillGapMetrics = SKILLS_LIST.map(skill => {
    const targetReq = avgIndustryReq[skill];
    let studentsBelow = 0;
    if (assessedCount > 0) {
      assessedStudents.forEach(st => {
        const score = st.skills[skill] || 0;
        if (score < targetReq) {
          studentsBelow++;
        }
      });
    }
    const percentBelow = assessedCount > 0 ? Math.round((studentsBelow / assessedCount) * 100) : 0;
    return {
      skill,
      percentBelow,
      targetReq,
      studentsBelow
    };
  });

  // Sort by highest % gap
  skillGapMetrics.sort((a, b) => b.percentBelow - a.percentBelow);
  const topGapSkill = skillGapMetrics[0];

  // Computed actionable insight from prompt:
  // "X% of assessed students have [top gap skill] as a major skill gap. This indicates a potential need for an industry-led [skill] training program."
  const computedInstitutionInsight = `${topGapSkill.percentBelow}% of assessed students have ${topGapSkill.skill} as a major skill gap. This indicates a potential need for an industry-led ${topGapSkill.skill} training program.`;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Institution Academic & Skill Intelligence Dashboard</h1>
        <p class="page-subtitle">Real-time macro analytics connecting student learning outcomes with industry vacancy requirements.</p>
      </div>
      <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:0.4rem;">
          <span style="font-size:0.8rem; font-weight:700; color:var(--slate-500);">Cohort Scope:</span>
          <select class="custom-select" style="font-size:0.82rem; padding:0.4rem 0.65rem;" onchange="setInstitutionDeptFilter(this.value)">
            ${departments.map(d => `<option value="${d}" ${state.deptFilter === d ? 'selected' : ''}>${d}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-secondary" onclick="openCohortBriefModal()" title="Export executive report summary">
          📄 Export Brief
        </button>
        <button class="btn btn-primary" onclick="openOrganizeInterventionModal('${topGapSkill.skill}')">
          ⚡ Organise Industry Intervention
        </button>
      </div>
    </div>

    <!-- Computed Actionable Insight Banner -->
    <div class="insight-banner">
      <div class="insight-banner-icon" style="background:#7c3aed;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <div class="insight-banner-content">
        <h4>Curriculum Gap Recommendation</h4>
        <p><strong>${computedInstitutionInsight}</strong></p>
      </div>
    </div>

    <!-- KPI Cards (6 cards from prompt) -->
    <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
      <div class="kpi-card">
        <span class="kpi-label">Total Students</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${totalStudents}</span>
        </div>
        <span class="kpi-subtext">Registered cohort</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Students Assessed</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${assessedCount}</span>
          <span class="kpi-badge badge-good">${Math.round((assessedCount / totalStudents) * 100)}%</span>
        </div>
        <span class="kpi-subtext">Completed 8-skill test</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Active Opportunities</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${activeOppsCount}</span>
          <span class="kpi-badge badge-strong">Open</span>
        </div>
        <span class="kpi-subtext">From vetted partners</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Total Applications</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${totalAppsCount}</span>
        </div>
        <span class="kpi-subtext">Student submissions</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Shortlisted / Selected</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${shortlistedCount}</span>
          <span class="kpi-badge badge-strong">Hired</span>
        </div>
        <span class="kpi-subtext">Positive conversion</span>
      </div>

      <div class="kpi-card">
        <span class="kpi-label">Industry Partners</span>
        <div class="kpi-value-row">
          <span class="kpi-value">${uniqueCompanies}</span>
        </div>
        <span class="kpi-subtext">Active corporate firms</span>
      </div>
    </div>

    <!-- 3 Dynamic Analytics Charts (Rendered directly via responsive SVG) -->
    <div class="charts-grid-2">
      <!-- Chart 1: Top Skill Gaps (% of students below requirement per skill) -->
      <div class="chart-card">
        <div class="chart-card-header">
          <div>
            <h3>1. Top Skill Gaps Across Assessed Students</h3>
            <p>% of students below industry threshold per competency</p>
          </div>
          <span class="kpi-badge badge-stretch">Gap Metric</span>
        </div>
        <div id="topSkillGapsChart" class="svg-chart-container"></div>
      </div>

      <!-- Chart 2: Average Student Skill vs Industry Requirement (Grouped Bar) -->
      <div class="chart-card">
        <div class="chart-card-header">
          <div>
            <h3>2. Average Student Skill vs Industry Requirement</h3>
            <p>Cohort proficiency compared directly against average market requirement</p>
          </div>
          <span class="kpi-badge badge-good">Benchmark</span>
        </div>
        <div id="avgSkillVsReqChart" class="svg-chart-container"></div>
      </div>
    </div>

    <!-- Chart 3: Industry Demand Per Skill (Table + Visual demand bars) -->
    <div class="data-table-card">
      <div class="table-header-box">
        <div>
          <h3>3. Industry Demand Frequency Per Skill</h3>
          <p style="font-size:0.8rem; color:var(--slate-500);">Number of opportunities requiring each skill with demand velocity rating</p>
        </div>
      </div>
      <table class="nexus-table">
        <thead>
          <tr>
            <th>Skill Name</th>
            <th>Number of Opportunities Requiring Skill</th>
            <th>Market Demand Intensity</th>
            <th>Average Required Proficiency</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${SKILLS_LIST.map(skill => {
            const count = skillReqCounts[skill] || 0;
            const avgReq = avgIndustryReq[skill] || 0;
            const isVeryHigh = count >= 4;
            const isHigh = count >= 2;
            const badgeHtml = isVeryHigh
              ? '<span class="demand-badge-vhigh">Very High Demand</span>'
              : isHigh
              ? '<span class="demand-badge-high">High Demand</span>'
              : '<span class="kpi-badge badge-good">Moderate</span>';

            return `
              <tr>
                <td><strong>${skill}</strong></td>
                <td>
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <span style="font-weight:800; font-size:1rem;">${count}</span>
                    <div style="flex:1; max-width:120px; background:var(--slate-200); height:8px; border-radius:var(--radius-full); overflow:hidden;">
                      <div style="background:var(--primary-600); height:100%; width:${(count / activeOppsCount) * 100}%;"></div>
                    </div>
                  </div>
                </td>
                <td>${badgeHtml}</td>
                <td><strong>${avgReq}%</strong></td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" onclick="openOrganizeInterventionModal('${skill}')">
                    Organise Event
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Active & Upcoming Industry Interventions Section -->
    <div class="data-table-card" style="margin-top:2rem;">
      <div class="table-header-box">
        <div>
          <h3>Active & Upcoming Industry Interventions</h3>
          <p style="font-size:0.8rem; color:var(--slate-500);">Co-designed curriculum interventions with industry partners to close top skill gaps</p>
        </div>
        <button class="btn btn-sm btn-primary" onclick="openOrganizeInterventionModal('${topGapSkill.skill}')">+ Schedule Intervention</button>
      </div>
      <table class="nexus-table">
        <thead>
          <tr>
            <th>Format & Target Skill</th>
            <th>Industry Partner</th>
            <th>Scheduled Date</th>
            <th>Curriculum Objective & Scope</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${state.scheduledInterventions.map(item => `
            <tr>
              <td>
                <div style="font-weight:800; color:var(--slate-900);">${item.type}</div>
                <div style="font-size:0.75rem; color:var(--primary-700); font-weight:700;">Target: ${item.skill}</div>
              </td>
              <td><strong>${item.partner}</strong></td>
              <td>${item.date}</td>
              <td style="max-width:340px; font-size:0.85rem; color:var(--slate-600);">${item.scope}</td>
              <td><span class="chip-met">Confirmed & Active</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Student Cohort Roster Table -->
    <div class="data-table-card" style="margin-top:2rem;">
      <div class="table-header-box">
        <h3>Student Cohort Intelligence Roster (${cohortStudents.length} Students)</h3>
        <span style="font-size:0.8rem; color:var(--slate-500);">Filtered by ${state.deptFilter}</span>
      </div>
      <table class="nexus-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Department</th>
            <th>Target Career Role</th>
            <th>Assessment Status</th>
            <th>Career Readiness %</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${cohortStudents.map(st => {
            const r = getStudentCareerReadiness(st);
            return `
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:0.6rem;">
                    <div class="user-avatar-small">${st.avatar}</div>
                    <strong>${st.name}</strong>
                  </div>
                </td>
                <td>${st.department}</td>
                <td>${st.targetRole}</td>
                <td>
                  <span class="kpi-badge ${st.assessed ? 'badge-strong' : 'badge-stretch'}">
                    ${st.assessed ? 'Assessed' : 'Not Assessed'}
                  </span>
                </td>
                <td>
                  <strong style="color:var(--primary-700);">${st.assessed ? r.matchPercentage + '%' : 'N/A'}</strong>
                </td>
                <td>
                  <button class="btn btn-sm btn-secondary" onclick="openStudentProfileModal('${st.id}')">
                    Inspect Profile
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ==========================================================================
// INSTITUTION CHARTS GENERATOR (CLEAN SVG RENDERING)
// ==========================================================================
function renderInstitutionCharts() {
  const cohortStudents = (state.deptFilter === 'All' || state.deptFilter === 'All Departments')
    ? state.students
    : state.students.filter(s => s.department === state.deptFilter);
  const assessedStudents = cohortStudents.filter(s => s.assessed);
  const assessedCount = assessedStudents.length;

  // Compute average required per skill across opportunities
  const skillReqSums = {};
  const skillReqCounts = {};
  SKILLS_LIST.forEach(s => {
    skillReqSums[s] = 0;
    skillReqCounts[s] = 0;
  });

  state.opportunities.forEach(opp => {
    Object.entries(opp.requiredSkills).forEach(([s, req]) => {
      skillReqSums[s] += req;
      skillReqCounts[s]++;
    });
  });

  const avgIndustryReq = {};
  SKILLS_LIST.forEach(s => {
    avgIndustryReq[s] = skillReqCounts[s] > 0 ? Math.round(skillReqSums[s] / skillReqCounts[s]) : 60;
  });

  // Chart 1: Top Skill Gaps (% of students below target requirement)
  const gapContainer = document.getElementById('topSkillGapsChart');
  if (gapContainer) {
    const gapsData = SKILLS_LIST.map(skill => {
      const targetReq = avgIndustryReq[skill];
      let studentsBelow = 0;
      if (assessedCount > 0) {
        assessedStudents.forEach(st => {
          if ((st.skills[skill] || 0) < targetReq) studentsBelow++;
        });
      }
      const pct = assessedCount > 0 ? Math.round((studentsBelow / assessedCount) * 100) : 0;
      return { skill, pct };
    }).sort((a, b) => b.pct - a.pct);

    let barsSvg = '';
    const barHeight = 22;
    const gap = 8;
    gapsData.slice(0, 7).forEach((item, i) => {
      const y = i * (barHeight + gap) + 15;
      const barWidth = Math.max(10, Math.round((item.pct / 100) * 280));
      barsSvg += `
        <text x="5" y="${y + 15}" font-size="11" font-weight="700" fill="#334155">${item.skill}</text>
        <rect x="110" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="url(#gapGradient)"/>
        <text x="${120 + barWidth}" y="${y + 15}" font-size="11" font-weight="800" fill="#991b1b">${item.pct}%</text>
      `;
    });

    gapContainer.innerHTML = `
      <svg width="100%" height="240" viewBox="0 0 460 230" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gapGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#ef4444"/>
          </linearGradient>
        </defs>
        ${barsSvg}
      </svg>
    `;
  }

  // Chart 2: Average Student Skill Level vs Industry Requirement (Grouped Bar Chart)
  const groupedContainer = document.getElementById('avgSkillVsReqChart');
  if (groupedContainer) {
    const avgStudentScores = {};
    SKILLS_LIST.forEach(s => {
      let sum = 0;
      assessedStudents.forEach(st => sum += (st.skills[s] || 0));
      avgStudentScores[s] = assessedCount > 0 ? Math.round(sum / assessedCount) : 0;
    });

    const displaySkills = SKILLS_LIST.slice(0, 6);
    let chartSvg = '';
    const colWidth = 65;
    const chartHeight = 160;

    displaySkills.forEach((skill, i) => {
      const x = i * colWidth + 40;
      const studentH = Math.round((avgStudentScores[skill] / 100) * chartHeight);
      const reqH = Math.round((avgIndustryReq[skill] / 100) * chartHeight);

      const studentY = 180 - studentH;
      const reqY = 180 - reqH;

      chartSvg += `
        <!-- Student Bar (Teal) -->
        <rect x="${x}" y="${studentY}" width="18" height="${studentH}" rx="3" fill="#0d9488"/>
        <!-- Industry Req Bar (Blue) -->
        <rect x="${x + 22}" y="${reqY}" width="18" height="${reqH}" rx="3" fill="#3b82f6"/>
        <!-- Label -->
        <text x="${x + 20}" y="200" font-size="9.5" font-weight="700" fill="#475569" text-anchor="middle">${skill.substring(0, 6)}</text>
      `;
    });

    groupedContainer.innerHTML = `
      <svg width="100%" height="240" viewBox="0 0 460 220" xmlns="http://www.w3.org/2000/svg">
        <!-- Legend -->
        <rect x="250" y="10" width="12" height="12" rx="2" fill="#0d9488"/>
        <text x="268" y="20" font-size="10.5" font-weight="700" fill="#334155">Student Avg</text>
        <rect x="350" y="10" width="12" height="12" rx="2" fill="#3b82f6"/>
        <text x="368" y="20" font-size="10.5" font-weight="700" fill="#334155">Industry Req</text>

        <!-- Horizontal grid lines -->
        <line x1="30" y1="180" x2="430" y2="180" stroke="#e2e8f0" stroke-width="1.5"/>
        <line x1="30" y1="100" x2="430" y2="100" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="30" y1="20" x2="430" y2="20" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3,3"/>

        ${chartSvg}
      </svg>
    `;
  }
}

// ==========================================================================
// INSTITUTION ACTIONS (WORKSHOP / GUEST LECTURE / LIVE PROJECT ORGANIZER)
// ==========================================================================
function openOrganizeInterventionModal(preselectedSkill = 'Data Analysis') {
  const bodyHtml = `
    <p style="margin-bottom:1rem; font-size:0.9rem; color:var(--slate-700);">
      Launch an industry-partnered training intervention to close cohort skill gaps in <strong>${preselectedSkill}</strong>:
    </p>

    <div class="form-group">
      <label for="interventionType">Intervention Format *</label>
      <select id="interventionType" class="form-select">
        <option value="Workshop">Hands-on Industry Workshop (3 Days)</option>
        <option value="Guest Lecture">Executive Guest Lecture & Tech Talk</option>
        <option value="Live Project">Industry Live Capstone Project Sprint</option>
      </select>
    </div>

    <div class="form-group">
      <label for="interventionPartner">Partner Company *</label>
      <select id="interventionPartner" class="form-select">
        ${state.companies.map(c => `
          <option value="${c.name}">${c.name} (${c.industry})</option>
        `).join('')}
      </select>
    </div>

    <div class="form-group">
      <label for="interventionSkill">Target Competency</label>
      <input type="text" id="interventionSkill" class="form-input" value="${preselectedSkill}" readonly style="background:var(--slate-100);"/>
    </div>

    <div class="form-group">
      <label for="interventionScope">Scope & Objective</label>
      <textarea id="interventionScope" class="form-textarea" rows="2">Bridge student proficiency from basic to industry standard in ${preselectedSkill} via real-world enterprise dataset exercises.</textarea>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="confirmOrganizeIntervention()">Schedule & Notify Industry &rarr;</button>
  `;

  openModal('Organise Industry Collaboration', bodyHtml, footerHtml);
}

function confirmOrganizeIntervention() {
  const type = document.getElementById('interventionType').value;
  const partner = document.getElementById('interventionPartner').value;
  const skill = document.getElementById('interventionSkill').value;
  const scope = document.getElementById('interventionScope').value;

  const newIntervention = {
    id: 'int_' + Date.now(),
    type,
    partner,
    skill,
    date: '2026-11-05',
    scope
  };

  state.scheduledInterventions.unshift(newIntervention);
  state.saveState();
  closeModal();
  showToast(`Industry ${type} on "${skill}" scheduled in collaboration with ${partner}! Added to calendar.`, 'success');
  renderApp();
}

function setInstitutionDeptFilter(dept) {
  state.deptFilter = dept;
  state.saveState();
  const container = document.getElementById('mainViewport');
  if (container) {
    container.innerHTML = renderInstitutionDashboard();
    renderInstitutionCharts();
  }
}

function openCohortBriefModal() {
  const total = state.students.length;
  const assessed = state.students.filter(s => s.assessed).length;
  const opps = state.opportunities.length;
  const apps = state.applications.length;
  const shortlisted = state.applications.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length;

  const briefText = `
### Skill Nexus – Institution Cohort Briefing
**Generated:** ${new Date().toLocaleDateString()}
**Academic Cohort Scope:** ${state.deptFilter}

#### Executive Metrics:
• Total Students: ${total}
• Assessed Students: ${assessed} (${Math.round((assessed/total)*100)}%)
• Corporate Opportunities: ${opps}
• Student Applications: ${apps}
• Shortlisted / Placed: ${shortlisted}

#### Core Competency Benchmarks:
1. Data Analysis – High industry demand (80% threshold), top gap across 40%+ cohort.
2. SQL Relational Modeling – Critical cross-disciplinary requirement.
3. Problem Solving & Python – Strong baseline proficiency observed.

#### Strategic Interventions:
• Corporate hands-on micro-workshops scheduled with TechNova and DataForge.
• Academic syllabus alignment with current industry skill-weight requirements.
  `;

  const bodyHtml = `
    <div style="background:var(--slate-50); border:1px solid var(--slate-200); padding:1.25rem; border-radius:var(--radius-md); font-family:monospace; font-size:0.82rem; white-space:pre-wrap; max-height:360px; overflow-y:auto; line-height:1.5; color:var(--slate-800);">
${briefText.trim()}
    </div>
  `;

  openModal('Cohort Intelligence Brief', bodyHtml, `
    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    <button class="btn btn-primary" onclick="navigator.clipboard.writeText(\`${briefText.trim()}\`); showToast('Briefing copied to clipboard!', 'success');">Copy Briefing</button>
  `);
}

function openSkillTranscriptModal() {
  const student = state.getCurrentStudent();
  const readiness = getStudentCareerReadiness(student);

  const bodyHtml = `
    <div style="border: 2px solid var(--primary-700); border-radius: var(--radius-lg); padding: 1.5rem; background: #fafafa;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--primary-700); padding-bottom:1rem; margin-bottom:1.25rem;">
        <div>
          <h2 style="font-size:1.3rem; font-weight:800; color:var(--primary-900);">Skill Nexus Verified Transcript</h2>
          <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--slate-500); font-weight:700;">Industry SkillBridge Academic Registry</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.75rem; color:var(--slate-500);">Verification ID</div>
          <strong style="font-family:monospace; color:var(--primary-700);">SN-${student.id.toUpperCase()}-2026</strong>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:1rem; margin-bottom:1.5rem;">
        <div>
          <span style="font-size:0.75rem; color:var(--slate-500); text-transform:uppercase;">Candidate Name</span>
          <div style="font-weight:800; font-size:1rem; color:var(--slate-900);">${student.name}</div>
          <div style="font-size:0.8rem; color:var(--slate-600);">${student.department} • Batch ${student.batch}</div>
        </div>
        <div>
          <span style="font-size:0.75rem; color:var(--slate-500); text-transform:uppercase;">Target Career Track</span>
          <div style="font-weight:800; font-size:1rem; color:var(--slate-900);">${student.targetRole}</div>
          <div style="font-size:0.8rem; font-weight:700; color:var(--primary-700);">Industry Readiness: ${student.assessed ? readiness.matchPercentage + '%' : 'Pending Assessment'}</div>
        </div>
      </div>

      <h4 style="font-size:0.85rem; font-weight:800; text-transform:uppercase; color:var(--slate-700); margin-bottom:0.75rem; letter-spacing:0.04em;">Verified Competency Matrix (8 Core Skills)</h4>
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:0.5rem; margin-bottom:1.5rem;">
        ${SKILLS_LIST.map(skill => {
          const val = student.skills[skill] || 0;
          let tier = 'Beginner';
          if (val >= 80) tier = 'Advanced / Expert';
          else if (val >= 60) tier = 'Intermediate';
          else if (val >= 40) tier = 'Basic';
          return `
            <div style="background:var(--white); border:1px solid var(--slate-200); padding:0.6rem 0.85rem; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-weight:700; font-size:0.85rem;">${skill}</span>
                <div style="font-size:0.7rem; color:var(--slate-400);">${tier}</div>
              </div>
              <strong style="color:var(--primary-700); font-size:0.95rem;">${val}%</strong>
            </div>
          `;
        }).join('')}
      </div>

      <div style="font-size:0.75rem; color:var(--slate-500); text-align:center; border-top:1px dashed var(--slate-300); padding-top:0.75rem;">
        Verified via Skill Nexus Industry SkillBridge mathematical matching engine.
      </div>
    </div>
  `;

  openModal(`Verified Skill Transcript: ${student.name}`, bodyHtml, `
    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    <button class="btn btn-primary" onclick="window.print()">Print / Save PDF</button>
  `);
}

// ==========================================================================
// PROFILE SWITCHERS & DEMO MODALS
// ==========================================================================
function openStudentSwitcherModal() {
  const bodyHtml = `
    <p style="font-size:0.85rem; color:var(--slate-600); margin-bottom:1rem;">
      Select which student account to simulate in this session:
    </p>
    <div style="display:flex; flex-direction:column; gap:0.6rem; max-height:360px; overflow-y:auto;">
      ${state.students.map(s => `
        <div style="padding:0.75rem 1rem; border-radius:var(--radius-md); border:1.5px solid ${s.id === state.currentStudentId ? 'var(--primary-600)' : 'var(--slate-200)'}; background:${s.id === state.currentStudentId ? 'var(--primary-50)' : 'var(--white)'}; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="selectStudent('${s.id}')">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div class="user-avatar-small">${s.avatar}</div>
            <div>
              <div style="font-weight:800; font-size:0.9rem; color:var(--slate-900);">${s.name}</div>
              <div style="font-size:0.75rem; color:var(--slate-500);">${s.targetRole} • ${s.assessed ? 'Assessed' : 'Not Assessed (Demo Ready)'}</div>
            </div>
          </div>
          ${s.id === state.currentStudentId ? '<span class="chip-met">Active</span>' : '<button class="btn btn-sm btn-secondary">Switch</button>'}
        </div>
      `).join('')}
    </div>
  `;

  openModal('Switch Active Student', bodyHtml, '<button class="btn btn-secondary" onclick="closeModal()">Close</button>');
}

function selectStudent(studentId) {
  state.currentStudentId = studentId;
  state.saveState();
  closeModal();
  showToast(`Active student switched to ${state.getCurrentStudent().name}`, 'info');
  renderApp();
}

function openCompanySwitcherModal() {
  const bodyHtml = `
    <p style="font-size:0.85rem; color:var(--slate-600); margin-bottom:1rem;">
      Select which hiring company account to simulate:
    </p>
    <div style="display:flex; flex-direction:column; gap:0.6rem;">
      ${state.companies.map(c => `
        <div style="padding:0.75rem 1rem; border-radius:var(--radius-md); border:1.5px solid ${c.id === state.currentCompanyId ? 'var(--blue-600)' : 'var(--slate-200)'}; background:${c.id === state.currentCompanyId ? 'var(--blue-50)' : 'var(--white)'}; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="selectCompany('${c.id}')">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div class="user-avatar-small" style="background:var(--blue-600);">${c.logo}</div>
            <div>
              <div style="font-weight:800; font-size:0.9rem; color:var(--slate-900);">${c.name}</div>
              <div style="font-size:0.75rem; color:var(--slate-500);">${c.industry}</div>
            </div>
          </div>
          ${c.id === state.currentCompanyId ? '<span class="chip-met">Active</span>' : '<button class="btn btn-sm btn-secondary">Switch</button>'}
        </div>
      `).join('')}
    </div>
  `;

  openModal('Switch Industry Partner', bodyHtml, '<button class="btn btn-secondary" onclick="closeModal()">Close</button>');
}

function selectCompany(companyId) {
  state.currentCompanyId = companyId;
  state.saveState();
  closeModal();
  showToast(`Active company switched to ${state.getCurrentCompany().name}`, 'info');
  renderApp();
}

function openTargetRoleSwitcherModal() {
  const student = state.getCurrentStudent();
  const bodyHtml = `
    <p style="font-size:0.88rem; color:var(--slate-700); margin-bottom:1rem;">
      Choose your career track. The matching engine will re-benchmark your readiness % and gaps immediately.
    </p>
    <div style="display:flex; flex-direction:column; gap:0.75rem;">
      ${Object.entries(TARGET_ROLES).map(([role, def]) => `
        <div style="border:1.5px solid ${student.targetRole === role ? 'var(--primary-600)' : 'var(--slate-200)'}; background:${student.targetRole === role ? 'var(--primary-50)' : 'var(--white)'}; padding:1rem; border-radius:var(--radius-md); cursor:pointer;" onclick="setTargetRoleDirect('${role}')">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size:1rem; color:var(--slate-900);">${role}</strong>
            ${student.targetRole === role ? '<span class="chip-met">Current Target</span>' : '<button class="btn btn-sm btn-secondary">Select</button>'}
          </div>
          <p style="font-size:0.8rem; color:var(--slate-500); margin-top:0.35rem;">${def.description}</p>
        </div>
      `).join('')}
    </div>
  `;

  openModal('Select Target Career Role', bodyHtml, '<button class="btn btn-secondary" onclick="closeModal()">Close</button>');
}

function setTargetRoleDirect(role) {
  const student = state.getCurrentStudent();
  student.targetRole = role;
  state.saveState();
  closeModal();
  showToast(`Target career role updated to ${role}!`, 'success');
  renderApp();
}

// Guided Tour / Demo Walkthrough Modal
function openDemoGuideModal() {
  const bodyHtml = `
    <div style="font-size:0.88rem; color:var(--slate-700); line-height:1.55;">
      <h4 style="font-size:1rem; font-weight:800; color:var(--primary-900); margin-bottom:0.5rem;">
        Complete 6-Step End-to-End Demo Walkthrough:
      </h4>
      <ol style="margin-left:1.25rem; display:flex; flex-direction:column; gap:0.65rem;">
        <li>
          <strong>Step 1: Student Assessment</strong><br/>
          Click <em>"Launch Student Flow (Arun Kumar)"</em>. Arun starts unassessed. Answer the 8-question quiz to compute readiness % and store skill scores.
        </li>
        <li>
          <strong>Step 2: Skill Profile & Gaps</strong><br/>
          Inspect the gap bars (Green = Met, Amber = Gap). Click <em>"⚡ Improve My Skills"</em> on a learning program to boost scores and observe the instant recalculation!
        </li>
        <li>
          <strong>Step 3: Opportunity Matching & Apply</strong><br/>
          Navigate to <em>"Recommended Opportunities"</em>. Expand <em>"How is this calculated?"</em> to review the exact mathematical formula. Click <em>"Apply Now"</em> on <em>Data Analyst Intern at TechNova</em>.
        </li>
        <li>
          <strong>Step 4: Switch to Industry Role (TechNova)</strong><br/>
          Use the top-bar role switcher to switch to <strong>Industry</strong>. Go to <em>"Candidate Matches"</em>. Arun Kumar is ranked with his match %. Click <strong>"Shortlist"</strong> or <strong>"Select"</strong>.
        </li>
        <li>
          <strong>Step 5: Verify Student Pipeline</strong><br/>
          Switch back to <strong>Student (Arun Kumar)</strong> &rarr; <em>"My Applications"</em>. His status is instantly updated to <strong>Shortlisted</strong>!
        </li>
        <li>
          <strong>Step 6: Institution Analytics</strong><br/>
          Switch to <strong>Institution</strong>. Notice the real-time dynamic charts: Top Skill Gaps, Student vs Industry requirement, and the computed curriculum training insight!
        </li>
      </ol>
    </div>
  `;

  const footerHtml = `
    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    <button class="btn btn-primary" onclick="closeModal(); startDemoAsArun();">Start Demo Now &rarr;</button>
  `;

  openModal('End-to-End Evaluation Guide', bodyHtml, footerHtml);
}

function startDemoAsArun() {
  state.currentRole = 'student';
  state.currentStudentId = 'stud_1'; // Arun Kumar
  state.currentView = 'student-dashboard';
  state.saveState();
  renderApp();
}

function resetAllDemoData() {
  if (confirm('Reset all demo data to seed state? This restores Arun Kumar to unassessed so the assessment flow can be run again.')) {
    state.resetToDefaults();
    showToast('Demo data reset to pristine state.', 'info');
    renderApp();
  }
}

// Collapsible sidebar toggle
function toggleSidebarCollapse() {
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) {
    sidebar.classList.toggle('collapsed');
  }
}

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
