# Skill Nexus – Industry SkillBridge
> **"Know what to learn. Know where to apply. Know what industry needs."**

Skill Nexus is a skill-intelligence and opportunity-matching platform connecting **Students**, **Industries**, and **Institutions (Academicians)** through precision formula-driven gap analysis, live matching, and closed-loop skills feedback.

---

## 🚀 Live Demo & Local Access
The application is running locally at:
👉 **`http://localhost:8080/`**

To launch directly in your browser:
```powershell
Start-Process "http://localhost:8080/"
```

To run or restart the lightweight server anytime:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 8080
```

---

## 🎯 Core Matching Engine Formula
Used consistently across Student Career Readiness, Opportunity Matching, and Candidate Ranking:

$$\text{skill\_match}_i = \min\left(\frac{\text{student\_score}_i}{\text{req\_i}}, 1\right) \quad (\text{missing skill} = 0)$$

$$\text{Match } \% = \text{round}\left( \frac{\sum (w_i \times \text{skill\_match}_i)}{\sum w_i} \times 100 \right)$$

- **Status Criteria**:
  - `✓ Met`: $\text{student\_score}_i \ge \text{req}_i$
  - `⚠ Gap`: $\text{student\_score}_i < \text{req}_i$, with $\text{gap\_size} = \text{req}_i - \text{student\_score}_i$
- **Top Gaps**: Identified skills sorted descending by $\text{gap\_size}$ (top 3 displayed).
- **Match Labels**:
  - $\ge 80\%$: **Strong Match** (Emerald Green)
  - $60\% - 79\%$: **Good Match** (Sky Blue)
  - $< 60\%$: **Stretch** (Amber / Coral)

---

## 🌟 The 6-Step End-to-End Demo Walkthrough

### Step 1: Student Assessment Flow
1. On the landing page, click **"Launch Student Flow (Arun Kumar)"**.
2. Arun Kumar starts in an **Unassessed state** (Readiness: N/A, Pending).
3. Click **"Take Assessment Now"**.
4. Complete the **8-Question Adaptive Quiz** (one question at a time with live progress bar) across all 8 core skills (*Python, Java, SQL, Communication, Problem Solving, Data Analysis, Excel, Teamwork*).
5. Select target career goal (*Data Analyst*, *Python Developer*, or *Business Analyst*).
6. Click **"Complete Assessment & View Gaps"**.

### Step 2: Skill Profile, Gaps & Upskilling Feedback Loop
1. View the **Skill Profile & Gap Analysis** screen with circular readiness gauge.
2. Inspect the **horizontal competency bars** (Green = Met, Amber = Gap) and the **Gap Table**.
3. Under **Targeted Learning Programs**, find a course addressing a gap skill (e.g. *Applied Business & Data Analysis Bootcamp* or *SQL Mastery*).
4. Click **"⚡ Improve My Skills (+20%)"**.
5. Observe the live feedback loop: skill score jumps by +20%, gap shrinks, and overall Industry Readiness % recalculates instantly!

### Step 3: Opportunity Matching & 1-Click Application
1. Click **"Recommended Opportunities"** in the sidebar.
2. Notice postings sorted dynamically by **Match %** using the exact formula.
3. Use the filter toolbar to filter by **Type** (*Internship, Full-time Job, Apprenticeship, Live Project*), **Match Tier**, or search by keyword.
4. Click **"📐 How is this calculated?"** on any opportunity card to view the mathematical breakdown and weighted sum contribution.
5. Click **"Apply Now"** on *Data Analyst Intern at TechNova*.
6. Button status updates immediately to **"Status: Applied"**.

### Step 4: Industry Recruiter Flow
1. In the top bar, click the **Industry** role button.
2. Welcome to **TechNova Solutions** recruiter portal showing active postings, applicant counts, and qualified candidates.
3. Click **"Candidate Matches"** in the sidebar.
4. View the ranked candidate pool for *Data Analyst Intern*. Arun Kumar appears ranked by his match score.
5. Click **"Shortlist"** or **"Select"** on Arun Kumar's profile.

### Step 5: Real-Time Sync Verification
1. In the top bar, switch back to the **Student** role (Arun Kumar).
2. Click **"My Applications"** in the sidebar.
3. Observe that Arun's application status for TechNova has instantly updated to **"Shortlisted"** in green!
4. Click **"📜 Verified Transcript"** in the student dashboard header to inspect the verified transcript with verification ID.

### Step 6: Institution Academician Portal & Actionable Analytics
1. In the top bar, switch to the **Institution** role.
2. Inspect the **6 KPI cards** (Total Students, Assessed %, Opportunities, Applications, Shortlisted, Partners).
3. Explore the **3 Dynamic SVG Visualizations**:
   - **Chart 1: Top Skill Gaps** (% of assessed students below requirement per skill).
   - **Chart 2: Student Average vs Industry Market Requirement** (Grouped bar chart).
   - **Chart 3: Industry Demand Frequency** (Demand velocity ratings: High / Very High).
4. Review the computed insight:
   *"X% of assessed students have [Skill] as a major skill gap. This indicates a potential need for an industry-led [Skill] training program."*
5. Test the **Cohort Scope Filter** to filter by department (*CSE, IT, AI & Data Science, Management & Tech, Business Systems*).
6. Click **"⚡ Organise Industry Intervention"** to schedule a Workshop, Guest Lecture, or Live Project with corporate partners, and observe it appear in the **Active & Upcoming Industry Interventions** calendar!
7. Click **"📄 Export Brief"** to preview and copy the cohort intelligence summary.

---

## ⚙️ Technology Stack
- **Architecture**: Zero-dependency Vanilla HTML5, CSS3, ES6 Javascript SPA.
- **Styling**: Tailored SaaS design system with Deep Teal (`#0F766E`), Sapphire Blue (`#2563EB`), Emerald Green (`#10B981`), and Amber accents.
- **Charts**: Custom responsive SVG vector charts with zero external charting bundle risks.
- **Persistence**: High-performance `localStorage` reactive state bus with instant single-click **"Reset Data"** capability.
