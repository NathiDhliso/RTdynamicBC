# SMTP Setup Guide for RT Dynamic Business Consulting

## Current Configuration Status

✅ **Email Server**: Successfully configured and running on port 3001  
✅ **Contact Form**: Working with test email service  
✅ **Business Health Check Form**: Working with test email service  
⚠️ **Production SMTP**: Requires authentication troubleshooting  

## SMTP Configuration

Your Digital Ocean environment variables have been configured in `server/env.local`:

```ini
PORT=3001
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@rtdynamicbc.co.za
SMTP_PASS=RabeTshepi@1
MAIL_FROM=contact@rtdynamicbc.co.za
MAIL_TO=contact@rtdynamicbc.co.za
ALLOW_EMAIL_FALLBACK=true
```

## Authentication Issue Encountered

During testing, the SMTP authentication failed with error:
```
535 5.7.8 Error: authentication failed: (reason unavailable)
```

### Possible Solutions

1. **Verify Email Account Settings**
   - Ensure the email account `contact@rtdynamicbc.co.za` exists
   - Verify the password `RabeTshepi@1` is correct
   - Check if the account is active and not suspended

2. **Enable SMTP Access**
   - Log into your email provider's control panel
   - Enable SMTP/IMAP access for the account
   - Some providers require enabling "Less Secure Apps" or "App Passwords"

3. **Alternative SMTP Settings**
   Try these alternative configurations:
   
   **Option A: SSL/TLS (Port 465)**
   ```ini
   SMTP_PORT=465
   SMTP_SECURE=true
   ```
   
   **Option B: Different Authentication**
   - Check if your email provider requires app-specific passwords
   - Some providers use different authentication methods

4. **Firewall/Network Issues**
   - Ensure port 587 is not blocked by firewall
   - Check if your hosting provider blocks SMTP ports
   - Try using port 25 or 2525 if available

## Current Fallback Configuration

The system is currently configured to use **Ethereal Email** (a test email service) when `ALLOW_EMAIL_FALLBACK=true`. This allows:

- ✅ Testing email functionality
- ✅ Viewing sent emails at preview URLs
- ✅ Ensuring forms work correctly

**Test Results:**
- Contact form: ✅ Working
- Business health check: ✅ Working
- Preview URLs provided for email verification

## Production Deployment Steps

### Step 1: Fix SMTP Authentication
1. Contact your email provider (Namecheap/PrivateEmail) support
2. Verify account credentials and SMTP settings
3. Request app-specific password if needed
4. Test authentication manually

### Step 2: Update Configuration
Once SMTP is working, update `server/env.local`:
```ini
ALLOW_EMAIL_FALLBACK=false
```

### Step 3: Test Production SMTP
```bash
# Restart server
npm run server

# Test contact form
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","message":"Test"}'
```

### Step 4: Deploy to Digital Ocean
Set environment variables in Digital Ocean:
```bash
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@rtdynamicbc.co.za
SMTP_PASS=RabeTshepi@1
MAIL_FROM=contact@rtdynamicbc.co.za
MAIL_TO=contact@rtdynamicbc.co.za
ALLOW_EMAIL_FALLBACK=false
```

## API Endpoints

### Health Check
```
GET /api/health
Response: {"ok": true}
```

### Contact Form
```
POST /api/contact
Body: {
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "phone": "string" (optional),
  "subject": "string" (optional),
  "inquiryType": "string" (optional),
  "message": "string"
}
```

### Business Health Check
```
POST /api/business-health-check
Body: {
  "companyName": "string",
  "industry": "string",
  "entityType": "string",
  "annualRevenue": "string",
  "employees": "string",
  "contactName": "string",
  "email": "string",
  "phone": "string",
  // ... other fields
}
```

## Troubleshooting

### Common SMTP Issues

1. **Authentication Failed**
   - Double-check username/password
   - Try app-specific password
   - Enable SMTP in email account settings

2. **Connection Timeout**
   - Check firewall settings
   - Try different ports (25, 465, 587, 2525)
   - Verify SMTP host address

3. **TLS/SSL Issues**
   - Try `SMTP_SECURE=true` with port 465
   - Try `SMTP_SECURE=false` with port 587

### Testing Commands

```bash
# Start server
cd server && npm start

# Test health
curl http://localhost:3001/api/health

# Test contact form
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","message":"Test message"}'
```

## Next Steps

1. **Immediate**: System is working with test emails
2. **Short-term**: Resolve SMTP authentication with email provider
3. **Production**: Deploy with working SMTP configuration
4. **Monitoring**: Set up email delivery monitoring

## Support Contacts

- **Email Provider**: Namecheap/PrivateEmail Support
- **SMTP Issues**: Check provider documentation
- **Server Issues**: Check server logs for detailed error messages

---

**Status**: ✅ Email functionality working with test service  
**Next Action**: Resolve SMTP authentication for production use