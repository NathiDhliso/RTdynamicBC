import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load local envs if present (dev)
dotenv.config({ path: path.resolve(__dirname, 'env.local') });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function getTransporter() {
  if (process.env.SMTP_HOST && process.env.ALLOW_EMAIL_FALLBACK !== 'true') {
    console.log('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      user: process.env.SMTP_USER,
      hasPassword: !!process.env.SMTP_PASS
    });
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
      logger: true,
      debug: true,
    });
  }
  // Dev fallback: Ethereal test inbox
  console.log('Using Ethereal Email fallback for testing...');
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
    // logger: true, debug: true,
  });
}

function escapeHtml(v) {
  if (v == null) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildContactHtml({ firstName, lastName, email, phone, subject, inquiryType, message }) {
  const s = {
    firstName: escapeHtml(firstName),
    lastName: escapeHtml(lastName),
    email: escapeHtml(email),
    phone: escapeHtml(phone || ''),
    subject: escapeHtml(subject || ''),
    inquiryType: escapeHtml(inquiryType || ''),
    message: escapeHtml(message || ''),
  };
  const fullName = `${s.firstName} ${s.lastName}`.trim();
  
  return `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>New Contact</title>
  <style>
    body{font-family:Inter,Segoe UI,Arial,sans-serif;background:#f8fafc;color:#0f172a;margin:0;padding:0}
    .container{width:100%;max-width:100%;margin:0;padding:20px;box-sizing:border-box}
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)}
    .header{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#00f5ff 0%,#1e90ff 50%,#20b2aa 100%);padding:24px;color:#fff}
    .logo{width:60px;height:60px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#1e40af;font-size:18px}
    .header-text{flex:1;margin-left:20px}
    .header h1{margin:0;font-size:24px;font-weight:600}
    .header p{margin:5px 0 0 0;opacity:0.9;font-size:14px}
    .content{padding:32px}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:24px}
    .field{background:#f8fafc;padding:16px;border-radius:8px;border-left:4px solid #0ea5e9}
    .label{color:#0ea5e9;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px}
    .value{color:#0f172a;font-size:16px;font-weight:500}
    .message-section{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-top:24px}
    .message-title{color:#1e40af;font-weight:600;font-size:16px;margin-bottom:12px}
    .message-content{color:#374151;line-height:1.6;white-space:pre-wrap}
    .footer{padding:24px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;color:#6b7280;font-size:12px}
    @media (max-width:600px){.grid{grid-template-columns:1fr}.content{padding:20px}}
  </style></head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <div class="logo">RT</div>
          <div class="header-text">
            <h1>New Contact Form Submission</h1>
            <p>RT Dynamic Business Consulting</p>
          </div>
        </div>
        <div class="content">
          <div class="grid">
            <div class="field">
              <div class="label">Full Name</div>
              <div class="value">${fullName}</div>
            </div>
            <div class="field">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${s.email}" style="color:#0ea5e9;text-decoration:none">${s.email}</a></div>
            </div>
            ${s.phone ? `<div class="field"><div class="label">Phone Number</div><div class="value">${s.phone}</div></div>` : ''}
            ${s.subject ? `<div class="field"><div class="label">Subject</div><div class="value">${s.subject}</div></div>` : ''}
            ${s.inquiryType ? `<div class="field"><div class="label">Inquiry Type</div><div class="value">${s.inquiryType}</div></div>` : ''}
          </div>
          ${s.message ? `<div class="message-section"><div class="message-title">Message</div><div class="message-content">${s.message}</div></div>` : ''}
         </div>
         <div class="footer">
           Submitted: ${escapeHtml(new Date().toLocaleString())} | RT Dynamic Business Consulting
         </div>
      </div>
    </div>
  </body></html>`;
}

function buildHealthCheckHtml(formData) {
  const s = {};
  Object.keys(formData).forEach(key => {
    s[key] = escapeHtml(formData[key] || '');
  });
  
  return `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Business Health Check</title>
  <style>
    body{font-family:Inter,Segoe UI,Arial,sans-serif;background:#f8fafc;color:#0f172a;margin:0;padding:0}
    .container{width:100%;max-width:100%;margin:0;padding:20px;box-sizing:border-box}
    .card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)}
    .header{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#00f5ff 0%,#1e90ff 50%,#20b2aa 100%);padding:24px;color:#fff}
    .logo{width:60px;height:60px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#1e40af;font-size:18px}
    .header-text{flex:1;margin-left:20px}
    .header h1{margin:0;font-size:24px;font-weight:600}
    .header p{margin:5px 0 0 0;opacity:0.9;font-size:14px}
    .content{padding:32px}
    .section{margin-bottom:32px}
    .section-title{color:#1e40af;font-weight:600;font-size:18px;margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid #0ea5e9}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-bottom:20px}
    .field{background:#f8fafc;padding:16px;border-radius:8px;border-left:4px solid #0ea5e9}
    .label{color:#0ea5e9;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px}
    .value{color:#0f172a;font-size:16px;font-weight:500}
    .challenges-section{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-top:24px}
    .challenges-title{color:#1e40af;font-weight:600;font-size:16px;margin-bottom:12px}
    .challenges-content{color:#374151;line-height:1.6;white-space:pre-wrap}
    .footer{padding:24px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;color:#6b7280;font-size:12px}
    @media (max-width:768px){.grid{grid-template-columns:1fr}.content{padding:20px}}
  </style></head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <div class="logo">RT</div>
          <div class="header-text">
            <h1>Business Health Check Submission</h1>
            <p>RT Dynamic Business Consulting</p>
          </div>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">Company Information</div>
            <div class="grid">
              <div class="field">
                <div class="label">Company Name</div>
                <div class="value">${s.companyName}</div>
              </div>
              <div class="field">
                <div class="label">Industry</div>
                <div class="value">${s.industry}</div>
              </div>
              <div class="field">
                <div class="label">Entity Type</div>
                <div class="value">${s.entityType}</div>
              </div>
              <div class="field">
                <div class="label">Annual Revenue</div>
                <div class="value">${s.annualRevenue}</div>
              </div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Operations</div>
            <div class="grid">
              <div class="field">
                <div class="label">Employees</div>
                <div class="value">${s.employees}</div>
              </div>
              ${s.employeeCount ? `<div class="field"><div class="label">Employee Count</div><div class="value">${s.employeeCount}</div></div>` : ''}
              <div class="field">
                <div class="label">Stock Management</div>
                <div class="value">${s.stockManagement}</div>
              </div>
              <div class="field">
                <div class="label">Foreign Currency</div>
                <div class="value">${s.foreignCurrency}</div>
              </div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Compliance</div>
            <div class="grid">
              <div class="field">
                <div class="label">Tax Compliance</div>
                <div class="value">${s.taxCompliance}</div>
              </div>
              <div class="field">
                <div class="label">Audit Requirements</div>
                <div class="value">${s.auditRequirements}</div>
              </div>
              <div class="field">
                <div class="label">Regulatory Reporting</div>
                <div class="value">${s.regulatoryReporting}</div>
              </div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Goals & Contact</div>
            <div class="grid">
              <div class="field">
                <div class="label">Primary Goal</div>
                <div class="value">${s.primaryGoal}</div>
              </div>
              <div class="field">
                <div class="label">Contact Name</div>
                <div class="value">${s.contactName}</div>
              </div>
              <div class="field">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${s.email}" style="color:#0ea5e9;text-decoration:none">${s.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Phone Number</div>
                <div class="value">${s.phone}</div>
              </div>
            </div>
          </div>
          ${s.challenges ? `<div class="challenges-section"><div class="challenges-title">Business Challenges</div><div class="challenges-content">${s.challenges}</div></div>` : ''}
         </div>
         <div class="footer">
           Submitted: ${escapeHtml(new Date().toLocaleString())} | RT Dynamic Business Consulting
         </div>
      </div>
    </div>
  </body></html>`;
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, phone, subject, inquiryType, message } = req.body || {};
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }
  
  try {
    const transporter = await getTransporter();
    const html = buildContactHtml({ firstName, lastName, email, phone, subject, inquiryType, message });
    const fullName = `${firstName} ${lastName}`.trim();
    
    const text = [
      'New Contact Form Submission',
      `Name: ${fullName}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : undefined,
      subject ? `Subject: ${subject}` : undefined,
      inquiryType ? `Inquiry Type: ${inquiryType}` : undefined,
      '',
      'Message:',
      message || '',
      '',
      `Submitted: ${new Date().toLocaleString()}`,
    ].filter(Boolean).join('\n');

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || 'contact@rtdynamicbc.co.za',
      to: process.env.MAIL_TO || 'contact@rtdynamicbc.co.za',
      subject: `New contact from ${fullName}`,
      text,
      html,
      replyTo: email,
    });

    res.json({ ok: true, previewUrl: nodemailer.getTestMessageUrl?.(info) });
  } catch (e) {
    console.error('sendMail error', e);
    res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
});

app.post('/api/business-health-check', async (req, res) => {
  const formData = req.body || {};
  const { contactName, email } = formData;
  
  if (!contactName || !email) {
    return res.status(400).json({ ok: false, error: 'Missing required contact information' });
  }
  
  try {
    const transporter = await getTransporter();
    const html = buildHealthCheckHtml(formData);
    
    const text = [
      'Business Health Check Submission',
      `Contact: ${contactName}`,
      `Email: ${email}`,
      `Company: ${formData.companyName || 'N/A'}`,
      `Industry: ${formData.industry || 'N/A'}`,
      `Revenue: ${formData.annualRevenue || 'N/A'}`,
      '',
      `Submitted: ${new Date().toLocaleString()}`,
    ].filter(Boolean).join('\n');

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || 'contact@rtdynamicbc.co.za',
      to: process.env.MAIL_TO || 'contact@rtdynamicbc.co.za',
      subject: `Business Health Check - ${formData.companyName || contactName}`,
      text,
      html,
      replyTo: email,
    });

    res.json({ ok: true, previewUrl: nodemailer.getTestMessageUrl?.(info) });
  } catch (e) {
    console.error('sendMail error', e);
    res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));