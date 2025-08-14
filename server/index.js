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
  if (process.env.SMTP_HOST && !process.env.ALLOW_EMAIL_FALLBACK) {
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
  <style>body{font-family:Inter,Segoe UI,Arial,sans-serif;background:#fff;color:#0f172a;margin:0}.wrap{max-width:640px;margin:0 auto;padding:24px}.card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}.hdr{display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#00f5ff 0%,#1e90ff 50%,#20b2aa 100%);padding:20px 24px}.hdr h1{margin:0;color:#0b1220;font-size:20px}.content{padding:24px}.grid{display:grid;grid-template-columns:140px 1fr;gap:12px 16px;margin:0 0 16px}.label{color:#0ea5e9;font-weight:600}.msg{background:#f8fafc;border-left:4px solid #1e40af;border-radius:8px;padding:12px 16px;white-space:pre-wrap}.foot{padding:16px 24px;color:#475569;border-top:1px solid #e2e8f0;font-size:12px}</style></head>
  <body><div class="wrap"><div class="card"><div class="hdr"><h1>New Contact Form Submission</h1></div><div class="content"><div class="grid"><div class="label">Name</div><div>${fullName}</div><div class="label">Email</div><div><a href="mailto:${s.email}">${s.email}</a></div>${s.phone?`<div class="label">Phone</div><div>${s.phone}</div>`:''}${s.subject?`<div class="label">Subject</div><div>${s.subject}</div>`:''}${s.inquiryType?`<div class="label">Inquiry Type</div><div>${s.inquiryType}</div>`:''}</div><div class="msg">${s.message}</div></div><div class="foot">Submitted: ${escapeHtml(new Date().toLocaleString())}</div></div></div></body></html>`;
}

function buildHealthCheckHtml(formData) {
  const s = {};
  Object.keys(formData).forEach(key => {
    s[key] = escapeHtml(formData[key] || '');
  });
  
  return `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Business Health Check</title>
  <style>body{font-family:Inter,Segoe UI,Arial,sans-serif;background:#fff;color:#0f172a;margin:0}.wrap{max-width:640px;margin:0 auto;padding:24px}.card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}.hdr{display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#00f5ff 0%,#1e90ff 50%,#20b2aa 100%);padding:20px 24px}.hdr h1{margin:0;color:#0b1220;font-size:20px}.content{padding:24px}.section{margin-bottom:24px}.section-title{color:#0ea5e9;font-weight:600;font-size:16px;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:8px}.grid{display:grid;grid-template-columns:140px 1fr;gap:8px 16px;margin-bottom:16px}.label{color:#64748b;font-weight:500}.value{color:#0f172a}.foot{padding:16px 24px;color:#475569;border-top:1px solid #e2e8f0;font-size:12px}</style></head>
  <body><div class="wrap"><div class="card"><div class="hdr"><h1>Business Health Check Submission</h1></div><div class="content">
  <div class="section"><div class="section-title">Company Information</div><div class="grid">
  <div class="label">Company Name</div><div class="value">${s.companyName}</div>
  <div class="label">Industry</div><div class="value">${s.industry}</div>
  <div class="label">Entity Type</div><div class="value">${s.entityType}</div>
  <div class="label">Annual Revenue</div><div class="value">${s.annualRevenue}</div>
  </div></div>
  <div class="section"><div class="section-title">Operations</div><div class="grid">
  <div class="label">Employees</div><div class="value">${s.employees}</div>
  ${s.employeeCount ? `<div class="label">Employee Count</div><div class="value">${s.employeeCount}</div>` : ''}
  <div class="label">Stock Management</div><div class="value">${s.stockManagement}</div>
  <div class="label">Foreign Currency</div><div class="value">${s.foreignCurrency}</div>
  </div></div>
  <div class="section"><div class="section-title">Compliance</div><div class="grid">
  <div class="label">Tax Compliance</div><div class="value">${s.taxCompliance}</div>
  <div class="label">Audit Requirements</div><div class="value">${s.auditRequirements}</div>
  <div class="label">Regulatory Reporting</div><div class="value">${s.regulatoryReporting}</div>
  </div></div>
  <div class="section"><div class="section-title">Goals & Contact</div><div class="grid">
  <div class="label">Primary Goal</div><div class="value">${s.primaryGoal}</div>
  <div class="label">Contact Name</div><div class="value">${s.contactName}</div>
  <div class="label">Email</div><div class="value"><a href="mailto:${s.email}">${s.email}</a></div>
  <div class="label">Phone</div><div class="value">${s.phone}</div>
  </div></div>
  ${s.challenges ? `<div class="section"><div class="section-title">Challenges</div><div style="background:#f8fafc;border-left:4px solid #1e40af;border-radius:8px;padding:12px 16px;white-space:pre-wrap">${s.challenges}</div></div>` : ''}
  </div><div class="foot">Submitted: ${escapeHtml(new Date().toLocaleString())}</div></div></div></body></html>`;
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