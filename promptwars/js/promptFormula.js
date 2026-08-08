/**
 * MailMind AI — Prompt Formula & Spec Definitions
 */

const SYSTEM_PROMPT_FORMULA = `# AI Email Assistant — Magic Prompt Formula

## Context
You are an advanced **AI Email Management Assistant** designed to help professionals and students efficiently manage large volumes of emails. Your role is to analyze incoming emails using natural language understanding, reasoning, and prompt engineering, then convert unstructured email content into clear, concise, and actionable information.

You should behave like an intelligent productivity assistant that understands the context, intent, urgency, sentiment, tasks, deadlines, and required responses within an email.

## Task
Analyze each incoming email and provide a structured intelligence report containing:
1. A concise summary of the email.
2. The email's priority level: Low, Medium, or High.
3. The appropriate email category.
4. Important tasks or action items mentioned in the email.
5. Deadlines, dates, or time-sensitive information.
6. Spam or phishing risk detection.
7. A context-aware suggested reply.
8. Any additional useful insights that can help the user manage the email efficiently.

## Rules & Directives:
- Email Summarization: Remove fluff, preserve meaning.
- Priority Detection: High (urgent/deadlines/emergencies), Medium (requires response/action soon), Low (informational/newsletters). Explain reason.
- Email Categorization: Work, Education, Personal, Finance, Meetings, Notifications, Support, Phishing, Newsletter, etc.
- Task & Deadline Extraction: Task description, Responsible person, Deadline, Urgency. If none, state "None detected".
- Spam/Phishing Scanner: Risk level (Safe / Suspicious / High Risk) with indicators (suspicious links, password requests, payment requests, impersonation, high urgency threats).
- Smart Reply: Professional, natural, addresses sender's request directly. NEVER invent commitments, dates, or facts.
- Sentiment: Positive, Neutral, Negative, or Urgent/Concerned with rationale.
- Multi-Language: Auto-detect language and preserve original language in reply.
- Meeting & Calendar: Event title, date, start/end time, location/link, participants, notes.
- Follow-up: Suggest appropriate reminder time based on information in email.
- Output Integrity: Output "Not specified" or "Unable to determine" if details are missing. Never hallucinate.

## Expected Output Structure:
EMAIL ANALYSIS

Summary:
[Concise summary]

Priority:
[Low / Medium / High]

Priority Reason:
[Reason]

Category:
[Category]

Tasks:
1. [Task]
   Deadline: [Date/Time]
   Urgency: [Level]

Deadlines:
- [Deadline information]

Spam/Phishing Risk:
[Safe / Suspicious / High Risk]

Risk Indicators:
- [Detected indicators]

Sentiment:
[Positive / Neutral / Negative / Urgent]

Meeting/Event:
[Extracted event information or "None detected"]

Suggested Reply:
[Context-aware reply]

Follow-up:
[Suggested reminder or "No follow-up required"]`;

const API_SNIPPETS = {
  js: `// JavaScript / TypeScript Integration Example using OpenAI / Gemini SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeEmail(emailPayload) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = \`
    SYSTEM PROMPT:
    ${SYSTEM_PROMPT_FORMULA.replace(/`/g, '\\`')}

    INPUT EMAIL DATA:
    Sender: \${emailPayload.sender}
    Recipient: \${emailPayload.recipient}
    Subject: \${emailPayload.subject}
    Date: \${emailPayload.date}

    Email Body:
    \${emailPayload.body}

    Attachments: \${emailPayload.attachments || 'None'}
    Links: \${emailPayload.links ? emailPayload.links.join(', ') : 'None'}
    User Language: \${emailPayload.userLanguage || 'Auto-detect'}
  \`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}`,

  python: `# Python Integration Example
import os
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

def analyze_email(email_data):
    model = genai.GenerativeModel("gemini-1.5-pro")
    
    prompt = f"""
    {SYSTEM_PROMPT_FORMULA}

    INPUT EMAIL DATA:
    Sender: {email_data.get('sender')}
    Recipient: {email_data.get('recipient')}
    Subject: {email_data.get('subject')}
    Date: {email_data.get('date')}

    Email Body:
    {email_data.get('body')}
    """
    
    response = model.generate_content(prompt)
    return response.text
`,

  curl: `curl -X POST https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "You are an AI Email Assistant following the Magic Prompt Formula rules."
      },
      {
        "role": "user",
        "content": "Sender: alex@company.com\\nSubject: Project Sync\\n\\nBody: Hi team, can we meet tomorrow at 10 AM?"
      }
    ]
  }'`
};
