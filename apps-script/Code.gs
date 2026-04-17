// PA Agent Intake Form — Google Apps Script Backend
// Deploy as: Web App → Anyone can access → Execute as: Me
// Paste the deployed URL into index.html SCRIPT_URL variable

const SHEET_NAME = 'Submissions';
const NOTIFY_EMAIL = 'sami.rae24@icloud.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet with headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp',
        'Name', 'Email', 'Phone', 'Location', 'LinkedIn',
        'Career Story', 'Industries', 'Other Industry', 'Highest Role', 'Certifications',
        'Top Skills (8+)', 'Growth Areas (3-)', 'All Skill Ratings', 'Hidden Skills',
        'Network Size', 'Network Types', 'Strategic Contacts', 'Fundraising Confidence', 'Key Contacts',
        'Alt Investment Familiarity', 'Capital Raising History', 'Compliance Knowledge', 'CRM Experience', 'AC Fit',
        'Work Style', 'Current Tools', 'AI Comfort', 'AI Wish', 'Time Waster',
        'Communication Style', 'Conflict Style', 'Motivators', 'Ideal Workday', 'Writing Style', 'Catchphrases', 'Tone to Avoid',
        'Why EWO', '12-Month Vision', 'Current Blockers', 'Hours Available', 'Wildcard',
        'Full JSON'
      ]);
      sheet.setFrozenRows(1);
    }

    const b = data.basics || {};
    const bg = data.background || {};
    const sk = data.skills || {};
    const nw = data.network || {};
    const ac = data.ac_experience || {};
    const ws = data.work_style_and_ai || {};
    const pv = data.personality_and_voice || {};
    const bp = data.big_picture || {};

    const row = [
      new Date().toISOString(),
      b.name, b.email, b.phone, b.location, b.linkedin,
      bg.career_story,
      (bg.industries || []).join(', '),
      bg.other_industry,
      bg.highest_role,
      bg.certifications,
      (sk.top_skills || []).join(', '),
      (sk.growth_areas || []).join(', '),
      sk.ratings ? Object.entries(sk.ratings).map(([k,v]) => `${k}: ${v}/10`).join(' | ') : '',
      sk.hidden_skills,
      nw.size,
      (nw.types || []).join(', '),
      (nw.strategic_contacts || []).join(', '),
      nw.fundraising_confidence,
      nw.key_contacts,
      ac.alt_investment_familiarity,
      ac.capital_raising_history,
      ac.compliance_knowledge,
      ac.crm_experience,
      (ac.self_assessed_ac_fit || []).join(', '),
      (ws.work_style || []).join(', '),
      (ws.current_tools || []).join(', '),
      ws.ai_comfort_level,
      ws.ai_wish,
      ws.biggest_time_waster,
      pv.communication_style,
      pv.conflict_style,
      (pv.motivators || []).join(', '),
      pv.ideal_workday,
      pv.writing_style,
      pv.catchphrases,
      pv.tone_to_avoid,
      bp.why_ewo,
      bp.twelve_month_vision,
      bp.current_blockers,
      bp.weekly_hours_available,
      bp.wildcard,
      JSON.stringify(data, null, 2)
    ];

    sheet.appendRow(row);

    // Email notification
    const subject = `✅ EWO Intake Submission — ${b.name || 'Unknown'}`;
    const body = `New submission from ${b.name || 'Unknown'} (${b.email || 'no email'})

TOP SKILLS (8+): ${(sk.top_skills || []).join(', ') || 'none rated 8+'}
NETWORK SIZE: ${nw.size || 'not specified'}
FUNDRAISING CONFIDENCE: ${nw.fundraising_confidence}/10
ALT INVESTMENT KNOWLEDGE: ${ac.alt_investment_familiarity || 'not specified'}
AI COMFORT: ${ws.ai_comfort_level}/10
HOURS AVAILABLE: ${bp.weekly_hours_available || 'not specified'}
AC FIT: ${(ac.self_assessed_ac_fit || []).join(', ') || 'not specified'}

View full data in your Google Sheet.`;

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'PA Intake Form backend is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}
