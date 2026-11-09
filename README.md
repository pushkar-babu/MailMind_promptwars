# 📧 MailMind AI — Intelligent Email Assistant

**MailMind AI** is an AI-powered Email Intelligence Assistant designed to make email management smarter, faster, and more efficient.

It analyzes email content, identifies important information, detects potential phishing attempts, extracts actionable tasks, and generates context-aware email replies.

The project combines AI-powered analysis with a built-in rule-based NLP engine to help users understand and manage their emails effectively.

## ✨ Features

- **📩 Email Analysis:** Analyze email content and generate structured intelligence reports.
- **📝 Smart Summarization:** Convert lengthy emails into concise summaries.
- **🚦 Priority Detection:** Automatically classify emails as High, Medium, or Low priority.
- **🏷️ Email Categorization:** Categorize emails into Finance, Meetings, Work, Support, Newsletter, and Phishing.
- **🛡️ Phishing Detection:** Identify suspicious links, credential requests, impersonation, and urgency-based threats.
- **✅ Task Extraction:** Extract actionable tasks, responsible persons, deadlines, and urgency levels.
- **💬 Smart Reply Generation:** Generate professional email replies with different tones.
- **🌍 Language Detection:** Detect supported languages and adapt suggested replies.
- **📅 Meeting Extraction:** Identify meeting dates, times, locations, and participants.
- **🔔 Follow-up Suggestions:** Recommend follow-up actions based on email context.
- **📊 Action Center:** Track extracted tasks and manage their completion.
- **📥 Custom Email Input:** Add and analyze your own email content.
- **📄 Export Calendar Events:** Download extracted meeting information as an ICS calendar file.

## 🖥️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive UI |
| JavaScript | Application logic |
| Gemini API | AI-powered email analysis |
| Rule-Based NLP | Built-in email analysis engine |
| Lucide Icons | Interface icons |

## ⚙️ How It Works

1. Select a sample email or enter a custom email.
2. MailMind analyzes its sender, subject, body, and links.
3. The intelligence engine processes the email.
4. The application generates an analysis report.
5. Review the summary, priority, phishing risk, tasks, and suggested reply.
6. Manage extracted tasks and export meeting events.

## 🧠 AI Intelligence Engine

MailMind AI supports two analysis modes:

**1. Gemini AI Integration**
- Uses the Google Gemini API for AI-powered email analysis.
- Generates context-aware summaries and replies.
- Supports configurable reply tones.

**2. Built-in Rule-Based Engine**
- Works without an API key.
- Uses predefined NLP rules and pattern matching.
- Provides email classification, task extraction, and phishing indicators.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/MailMind-AI.git
```

### 2. Open the Project

Navigate to the project directory:

```bash
cd MailMind-AI
```

Open the following file in your browser:

```text
promptwars/index.html
```

You can also use the VS Code Live Server extension.

### 3. Configure Gemini API (Optional)

1. Get an API key from Google AI Studio.
2. Open MailMind AI in your browser.
3. Navigate to LLM Settings.
4. Enter your Gemini API key.
5. Save the key to enable Gemini-powered analysis.

**Note:** Without an API key, the application uses its built-in rule-based analysis engine.

## 📂 Project Structure

```text
MailMind-AI/
│
├── promptwars/
│   ├── index.html
│   ├── styles.css
│   │
│   └── js/
│       ├── aiAnalyzer.js
│       ├── app.js
│       ├── promptFormula.js
│       └── sampleEmails.js
│
└── README.md
```

## 🔮 Future Improvements

- Gmail API integration for real inbox access.
- Advanced phishing detection using AI.
- Improved task and deadline extraction.
- Email attachment analysis.
- Calendar synchronization.
- Secure backend integration.
- Persistent email and task storage.

## 🎯 Project Objective

The main objective of MailMind AI is to simplify email management by transforming unstructured email messages into meaningful insights and actionable information.

Instead of manually reading every email, users can quickly understand what matters, identify potential threats, and decide what action to take.

---

**Developed with ❤️ using HTML, CSS, JavaScript, and AI.**

