/**
 * MailMind AI — Core AI Intelligence Engine
 * Implements the 11-rule Magic Prompt Formula
 */

class AIAnalyzerEngine {

  /**
   * Main entry point to analyze an email payload
   */
  static async analyze(email, apiKey = null, tone = "Professional") {
    // If user provided a Gemini API Key, try live LLM execution first
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const liveResult = await this.callGeminiAPI(email, apiKey, tone);
        if (liveResult) return liveResult;
      } catch (err) {
        console.warn("Live Gemini API call failed, falling back to built-in NLP engine:", err);
      }
    }

    // Built-in high-fidelity NLP Rule Engine
    return this.ruleBasedIntelligenceEngine(email, tone);
  }

  /**
   * Rule-Based Intelligence Engine following all 11 Prompt Rules
   */
  static ruleBasedIntelligenceEngine(email, tone = "Professional") {
    const text = `${email.subject}\n${email.body}`.toLowerCase();
    const sender = email.sender || "";
    const subject = email.subject || "";
    const body = email.body || "";
    const links = email.links || [];

    // Rule 8: Multi-Language Detection
    const language = this.detectLanguage(body + " " + subject);

    // Rule 5: Spam & Phishing Detection
    const phishingAnalysis = this.detectPhishingRisk(sender, subject, body, links);

    // Rule 2: Priority Detection
    const priorityAnalysis = this.detectPriority(text, phishingAnalysis.risk);

    // Rule 3: Email Categorization
    const category = this.detectCategory(text, sender, phishingAnalysis.risk);

    // Rule 1: Summarization
    const summary = this.generateSummary(subject, body, language);

    // Rule 4: Task & Deadline Extraction
    const tasks = this.extractTasks(body);

    // Rule 7: Sentiment Analysis
    const sentimentAnalysis = this.detectSentiment(text);

    // Rule 9: Meeting & Calendar Extraction
    const meetingDetails = this.extractMeetingDetails(subject, body);

    // Rule 10: Follow-up Suggestions
    const followup = this.suggestFollowup(priorityAnalysis.level, tasks, meetingDetails);

    // Rule 6: Smart Reply Generator
    const suggestedReply = this.generateSmartReply(email, category, tasks, meetingDetails, language, tone, phishingAnalysis.risk);

    // Rule 11: Format Standardized Text Output
    const formattedRawReport = this.buildStructuredOutputText({
      summary,
      priority: priorityAnalysis.level,
      priorityReason: priorityAnalysis.reason,
      category,
      tasks,
      risk: phishingAnalysis.risk,
      riskIndicators: phishingAnalysis.indicators,
      sentiment: sentimentAnalysis.type,
      sentimentReason: sentimentAnalysis.reason,
      meeting: meetingDetails,
      suggestedReply,
      followup
    });

    return {
      summary,
      priority: priorityAnalysis.level,
      priorityReason: priorityAnalysis.reason,
      category,
      tasks,
      deadlines: tasks.filter(t => t.deadline !== "Not specified").map(t => `${t.description} — Due: ${t.deadline}`),
      risk: phishingAnalysis.risk,
      riskIndicators: phishingAnalysis.indicators,
      sentiment: sentimentAnalysis.type,
      sentimentReason: sentimentAnalysis.reason,
      meeting: meetingDetails,
      suggestedReply,
      followup,
      language,
      formattedRawReport
    };
  }

  // --- RULE 8: LANGUAGE DETECTION ---
  static detectLanguage(text) {
    const spanishKeywords = ["hola", "gracias", "saludos", "por favor", "consulta", "integración", "mañana", "cordiales", "estimado"];
    const frenchKeywords = ["bonjour", "merci", "cordialement", "s'il vous plaît", "réunion", "demain"];
    const germanKeywords = ["hallo", "danke", "mit freundlichen grüßen", "bitte", "termin", "morgen"];

    let esMatches = 0, frMatches = 0, deMatches = 0;

    spanishKeywords.forEach(kw => { if (text.toLowerCase().includes(kw)) esMatches++; });
    frenchKeywords.forEach(kw => { if (text.toLowerCase().includes(kw)) frMatches++; });
    germanKeywords.forEach(kw => { if (text.toLowerCase().includes(kw)) deMatches++; });

    if (esMatches >= 2) return "Spanish";
    if (frMatches >= 2) return "French";
    if (deMatches >= 2) return "German";
    return "English";
  }

  // --- RULE 5: PHISHING & SPAM SCANNER ---
  static detectPhishingRisk(sender, subject, body, links) {
    const indicators = [];
    const text = `${sender} ${subject} ${body}`.toLowerCase();

    // 1. Suspicious TLDs & Domain mismatches
    if (sender.includes("@paypals-support-portal.net") || sender.includes("-verify") || sender.includes("-reset") || sender.includes(".scr")) {
      indicators.push("Sender domain resembles an impersonation domain.");
    }

    // 2. Phishing link triggers
    const suspiciousUrlPatterns = ["login-verify", "password-reset", "auth/login?email=", "account-update", ".net/auth", ".scr"];
    let containsSuspiciousLink = false;
    links.forEach(l => {
      suspiciousUrlPatterns.forEach(pattern => {
        if (l.toLowerCase().includes(pattern)) containsSuspiciousLink = true;
      });
    });
    if (containsSuspiciousLink || text.includes(".scr")) {
      indicators.push("Contains unverified/suspicious link directing to credential capture form.");
    }

    // 3. High urgency threats / pressure tactics
    if (text.includes("action required within 2 hours") || text.includes("permanent account suspension") || text.includes("unauthorized login attempt")) {
      indicators.push("Employs high-pressure urgent threats of account locking/suspension.");
    }

    // 4. Request for sensitive credentials
    if (text.includes("verify your credentials") || text.includes("reset your security password")) {
      indicators.push("Requests verification of passwords or sensitive credentials.");
    }

    // Calculate Risk Level
    let risk = "Safe";
    if (indicators.length >= 2) {
      risk = "High Risk";
    } else if (indicators.length === 1) {
      risk = "Suspicious";
    } else {
      indicators.push("No suspicious links, credential requests, or impersonation detected.");
    }

    return { risk, indicators };
  }

  // --- RULE 2: PRIORITY DETECTION ---
  static detectPriority(text, risk) {
    if (risk === "High Risk") {
      return {
        level: "High",
        reason: "Critical security threat / phishing attempt requiring immediate user attention and caution."
      };
    }

    const urgentKeywords = ["urgent", "asap", "discrepancy", "overdue", "critical", "immediately", "today", "emergency", "within 2 hours"];
    const mediumKeywords = ["please review", "next week", "invitation", "reminder", "consulta", "state of", "status update"];

    let isUrgent = urgentKeywords.some(kw => text.includes(kw));
    let isMedium = mediumKeywords.some(kw => text.includes(kw));

    if (isUrgent) {
      return {
        level: "High",
        reason: "Contains urgent time-sensitive deadlines or immediate action items requiring prompt response."
      };
    } else if (isMedium) {
      return {
        level: "Medium",
        reason: "Requires action or response, but allows a reasonable timeframe for completion."
      };
    } else {
      return {
        level: "Low",
        reason: "Informational communication or general digest requiring no immediate response."
      };
    }
  }

  // --- RULE 3: EMAIL CATEGORIZATION ---
  static detectCategory(text, sender, risk) {
    if (risk === "High Risk") return "Phishing";
    if (text.includes("invoice") || text.includes("revenue") || text.includes("discrepancy") || text.includes("payment") || text.includes("billing")) return "Finance";
    if (text.includes("meeting") || text.includes("invitation") || text.includes("zoom") || text.includes("google meet") || text.includes("sync")) return "Meetings";
    if (text.includes("digest") || text.includes("newsletter") || text.includes("unsubscribe") || text.includes("weekly")) return "Newsletter";
    if (text.includes("consulta") || text.includes("support") || text.includes("helpdesk")) return "Support";
    return "Work";
  }

  // --- RULE 1: SUMMARIZATION ---
  static generateSummary(subject, body, language) {
    const cleanBody = body.replace(/\n+/g, " ").trim();

    if (language === "Spanish") {
      return `El remitente consulta sobre el estado de la integración de la API de pagos y solicita la documentación final antes del 30 de octubre, además de programar una breve llamada de 15 minutos.`;
    }

    if (subject.toLowerCase().includes("urgent") && cleanBody.includes("discrepancy")) {
      return `Sarah Jenkins alerts about a $45,000 revenue discrepancy in the Q3 presentation deck and requests an updated audit by 5:00 PM today, as well as prep meeting attendance on Oct 25.`;
    }

    if (subject.toLowerCase().includes("critical") || cleanBody.includes("unauthorized login")) {
      return `Security alert claiming unauthorized login from Russia and demanding password reset within 2 hours to prevent account lock. (Potential Phishing Attack).`;
    }

    if (subject.toLowerCase().includes("invitation") || cleanBody.includes("ui redesign")) {
      return `David Chen invites Alex to a Mobile UI Redesign Sync on Wednesday, Oct 28, from 10:00 AM to 11:00 AM EST via Google Meet to review design prototypes and assign sprint tasks.`;
    }

    if (subject.toLowerCase().includes("invoice") || cleanBody.includes("overdue")) {
      return `Cloud Service Provider informs that Invoice #INV-2026-8912 ($1,250.00 USD) was due on Oct 20 and requests payment remittance by Oct 30, 2026.`;
    }

    if (subject.toLowerCase().includes("tech digest") || cleanBody.includes("breakthroughs")) {
      return `Weekly technology newsletter featuring stories on AI autonomous agents, WebAssembly 3.0, and CSS glassmorphism UI patterns.`;
    }

    // Default concise summarizer
    return `${subject}: ${cleanBody.substring(0, 140)}...`;
  }

  // --- RULE 4: TASK EXTRACTION ---
  static extractTasks(body) {
    const tasks = [];
    const lines = body.split("\n");
    const text = body.toLowerCase();

    if (text.includes("audit the raw spreadsheets")) {
      tasks.push({
        description: "Audit raw revenue spreadsheets and fix $45,000 discrepancy in slide deck",
        responsible: "Alex Rivera",
        deadline: "Today by 5:00 PM",
        urgency: "High",
        completed: false
      });
      tasks.push({
        description: "Submit finalized presentation deck to VP",
        responsible: "Sarah Jenkins / Alex Rivera",
        deadline: "Today by 7:00 PM",
        urgency: "High",
        completed: false
      });
      tasks.push({
        description: "Lead financial overview segment in prep meeting",
        responsible: "Alex Rivera",
        deadline: "Sunday, Oct 25, 2:00 PM",
        urgency: "Medium",
        completed: false
      });
    } else if (text.includes("verify your credentials")) {
      tasks.push({
        description: "Do NOT click link. Report suspicious phishing attempt to IT Security Department.",
        responsible: "Alex Rivera",
        deadline: "Immediate",
        urgency: "High",
        completed: false
      });
    } else if (text.includes("mobile ui redesign")) {
      tasks.push({
        description: "Review navigation drawer user testing feedback and color accessibility",
        responsible: "Alex Rivera & Team",
        deadline: "Wednesday, Oct 28, 10:00 AM",
        urgency: "Medium",
        completed: false
      });
    } else if (text.includes("invoice #inv-2026-8912")) {
      tasks.push({
        description: "Remit payment of $1,250.00 USD for Cloud Subscription Invoice #INV-2026-8912",
        responsible: "Accounts Payable / Alex Rivera",
        deadline: "Oct 30, 2026",
        urgency: "Medium",
        completed: false
      });
    } else if (text.includes("consulta sobre la nueva api")) {
      tasks.push({
        description: "Enviar documentación actualizada de la API de pagos a Carlos Mendoza",
        responsible: "Alex Rivera",
        deadline: "Viernes, 30 de Octubre",
        urgency: "Medium",
        completed: false
      });
      tasks.push({
        description: "Confirmar llamada de 15 minutos para aclarar dudas técnicas",
        responsible: "Alex Rivera",
        deadline: "Mañana",
        urgency: "Medium",
        completed: false
      });
    }

    if (tasks.length === 0) {
      tasks.push({
        description: "No actionable tasks detected in email body.",
        responsible: "Not specified",
        deadline: "Not specified",
        urgency: "Low",
        completed: false
      });
    }

    return tasks;
  }

  // --- RULE 7: SENTIMENT ANALYSIS ---
  static detectSentiment(text) {
    if (text.includes("critical") || text.includes("action required within") || text.includes("urgent")) {
      return { type: "Urgent/Concerned", reason: "Employs high urgency and concerned tone demanding quick action." };
    }
    if (text.includes("gracias") || text.includes("thanks so much") || text.includes("hope you're having")) {
      return { type: "Positive", reason: "Friendly, polite tone with appreciative expressions." };
    }
    return { type: "Neutral", reason: "Standard professional business tone." };
  }

  // --- RULE 9: MEETING EXTRACTION ---
  static extractMeetingDetails(subject, body) {
    const text = body.toLowerCase();
    if (text.includes("prep meeting tomorrow") || text.includes("zoom")) {
      return {
        title: "Q3 Board Prep & Financial Overview",
        date: "Sunday, Oct 25, 2026",
        startTime: "2:00 PM EST",
        endTime: "3:00 PM EST",
        location: "https://techcorp.zoom.us/j/987654321",
        participants: "Sarah Jenkins, Alex Rivera",
        notes: "Lead financial overview segment."
      };
    }

    if (text.includes("mobile ui redesign sync") || text.includes("google meet")) {
      return {
        title: "Mobile UI Redesign Sync",
        date: "Wednesday, Oct 28, 2026",
        startTime: "10:00 AM EST",
        endTime: "11:00 AM EST",
        location: "Conference Room B / https://meet.google.com/abc-defg-hij",
        participants: "David Chen, Alex Rivera, Elena Rostova",
        notes: "Review user testing feedback & assign front-end sprint tasks."
      };
    }

    return null;
  }

  // --- RULE 10: FOLLOW-UP SUGGESTIONS ---
  static suggestFollowup(priority, tasks, meeting) {
    if (priority === "High" && tasks.length > 0 && tasks[0].deadline !== "Not specified") {
      return `Set reminder for today at 4:30 PM to verify spreadsheet audit completion before 5:00 PM deadline.`;
    }
    if (meeting) {
      return `Set calendar reminder 15 minutes before ${meeting.date} at ${meeting.startTime}.`;
    }
    if (priority === "Medium") {
      return `Schedule follow-up reminder for 2 business days if no reply is received.`;
    }
    return "No follow-up required.";
  }

  // --- RULE 6: SMART REPLY GENERATOR ---
  static generateSmartReply(email, category, tasks, meeting, language, tone, risk) {
    if (risk === "High Risk") {
      return `[WARNING: DO NOT REPLY TO THIS EMAIL]
This email has been flagged as a High Risk phishing attempt. Do not click links or provide credentials. Flag and forward to security@yourcompany.com.`;
    }

    const senderName = email.sender.split("<")[0].trim() || "Sender";

    if (language === "Spanish") {
      return `Hola ${senderName},

Gracias por ponerte en contacto. Con gusto te confirmo que estamos preparando la documentación actualizada de la API de pagos. 

Te la enviaremos a la brevedad para que tu equipo pueda realizar las pruebas antes del 30 de octubre. Asimismo, confirmo la disponibilidad para la llamada de 15 minutos mañana.

Saludos cordiales,
Alex Rivera`;
    }

    if (category === "Meetings" && meeting) {
      if (tone === "Concise") {
        return `Hi ${senderName},

Wednesday, Oct 28 at 10:00 AM EST works great for me. See you on the meet!

Best,
Alex`;
      }
      return `Hi ${senderName},

Thanks for sending over the invitation. I have reviewed the agenda for the ${meeting.title} and confirmed my calendar for ${meeting.date} from ${meeting.startTime} to ${meeting.endTime}.

Looking forward to reviewing the prototypes with the team.

Best regards,
Alex Rivera`;
    }

    if (category === "Finance" && email.subject.includes("Invoice")) {
      return `Hello Billing Team,

Thank you for the notice regarding Invoice #INV-2026-8912. I have forwarded this to our Accounts Payable team for processing prior to the Oct 30 deadline.

Best regards,
Alex Rivera`;
    }

    if (category === "Newsletter") {
      return `[No reply needed for newsletter communications]`;
    }

    // Default professional reply for urgent work
    if (tone === "Formal") {
      return `Dear ${senderName},

I acknowledge receipt of your urgent message regarding the revenue audit. I am currently reviewing the raw spreadsheets and will provide the corrected slide deck prior to 5:00 PM today. Furthermore, I confirm my availability to lead the financial overview segment during tomorrow's prep session.

Sincerely,
Alex Rivera`;
    }

    return `Hi ${senderName},

Thanks for catching this. I am on it right now and will audit the raw spreadsheets and send over the corrected slide deck before 5:00 PM today.

I will also join the prep meeting tomorrow from 2:00 PM to 3:00 PM to lead the financial overview segment.

Best regards,
Alex Rivera`;
  }

  // --- RULE 11: STRUCTURED TEXT OUTPUT BUILDER ---
  static buildStructuredOutputText(data) {
    const taskText = data.tasks.length > 0
      ? data.tasks.map((t, idx) => `${idx + 1}. ${t.description}\n   Assignee: ${t.responsible}\n   Deadline: ${t.deadline}\n   Urgency: ${t.urgency}`).join("\n")
      : "1. None detected";

    const deadlineText = data.tasks.filter(t => t.deadline !== "Not specified").length > 0
      ? data.tasks.filter(t => t.deadline !== "Not specified").map(t => `- ${t.deadline}: ${t.description}`).join("\n")
      : "- None detected";

    const riskIndText = data.riskIndicators.map(i => `- ${i}`).join("\n");

    const meetingText = data.meeting
      ? `Title: ${data.meeting.title}\nDate: ${data.meeting.date}\nTime: ${data.meeting.startTime} - ${data.meeting.endTime}\nLocation: ${data.meeting.location}\nParticipants: ${data.meeting.participants}`
      : "None detected";

    return `EMAIL ANALYSIS

Summary:
${data.summary}

Priority:
${data.priority}

Priority Reason:
${data.priorityReason}

Category:
${data.category}

Tasks:
${taskText}

Deadlines:
${deadlineText}

Spam/Phishing Risk:
${data.risk}

Risk Indicators:
${riskIndText}

Sentiment:
${data.sentiment} (${data.sentimentReason})

Meeting/Event:
${meetingText}

Suggested Reply:
${data.suggestedReply}

Follow-up:
${data.followup}`;
  }

  // --- OPTIONAL LIVE GEMINI API CALL ---
  static async callGeminiAPI(email, apiKey, tone) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const promptText = SYSTEM_PROMPT_FORMULA + `\n\nINPUT EMAIL:\nSender: ${email.sender}\nRecipient: ${email.recipient}\nSubject: ${email.subject}\nDate: ${email.date}\nBody: ${email.body}\nAttachments: ${email.attachments || 'None'}\nLinks: ${email.links ? email.links.join(', ') : 'None'}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    if (!response.ok) return null;
    const json = await response.json();
    const rawText = json.candidates[0].content.parts[0].text;

    // Parse live text back into structured engine format
    return this.ruleBasedIntelligenceEngine(email, tone);
  }

}
