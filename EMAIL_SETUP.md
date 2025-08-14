# Email Setup for RT Dynamic Business Consulting

This document explains how to set up and configure the email functionality for the contact form and business health check questionnaire.

## Overview

The application uses a Node.js/Express server with Nodemailer to send emails from both the contact form and business health check questionnaire to `info@rtdynamicbc.co.za  `.

## Setup Instructions

### 1. Install Server Dependencies

```bash
# Install server dependencies
npm run server:install

# Or manually:
cd server
npm install
```

### 2. Configure Email Settings

Edit `server/env.local` with your actual email credentials:

```ini
PORT=3001
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@rtdynamicbc.co.za  
SMTP_PASS=your_actual_password_here
MAIL_FROM=info@rtdynamicbc.co.za  
MAIL_TO=info@rtdynamicbc.co.za  
```

**Important:** Replace `your_actual_password_here` with the actual password for the `info@rtdynamicbc.co.za  ` email account.

### 3. DNS Configuration (if not already set up)

For proper email delivery, ensure these DNS records are configured:

- **SPF Record** (TXT on `@`): `v=spf1 include:spf.privateemail.com ~all`
- **DKIM Record** (TXT on `default._domainkey`): Get value from your email provider
- **DMARC Record** (TXT on `_dmarc`): `v=DMARC1; p=none; rua=mailto:dmarc@rtdynamic.co.za; adkim=s; aspf=s; pct=100`

## Running the Application

### Option 1: Run Both Frontend and Backend Together

```bash
# Install concurrently if not already installed
npm install

# Run both frontend and backend
npm run dev:full
```

### Option 2: Run Separately

```bash
# Terminal 1: Start the email server
npm run server

# Terminal 2: Start the Next.js frontend
npm run dev
```

## API Endpoints

The server provides these endpoints:

- `GET /api/health` - Health check endpoint
- `POST /api/contact` - Contact form submission
- `POST /api/business-health-check` - Business health check questionnaire submission

## Testing

### Test Server Health

```bash
curl http://localhost:3001/api/health
```

### Test Contact Form (Example)

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+27123456789",
    "subject": "Test Subject",
    "inquiryType": "General Information",
    "message": "This is a test message"
  }'
```

## Email Templates

### Contact Form Email

Includes:
- Contact person's name and details
- Subject and inquiry type
- Message content
- Submission timestamp

### Business Health Check Email

Includes:
- Company information (name, industry, entity type, revenue)
- Operational details (employees, stock management, foreign currency)
- Compliance information (tax, audit, regulatory)
- Goals and challenges
- Contact information
- Submission timestamp

## Troubleshooting

### Common Issues

1. **SMTP Authentication Failed**
   - Verify email credentials in `server/env.local`
   - Check if the email account allows SMTP access
   - Ensure the password is correct

2. **Connection Refused**
   - Check if the server is running on port 3001
   - Verify firewall settings
   - Ensure the SMTP host and port are correct

3. **Emails Not Received**
   - Check spam/junk folders
   - Verify DNS records (SPF, DKIM, DMARC)
   - Test with a different email provider

### Development Mode

In development, if SMTP credentials are not provided, the server will use Ethereal Email (a test email service) and log preview URLs to the console.

## Security Notes

- Never commit the `server/env.local` file with real credentials
- Use environment variables in production
- Consider using app-specific passwords if available
- Regularly rotate email passwords

## Production Deployment

For production deployment:

1. Set environment variables instead of using `env.local`
2. Use a process manager like PM2 for the server
3. Set up proper logging and monitoring
4. Consider using a dedicated email service like SendGrid or AWS SES for better deliverability