/**
 * Brevo Email Service
 * Sends transactional emails using Brevo REST API v3.
 */

import { headers } from "next/headers";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Dynamically resolves the absolute logo URL depending on the environment.
 * Falls back safely if executed outside a Next.js request context (e.g. scripts).
 */
async function getLogoUrl() {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    if (host) {
      const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
      return `${protocol}://${host}/logo.jpg`;
    }
  } catch (error) {
    // Suppress error when run outside Next.js request context (e.g., node test scripts)
  }
  // Hardcoded fallback to the production URL on Vercel
  return "https://ieee-recruitment-c1870.vercel.app/logo.jpg";
}

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
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "ieeeeducation@klu.ac.in";
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
 * Generates a colorful, high-fidelity submission confirmation HTML.
 */
export async function getSubmissionEmailHtml(name) {
  const whatsappLink = "https://chat.whatsapp.com/LEVdBbZvnnEI3Flh1SKX6Y?s=cl&p=a&ilr=0";
  const logoUrl = await getLogoUrl();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Received</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f3f6fa;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          background-color: #f3f6fa;
          padding: 40px 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(12, 26, 48, 0.08);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .header {
          background: linear-gradient(135deg, #0A192F 0%, #00629B 100%);
          padding: 40px 20px;
          text-align: center;
          position: relative;
        }
        .header img {
          max-height: 60px;
          display: inline-block;
          background-color: #ffffff;
          padding: 6px 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .header-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #00B4FF 0%, #E77724 50%, #10B981 100%);
        }
        .content {
          padding: 45px 40px;
          color: #334155;
          line-height: 1.65;
        }
        h2 {
          color: #0F172A;
          font-size: 26px;
          margin-top: 0;
          margin-bottom: 8px;
          font-weight: 800;
          text-align: center;
          letter-spacing: -0.5px;
        }
        .subtitle {
          color: #00629B;
          font-size: 13.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
          margin-bottom: 30px;
          margin-top: 0;
        }
        p {
          font-size: 15.5px;
          color: #475569;
          margin-bottom: 20px;
          line-height: 1.7;
        }
        .divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: 30px 0;
        }
        .card {
          background-color: #ecfdf5;
          border-left: 5px solid #10b981;
          padding: 24px;
          margin: 30px 0;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.04);
        }
        .card-title {
          font-weight: 800;
          color: #065f46;
          margin-bottom: 10px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
        }
        .card-text {
          font-size: 14px;
          color: #047857;
          margin: 0;
          line-height: 1.6;
        }
        .btn-whatsapp-container {
          text-align: center;
          margin: 35px 0;
        }
        .btn-whatsapp {
          display: inline-block;
          background-color: #25D366;
          color: #ffffff !important;
          text-decoration: none;
          padding: 16px 36px;
          font-size: 14px;
          font-weight: 800;
          border-radius: 30px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.35);
          transition: all 0.3s ease;
        }
        .btn-whatsapp:hover {
          background-color: #1ebe5d;
          box-shadow: 0 10px 30px rgba(37, 211, 102, 0.45);
        }
        .signature-block {
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #f1f5f9;
        }
        .regards-text {
          font-size: 14.5px;
          color: #475569;
          margin: 0;
          line-height: 1.5;
        }
        .regards-team {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
          margin: 4px 0 0 0;
        }
        .footer {
          background-color: #f8fafc;
          padding: 35px 20px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
        }
        .footer a {
          color: #00629B;
          text-decoration: none;
          font-weight: 700;
        }
        .footer-logo {
          font-weight: 800;
          color: #0F172A;
          letter-spacing: 1px;
          margin-bottom: 8px;
          font-size: 13.5px;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <!-- IEEE Education Society Logo -->
            <img src="${logoUrl}" alt="KARE IEEE Education Society Logo">
            <div class="header-glow"></div>
          </div>
          <div class="content">
            <h2>Application Received! 🎉</h2>
            <div class="subtitle">KARE IEEE Education Society</div>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for submitting your application to join the core committee of <strong>KARE IEEE Education Society</strong>. We are thrilled that you want to be a part of our chapter! Our executive board is currently reviewing all submissions.</p>
            
            <div class="card">
              <div class="card-title">🚨 Mandatory Action Required</div>
              <p class="card-text">All crucial recruitment updates, interview slot selections, technical tests, and results will be announced <strong>exclusively</strong> inside our official WhatsApp community group.</p>
            </div>
            
            <p>To ensure you do not miss your scheduled interview, technical evaluations, or crucial announcements, please click the button below to join the WhatsApp group immediately:</p>
            
            <div class="btn-whatsapp-container">
              <!-- WhatsApp green CTA button -->
              <a href="${whatsappLink}" target="_blank" class="btn-whatsapp">
                Join WhatsApp Group
              </a>
            </div>
            
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 10px;">
              * Note: Leaving the WhatsApp group may result in missing your recruitment slots.
            </p>
            
            <div class="signature-block">
              <p class="regards-text">Regards,</p>
              <h3 class="regards-team">KARE IEEE Education Society</h3>
            </div>
          </div>
          <div class="footer">
            <div class="footer-logo">KARE IEEE EDUCATION SOCIETY</div>
            <p style="margin: 4px 0 0 0;">Kalasalingam Academy of Research and Education</p>
            <p style="margin: 8px 0 0 0;">Need help? Email us at <a href="mailto:ieeeeducation@klu.ac.in">ieeeeducation@klu.ac.in</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates selection notification HTML (styled like a colourful, professional Appointment Order).
 */
export async function getSelectionEmailHtml({ name, role, dueDate }) {
  const logoUrl = await getLogoUrl();
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
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f1f5f9;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          background-color: #f1f5f9;
          padding: 40px 0;
        }
        .container {
          max-width: 650px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.1);
          overflow: hidden;
          border: 1px solid #cbd5e1;
        }
        /* Colorful Gradient Bar at top */
        .color-bar {
          height: 6px;
          background: linear-gradient(90deg, #0A192F 0%, #00629B 30%, #E77724 70%, #10B981 100%);
        }
        .header {
          background-color: #ffffff;
          padding: 40px 40px 20px 40px;
          text-align: center;
          border-bottom: 2px dashed #e2e8f0;
        }
        .header img {
          max-height: 65px;
          margin-bottom: 12px;
          background-color: #ffffff;
          padding: 4px 12px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        .society-title {
          font-size: 19px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: 1.5px;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        .society-subtitle {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 15px;
          letter-spacing: 0.8px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .order-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #475569;
          font-family: 'Courier New', Courier, monospace;
          border-top: 1px solid #f1f5f9;
          padding-top: 12px;
          margin-top: 5px;
          font-weight: bold;
        }
        .order-meta-item {
          text-align: left;
        }
        .order-meta-item.right {
          text-align: right;
        }
        .content {
          padding: 45px 45px;
          color: #334155;
          line-height: 1.7;
        }
        .order-title {
          text-align: center;
          font-size: 22px;
          font-weight: 800;
          color: #00629B;
          letter-spacing: 2px;
          margin-bottom: 25px;
          text-transform: uppercase;
        }
        .order-title:after {
          content: "";
          display: block;
          width: 90px;
          height: 3px;
          background: linear-gradient(90deg, #E77724 0%, #FF8F3D 100%);
          margin: 10px auto 0 auto;
          border-radius: 2px;
        }
        .salutation {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 18px;
          color: #0F172A;
        }
        p {
          font-size: 15px;
          color: #334155;
          margin-bottom: 22px;
          text-align: justify;
        }
        .details-box {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
          padding: 24px 28px;
          margin: 32px 0;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.01);
        }
        .details-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 0;
          font-size: 14px;
        }
        .details-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .details-row:first-child {
          padding-top: 0;
        }
        .details-label {
          color: #64748b;
          font-weight: 600;
          flex-shrink: 0;
        }
        .details-value {
          color: #0F172A;
          font-weight: 700;
          text-align: right;
        }
        .role-value {
          color: #00629B;
          font-size: 15px;
        }
        .due-date {
          color: #dc2626 !important;
          background-color: #fee2e2;
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 13px;
          border: 1px solid #fca5a5;
        }
        .regards-block {
          margin-top: 30px;
          margin-bottom: 35px;
        }
        .regards-text {
          font-size: 15px;
          color: #475569;
          margin: 0;
          line-height: 1.5;
        }
        .regards-team {
          font-size: 17px;
          font-weight: 800;
          color: #0F172A;
          margin: 4px 0 0 0;
        }
        .signatures {
          margin-top: 45px;
          border-top: 1px solid #e2e8f0;
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
          border-bottom: 1.5px solid #94a3b8;
        }
        .sig-name {
          font-weight: 700;
          font-size: 13px;
          color: #0F172A;
        }
        .sig-title {
          font-size: 11.5px;
          color: #64748b;
          font-weight: 600;
        }
        .footer {
          background-color: #f8fafc;
          padding: 24px;
          text-align: center;
          font-size: 11px;
          color: #94a3b8;
          border-top: 1px solid #f1f5f9;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="color-bar"></div>
          <div class="header">
            <!-- IEEE Education Society Logo -->
            <img src="${logoUrl}" alt="KARE IEEE Education Society Logo">
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
                <span class="details-value role-value">${role}</span>
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
            
            <div class="regards-block">
              <p class="regards-text">Regards,</p>
              <h3 class="regards-team">KARE IEEE Education Society</h3>
            </div>

            <div class="signatures">
              <div class="sig-block">
                <div class="sig-line" style="margin-top: 35px;"></div>
                <div class="sig-name">Executive Board</div>
                <div class="sig-title">IEEE Student Branch Coord.</div>
              </div>
              <div class="sig-block">
                <div class="sig-line" style="margin-top: 35px;"></div>
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
