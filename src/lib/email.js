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
 * Generates a colorful, high-fidelity, table-based submission confirmation HTML (fully compatible with mobile).
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
        /* Mobile styling overrides */
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
            border-radius: 0px !important;
            border-left: none !important;
            border-right: none !important;
          }
          .content {
            padding: 30px 20px !important;
          }
          h2 {
            font-size: 22px !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f6fa;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f6fa; padding: 20px 0;">
        <tr>
          <td align="center">
            
            <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(12, 26, 48, 0.08); overflow: hidden; border: 1px solid #e2e8f0; border-collapse: collapse;">
              
              <!-- Gradient Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0A192F 0%, #00629B 100%); padding: 40px 20px; text-align: center;">
                  <img src="${logoUrl}" alt="KARE IEEE Education Society Logo" style="max-height: 60px; background-color: #ffffff; padding: 6px 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: inline-block;">
                </td>
              </tr>
              
              <!-- Header bottom border line -->
              <tr>
                <td height="5" style="height: 5px; background: linear-gradient(90deg, #00B4FF 0%, #E77724 50%, #10B981 100%); line-height: 0px; font-size: 0px;">&nbsp;</td>
              </tr>
              
              <!-- Body Content -->
              <tr>
                <td class="content" style="padding: 45px 40px; color: #334155;">
                  <h2 style="color: #0F172A; font-size: 26px; margin: 0 0 8px 0; font-weight: 800; text-align: center; letter-spacing: -0.5px;">Application Received! 🎉</h2>
                  <div style="color: #00629B; font-size: 13.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-bottom: 30px;">KARE IEEE Education Society</div>
                  
                  <p style="font-size: 15.5px; color: #475569; margin: 0 0 20px 0; line-height: 1.7;">Hello <strong>${name}</strong>,</p>
                  <p style="font-size: 15.5px; color: #475569; margin: 0 0 20px 0; line-height: 1.7;">Thank you for submitting your application to join the core committee of <strong>KARE IEEE Education Society</strong>. We are thrilled that you want to be a part of our chapter! Our executive board is currently reviewing all submissions.</p>
                  
                  <!-- Alert Callout Card -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ecfdf5; border-left: 5px solid #10b981; margin: 30px 0; border-radius: 8px; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 24px;">
                        <div style="font-weight: 800; color: #065f46; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">🚨 Mandatory Action Required</div>
                        <div style="font-size: 14px; color: #047857; margin: 0; line-height: 1.6;">All crucial recruitment updates, interview slot selections, technical tests, and results will be announced <strong>exclusively</strong> inside our official WhatsApp community group.</div>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="font-size: 15.5px; color: #475569; margin: 0 0 20px 0; line-height: 1.7; text-align: center;">To ensure you do not miss your scheduled interview, technical evaluations, or crucial announcements, please click the button below to join the WhatsApp group immediately:</p>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding: 15px 0 5px 0;">
                        <a href="${whatsappLink}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff !important; text-decoration: none; padding: 16px 36px; font-size: 14px; font-weight: 800; border-radius: 30px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 8px 25px rgba(37, 211, 102, 0.35);">Join WhatsApp Group</a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 10px 0 0 0;">
                    * Note: Leaving the WhatsApp group may result in missing your recruitment slots.
                  </p>
                  
                  <!-- Divider Line -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 35px 0 30px 0; border-collapse: collapse;">
                    <tr>
                      <td height="1" style="height: 1px; background-color: #e2e8f0; line-height: 0; font-size: 0;">&nbsp;</td>
                    </tr>
                  </table>
                  
                  <!-- Signature Section -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <p style="font-size: 14.5px; color: #475569; margin: 0; line-height: 1.5;">Regards,</p>
                        <h3 style="font-size: 16px; font-weight: 800; color: #0F172A; margin: 4px 0 0 0;">KARE IEEE Education Society</h3>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- Footer Details -->
              <tr>
                <td class="footer" style="background-color: #f8fafc; padding: 35px 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9;">
                  <div class="footer-logo" style="font-weight: 800; color: #0F172A; letter-spacing: 1px; margin-bottom: 8px; font-size: 13.5px;">KARE IEEE EDUCATION SOCIETY</div>
                  <p style="margin: 4px 0 0 0;">Kalasalingam Academy of Research and Education</p>
                  <p style="margin: 8px 0 0 0;">Need help? Email us at <a href="mailto:ieeeeducation@klu.ac.in" style="color: #00629B; text-decoration: none; font-weight: 700;">ieeeeducation@klu.ac.in</a></p>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Generates selection notification HTML (styled like a colourful, table-based Appointment Order).
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
        @media only screen and (max-width: 650px) {
          .container {
            width: 100% !important;
            border-radius: 0px !important;
            border-left: none !important;
            border-right: none !important;
          }
          .content {
            padding: 30px 20px !important;
          }
          .header {
            padding: 30px 20px 15px 20px !important;
          }
          .details-box {
            padding: 15px 15px !important;
            margin: 25px 0 !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 40px 0;">
        <tr>
          <td align="center">
            
            <table class="container" width="650" cellpadding="0" cellspacing="0" border="0" style="max-width: 650px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 15px 35px rgba(15, 23, 42, 0.1); overflow: hidden; border: 1px solid #cbd5e1; border-collapse: collapse;">
              
              <!-- Color Gradient Line -->
              <tr>
                <td height="6" style="height: 6px; background: linear-gradient(90deg, #0A192F 0%, #00629B 30%, #E77724 70%, #10B981 100%); line-height: 0px; font-size: 0px;">&nbsp;</td>
              </tr>
              
              <!-- Document Header -->
              <tr>
                <td class="header" style="background-color: #ffffff; padding: 40px 40px 15px 40px; text-align: center;">
                  <img src="${logoUrl}" alt="KARE IEEE Education Society Logo" style="max-height: 65px; margin-bottom: 12px; background-color: #ffffff; padding: 4px 12px; border-radius: 6px; border: 1px solid #e2e8f0; display: inline-block;">
                  <div class="society-title" style="font-size: 18px; font-weight: 800; color: #0F172A; letter-spacing: 1.5px; margin: 0 0 4px 0; text-transform: uppercase;">KARE IEEE Education Society</div>
                  <div class="society-subtitle" style="font-size: 11.5px; color: #64748b; margin: 0 0 15px 0; letter-spacing: 0.8px; font-weight: 700; text-transform: uppercase;">Kalasalingam Academy of Research and Education, Krishnankoil</div>
                  
                  <!-- Metadata Header Table (aligning Ref & Date side-by-side) -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 5px; font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #475569; font-weight: bold;">
                    <tr>
                      <td align="left">REF NO: ${refNumber}</td>
                      <td align="right">DATE: ${currentDate}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Header bottom border line -->
              <tr>
                <td height="2" style="height: 2px; border-bottom: 2px dashed #cbd5e1; line-height: 0px; font-size: 0px;">&nbsp;</td>
              </tr>
              
              <!-- Content Body -->
              <tr>
                <td class="content" style="padding: 45px 45px; color: #334155;">
                  
                  <h1 class="order-title" style="text-align: center; font-size: 22px; font-weight: 800; color: #00629B; letter-spacing: 2px; margin: 0 0 25px 0; text-transform: uppercase;">Official Appointment Order</h1>
                  
                  <div class="salutation" style="font-size: 16px; font-weight: 800; margin-bottom: 18px; color: #0F172A;">Dear ${name},</div>
                  
                  <p style="font-size: 15px; color: #334155; margin: 0 0 22px 0; text-align: justify; line-height: 1.7;">Based on your performance in the recruitment interviews and evaluations held by the Executive Board, we are pleased to inform you that you have been selected to join the core team of <strong>KARE IEEE Education Society</strong> for the academic year 2026-2027.</p>
                  
                  <p style="font-size: 15px; color: #334155; margin: 0 0 22px 0; text-align: justify; line-height: 1.7;">You are hereby appointed to the following position with immediate effect, subject to your formal confirmation:</p>
                  
                  <!-- Details Box (Robust Table based layout for perfect side-by-side alignment) -->
                  <table class="details-box" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px dashed #cbd5e1; border-radius: 8px; margin: 32px 0; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 20px;">
                        
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          
                          <!-- Row 1: Name -->
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b; font-weight: 600;">Appointee Name:</td>
                            <td align="right" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0F172A; font-weight: 700;">${name}</td>
                          </tr>
                          
                          <!-- Row 2: Role -->
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b; font-weight: 600;">Assigned Role/Domain:</td>
                            <td align="right" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 15px; color: #00629B; font-weight: 700;">${role}</td>
                          </tr>
                          
                          <!-- Row 3: Org -->
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b; font-weight: 600;">Organization:</td>
                            <td align="right" style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #0F172A; font-weight: 700;">KARE IEEE Education Society</td>
                          </tr>
                          
                          <!-- Row 4: Due Date -->
                          <tr>
                            <td style="padding: 12px 0; font-size: 14px; color: #64748b; font-weight: 600;">Confirmation Due Date:</td>
                            <td align="right" style="padding: 12px 0;">
                              <span class="due-date" style="color: #dc2626; background-color: #fee2e2; padding: 4px 10px; border-radius: 4px; font-size: 13px; font-weight: 700; border: 1px solid #fca5a5; display: inline-block;">${dueDate}</span>
                            </td>
                          </tr>
                          
                        </table>
                        
                      </td>
                    </tr>
                  </table>
                  
                  <p style="font-size: 15px; color: #334155; margin: 0 0 22px 0; text-align: justify; line-height: 1.7;">As a core committee member, you will be expected to work collaboratively with your team members, demonstrate leadership quality, and actively contribute to the workshops, technical events, and initiatives organized by the chapter.</p>
                  
                  <p style="font-size: 15px; color: #334155; margin: 0 0 22px 0; text-align: justify; line-height: 1.7;">Please note that onboarding details and task assignments will be coordinated through our WhatsApp group. Ensure that you have accepted this appointment and confirmed your onboarding details by the due date mentioned above.</p>
                  
                  <p style="font-size: 15px; color: #334155; margin: 0 0 22px 0; text-align: justify; line-height: 1.7;">Congratulations once again! We look forward to an outstanding tenure working together to drive academic and technical excellence.</p>
                  
                  <!-- Regards block -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0 35px 0;">
                    <tr>
                      <td>
                        <p style="font-size: 15px; color: #475569; margin: 0; line-height: 1.5;">Regards,</p>
                        <h3 style="font-size: 17px; font-weight: 800; color: #0F172A; margin: 4px 0 0 0;">KARE IEEE Education Society</h3>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Centered Signature Table -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e2e8f0; padding-top: 30px; margin-top: 45px;">
                    <tr>
                      <td align="center">
                        <table width="280" cellpadding="0" cellspacing="0" border="0" style="text-align: center;">
                          <tr>
                            <td align="center">
                              <div style="width: 220px; border-bottom: 1.5px solid #94a3b8; margin-bottom: 8px;">&nbsp;</div>
                              <div style="font-weight: 700; font-size: 13px; color: #0F172A; margin-bottom: 2px;">Dr. P. Chinnasamy</div>
                              <div style="font-size: 11.5px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 2px;">SBC COUNSELLOR</div>
                              <div style="font-size: 11.5px; color: #64748b; font-weight: 600;">KARE IEEE Education Society</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- Footer Legal Print -->
              <tr>
                <td class="footer" style="background-color: #f8fafc; padding: 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                  This is an officially generated appointment document. All rights reserved &copy; ${new Date().getFullYear()} KARE IEEE Education Society.
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
