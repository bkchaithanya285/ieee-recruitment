/**
 * Brevo Email Service
 * Sends transactional emails using Brevo REST API v3.
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Sends an email using Brevo's SMTP API.
 * 
 * @param {object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.toName - Recipient name
 * @param {string} params.subject - Email subject
 * @param {string} params.htmlContent - Email HTML body
 * @returns {Promise<boolean>}
 */
export async function sendEmail({ to, toName, subject, htmlContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "ieee.edusoc.kare@gmail.com";
  const senderName = process.env.BREVO_SENDER_NAME || "KARE IEEE Education Society";

  if (!apiKey) {
    console.error("Missing BREVO_API_KEY environment variable. Email sending skipped.");
    return false;
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: to.trim().toLowerCase(),
            name: toName.trim(),
          },
        ],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Brevo API Error (${response.status}):`, errorText);
      return false;
    }

    const data = await response.json();
    console.log(`Email successfully sent to ${to} (MessageId: ${data.messageId})`);
    return true;
  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    return false;
  }
}

/**
 * Generates submission confirmation HTML.
 * Matches WhatsApp greeting style with an elegant layout.
 */
export function getSubmissionEmailHtml(name) {
  const whatsappLink = "https://chat.whatsapp.com/LEVdBbZvnnEI3Flh1SKX6Y?s=cl&p=a&ilr=0";
  const logoUrl = "https://education.ieee.org/wp-content/uploads/2018/09/IEEE_Education_Society_Logo_Color.png";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Received</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f6f9fc;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          background-color: #f6f9fc;
          padding: 30px 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #eef2f6;
        }
        .header {
          background-color: #0c1a30;
          padding: 30px 20px;
          text-align: center;
          border-bottom: 3px solid #00629B;
        }
        .header img {
          max-height: 55px;
          display: inline-block;
        }
        .content {
          padding: 40px 35px;
          color: #333333;
          line-height: 1.6;
        }
        h2 {
          color: #0c1a30;
          font-size: 22px;
          margin-top: 0;
          margin-bottom: 20px;
          font-weight: 700;
        }
        p {
          font-size: 15px;
          color: #4a5568;
          margin-bottom: 20px;
        }
        .card {
          background-color: #f7fafc;
          border-left: 4px solid #319795;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .card-title {
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 8px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .card-text {
          font-size: 13.5px;
          color: #4a5568;
          margin: 0;
        }
        .btn-whatsapp {
          display: inline-flex;
          align-items: center;
          background-color: #25D366;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 28px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 6px rgba(37, 211, 102, 0.2);
          transition: background-color 0.2s;
          margin: 15px 0;
        }
        .btn-whatsapp:hover {
          background-color: #1ebe5d;
        }
        .footer {
          background-color: #f7fafc;
          padding: 25px 20px;
          text-align: center;
          font-size: 12px;
          color: #718096;
          border-top: 1px solid #edf2f7;
        }
        .footer a {
          color: #00629B;
          text-decoration: none;
        }
        .footer-logo {
          font-weight: 800;
          color: #0c1a30;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <!-- IEEE Education Society Logo -->
            <img src="${logoUrl}" alt="IEEE Education Society Logo">
          </div>
          <div class="content">
            <h2>Application Reached Us! 🎉</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for applying to join the <strong>KARE IEEE Education Society</strong>. We have successfully received your application, and our student coordinators will verify your registration details shortly.</p>
            
            <div class="card">
              <div class="card-title">⚠️ Mandatory Next Step</div>
              <p class="card-text">All recruitment updates, interview slot selections, technical test schedules, and results will be announced <strong>exclusively</strong> within our official WhatsApp community group.</p>
            </div>
            
            <p>If you haven't joined yet, please click the button below to join the WhatsApp group immediately to ensure you don't miss your interview slot:</p>
            
            <div style="text-align: center; margin: 30px 0 10px 0;">
              <!-- WhatsApp green CTA button -->
              <a href="${whatsappLink}" target="_blank" class="btn-whatsapp">
                Join Official WhatsApp Group
              </a>
            </div>
            
            <p style="font-size: 12px; color: #a0aec0; text-align: center; margin-top: 5px;">
              * Note: Please remain in the group for the entire recruitment process.
            </p>
            
            <p style="margin-top: 30px;">Regards,<br><strong>KARE IEEE Education Society Recruitment Cell</strong></p>
          </div>
          <div class="footer">
            <div class="footer-logo">KARE IEEE EDUCATION SOCIETY</div>
            <p style="margin: 5px 0 0 0;">Kalasalingam Academy of Research and Education</p>
            <p style="margin: 5px 0 0 0;">For queries, contact us at <a href="mailto:education@kareieee.org">education@kareieee.org</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates selection notification HTML (styled like an Appointment Order).
 */
export function getSelectionEmailHtml({ name, role, dueDate }) {
  const logoUrl = "https://education.ieee.org/wp-content/uploads/2018/09/IEEE_Education_Society_Logo_Color.png";
  const refNumber = `KARE-IEEE-EDS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Official Appointment Order</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f3f4f6;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          background-color: #f3f4f6;
          padding: 40px 0;
        }
        .container {
          max-width: 650px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .header {
          background-color: #ffffff;
          padding: 35px 40px 15px 40px;
          text-align: center;
          border-bottom: 2px dashed #e5e7eb;
        }
        .header img {
          max-height: 60px;
          margin-bottom: 10px;
        }
        .society-title {
          font-size: 16px;
          font-weight: 800;
          color: #0c1a30;
          letter-spacing: 1px;
          margin-bottom: 2px;
          text-transform: uppercase;
        }
        .society-subtitle {
          font-size: 11px;
          color: #4b5563;
          margin-bottom: 15px;
          letter-spacing: 0.5px;
        }
        .order-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #4b5563;
          font-family: monospace;
          border-top: 1px solid #f3f4f6;
          padding-top: 12px;
          margin-top: 5px;
        }
        .order-meta-item {
          text-align: left;
        }
        .order-meta-item.right {
          text-align: right;
        }
        .content {
          padding: 40px;
          color: #1f2937;
          line-height: 1.6;
        }
        .order-title {
          text-align: center;
          font-size: 20px;
          font-weight: 800;
          color: #00629B;
          letter-spacing: 1.5px;
          margin-bottom: 30px;
          text-transform: uppercase;
          text-decoration: underline;
        }
        .salutation {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 15px;
          color: #111827;
        }
        p {
          font-size: 14.5px;
          color: #374151;
          margin-bottom: 20px;
          text-align: justify;
        }
        .details-box {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 20px 25px;
          margin: 30px 0;
        }
        .details-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #f3f4f6;
          padding: 8px 0;
          font-size: 13.5px;
        }
        .details-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .details-row:first-child {
          padding-top: 0;
        }
        .details-label {
          color: #6b7280;
          font-weight: 600;
          flex-shrink: 0;
        }
        .details-value {
          color: #111827;
          font-weight: 700;
          text-align: right;
        }
        .due-date {
          color: #dc2626 !important;
        }
        .signatures {
          margin-top: 40px;
          border-top: 1px solid #f3f4f6;
          padding-top: 30px;
          display: flex;
          justify-content: space-between;
        }
        .sig-block {
          text-align: center;
          width: 45%;
        }
        .sig-line {
          width: 80%;
          margin: 0 auto 8px auto;
          border-bottom: 1px solid #9ca3af;
        }
        .sig-name {
          font-weight: 700;
          font-size: 12.5px;
          color: #111827;
        }
        .sig-title {
          font-size: 11px;
          color: #6b7280;
        }
        .footer {
          background-color: #f9fafb;
          padding: 20px;
          text-align: center;
          font-size: 11px;
          color: #9ca3af;
          border-top: 1px solid #f3f4f6;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="IEEE Education Society Logo">
            <div class="society-title">KARE IEEE Education Society</div>
            <div class="society-subtitle">Kalasalingam Academy of Research and Education, Krishnankoil</div>
            
            <div class="order-meta">
              <div class="order-meta-item">
                <strong>REF NO:</strong> ${refNumber}
              </div>
              <div class="order-meta-item right">
                <strong>DATE:</strong> ${currentDate}
              </div>
            </div>
          </div>
          
          <div class="content">
            <div class="order-title">Official Appointment Order</div>
            
            <div class="salutation">Dear ${name},</div>
            
            <p>Based on your performance in the recruitment interviews and evaluations held by the Executive Board, we are pleased to inform you that you have been selected to join the core team of <strong>KARE IEEE Education Society</strong> for the academic year 2026-2027.</p>
            
            <p>You are hereby appointed to the following position with immediate effect, subject to your formal confirmation:</p>
            
            <div class="details-box">
              <div class="details-row">
                <span class="details-label">Appointee Name:</span>
                <span class="details-value">${name}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Assigned Role/Domain:</span>
                <span class="details-value" style="color: #00629B;">${role}</span>
              </div>
              <div class="details-row">
                <span class="details-label">Organization:</span>
                <span class="details-value">KARE IEEE Education Society</span>
              </div>
              <div class="details-row">
                <span class="details-label">Confirmation Due Date:</span>
                <span class="details-value due-date">${dueDate}</span>
              </div>
            </div>
            
            <p>As a core committee member, you will be expected to work collaboratively with your team members, demonstrate leadership quality, and actively contribute to the workshops, technical events, and initiatives organized by the chapter.</p>
            
            <p>Please note that onboarding details and task assignments will be coordinated through our WhatsApp group. Ensure that you have accepted this appointment and confirmed your onboarding details by the due date mentioned above.</p>
            
            <p>Congratulations once again! We look forward to an outstanding tenure working together to drive academic and technical excellence.</p>
            
            <div class="signatures">
              <div class="sig-block">
                <div class="sig-line" style="margin-top: 30px;"></div>
                <div class="sig-name">Executive Board</div>
                <div class="sig-title">IEEE Student Branch Coord.</div>
              </div>
              <div class="sig-block">
                <div class="sig-line" style="margin-top: 30px;"></div>
                <div class="sig-name">Faculty Advisor</div>
                <div class="sig-title">KARE IEEE Education Society</div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            This is an officially generated appointment document. All rights reserved &copy; ${new Date().getFullYear()} KARE IEEE Education Society.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
