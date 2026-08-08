/**
 * MailMind AI — Pre-loaded Sample Emails for Testing & Demo
 */

const SAMPLE_EMAILS = [
  {
    id: "sample-1",
    sender: "Sarah Jenkins <sarah.jenkins@techcorp.io>",
    recipient: "Alex Rivera <alex.rivera@techcorp.io>",
    subject: "URGENT: Q3 Client Presentation & Financial Audit Review",
    date: "Saturday, Oct 24, 2026 at 09:15 AM",
    body: `Hi Alex,

I hope you're having a good morning. 

We ran into a major block with the Q3 Client Presentation for the Board meeting on Monday. Marcus found a $45,000 discrepancy in the regional revenue figures in section 4.

Could you please audit the raw spreadsheets and send me the corrected slide deck by 5:00 PM today? We need to submit the finalized presentation to the VP by 7:00 PM tonight.

Also, please confirm if you can lead the financial overview segment during our prep meeting tomorrow, Sunday Oct 25, from 2:00 PM to 3:00 PM via Zoom (https://techcorp.zoom.us/j/987654321).

Thanks so much for jumping on this so quickly!

Best regards,
Sarah Jenkins
Senior Project Lead | TechCorp`,
    attachments: "Q3_Revenue_Draft_v2.xlsx (4.2 MB)",
    links: ["https://techcorp.zoom.us/j/987654321"],
    userLanguage: "Auto-detect"
  },
  {
    id: "sample-2",
    sender: "IT Support Security Desk <security-verify-alerts@paypals-support-portal.net>",
    recipient: "Alex Rivera <alex.rivera@techcorp.io>",
    subject: "CRITICAL: Suspicious Login Detected - Action Required Within 2 Hours!",
    date: "Saturday, Oct 24, 2026 at 11:42 AM",
    body: `Dear User,

Our automated threat intelligence system detected an unauthorized login attempt to your corporate email and financial portal from an unknown IP address in Moscow, Russia (IP: 185.220.101.5).

To prevent permanent account suspension and protect your payroll data, you MUST immediately verify your credentials and reset your security password using our secure server link:

http://login-verify-security-reset.net/auth/login?email=alex.rivera@techcorp.io

Failure to verify within 2 hours will result in permanent locking of your account and reporting to corporate compliance.

Sincerely,
Global IT Security Operations Team`,
    attachments: "Security_Alert_Report.scr",
    links: ["http://login-verify-security-reset.net/auth/login?email=alex.rivera@techcorp.io"],
    userLanguage: "Auto-detect"
  },
  {
    id: "sample-3",
    sender: "David Chen <david.chen@designhub.co>",
    recipient: "Alex Rivera <alex.rivera@techcorp.io>",
    subject: "Invitation: Product Strategy & UI Redesign Sync",
    date: "Friday, Oct 23, 2026 at 03:30 PM",
    body: `Hi Alex,

Let's get together next week to review the new design prototypes for the mobile app redesign.

Meeting Details:
- Event: Mobile UI Redesign Sync
- Date: Wednesday, Oct 28, 2026
- Time: 10:00 AM - 11:00 AM EST
- Location: Conference Room B / Google Meet (https://meet.google.com/abc-defg-hij)
- Attendees: David Chen, Alex Rivera, Elena Rostova

Agenda:
1. Review user testing feedback on navigation drawer.
2. Sign off on color accessibility compliance.
3. Assign sprint tasks for front-end implementation.

Please let me know if this time works for you or if we need to reschedule.

Best,
David`,
    attachments: "UI_Design_Tokens_v1.fig",
    links: ["https://meet.google.com/abc-defg-hij"],
    userLanguage: "Auto-detect"
  },
  {
    id: "sample-4",
    sender: "Billing Department <invoices@cloudserviceprovider.com>",
    recipient: "Alex Rivera <alex.rivera@techcorp.io>",
    subject: "Invoice #INV-2026-8912 Overdue Notice",
    date: "Thursday, Oct 22, 2026 at 08:00 AM",
    body: `Dear Valued Customer,

This is a reminder that Invoice #INV-2026-8912 for your Cloud Server Infrastructure Subscription ($1,250.00 USD) was due on Oct 20, 2026.

Please remit payment by Oct 30, 2026 to avoid service disruption. You can view your detailed billing invoice and submit payment via your account dashboard.

If you have already processed this payment, please disregard this notice.

Thank you for your business.

Cloud Service Provider Billing Team`,
    attachments: "Invoice_INV_2026_8912.pdf",
    links: ["https://cloudserviceprovider.com/dashboard/billing"],
    userLanguage: "Auto-detect"
  },
  {
    id: "sample-5",
    sender: "Carlos Mendoza <carlos.mendoza@client-es.com>",
    recipient: "Alex Rivera <alex.rivera@techcorp.io>",
    subject: "Consulta sobre la nueva API de Integración y plazos de entrega",
    date: "Wednesday, Oct 21, 2026 at 02:15 PM",
    body: `Hola Alex,

Espero que te encuentres muy bien.

Te escribo para consultar sobre el estado de la integración de la API de pagos que estuvimos revisando la semana pasada. Nuestro equipo técnico necesita conocer los endpoints finales y la documentación para iniciar las pruebas antes del viernes 30 de octubre.

¿Podrías enviarnos la documentación actualizada y programar una breve llamada de 15 minutos mañana para aclarar dudas?

Quedo a la espera de tu respuesta.

Saludos cordiales,
Carlos Mendoza
Director de Tecnología | Client ES`,
    attachments: "None",
    links: [],
    userLanguage: "Auto-detect"
  },
  {
    id: "sample-6",
    sender: "Tech Weekly Digest <newsletter@techweeklydigest.io>",
    recipient: "Alex Rivera <alex.rivera@techcorp.io>",
    subject: "Tech Digest #142: Breakthroughs in AI Reasoning & Autonomous Agents",
    date: "Monday, Oct 19, 2026 at 06:00 AM",
    body: `Welcome to Tech Digest #142!

Here are this week's top engineering and AI stories:
1. Next-gen autonomous agents are automating complex email workflows with zero hallucination.
2. WebAssembly 3.0 specs released with enhanced threading support.
3. Top 10 CSS glassmorphism UI patterns for modern web apps.

Read the full articles on our portal or manage your subscription settings below.

Unsubscribe | Preference Center`,
    attachments: "None",
    links: ["https://techweeklydigest.io/articles/142"],
    userLanguage: "Auto-detect"
  }
];
