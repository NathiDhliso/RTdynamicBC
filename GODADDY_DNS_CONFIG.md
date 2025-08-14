# GoDaddy DNS Configuration Guide

## RT Dynamic Business Consulting Domain Setup

### Overview
This guide provides the DNS configuration needed for your GoDaddy domain to work with your website hosting and email services.

---

## 🌐 Website Hosting DNS Records

### For Digital Ocean App Platform

If hosting on Digital Ocean App Platform:

**A Records:**
```
Type: A
Name: @
Value: [Your Digital Ocean App IP]
TTL: 600

Type: A
Name: www
Value: [Your Digital Ocean App IP]
TTL: 600
```

**CNAME Record (Alternative):**
```
Type: CNAME
Name: @
Value: [your-app-name].ondigitalocean.app
TTL: 600

Type: CNAME
Name: www
Value: [your-app-name].ondigitalocean.app
TTL: 600
```

### For Vercel Hosting

If hosting on Vercel:

**A Records:**
```
Type: A
Name: @
Value: 76.76.19.61
TTL: 600

Type: A
Name: www
Value: 76.76.19.61
TTL: 600
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600
```

---

## 📧 Email DNS Records (PrivateEmail)

### MX Records (Mail Exchange)
```
Type: MX
Name: @
Value: mail.privateemail.com
Priority: 10
TTL: 3600
```

### CNAME Records for Email
```
Type: CNAME
Name: mail
Value: mail.privateemail.com
TTL: 3600

Type: CNAME
Name: webmail
Value: mail.privateemail.com
TTL: 3600
```

### TXT Records for Email Authentication

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:spf.privateemail.com ~all
TTL: 3600
```

**DKIM Record:**
```
Type: TXT
Name: default._domainkey
Value: [DKIM key provided by PrivateEmail]
TTL: 3600
```

**DMARC Record:**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:contact@rtdynamicbc.co.za
TTL: 3600
```

---

## 🔧 Step-by-Step GoDaddy Configuration

### 1. Access DNS Management
1. Log into your GoDaddy account
2. Go to "My Products"
3. Find your domain and click "DNS"
4. Click "Manage DNS"

### 2. Add Website Records

**For Digital Ocean:**
1. Click "Add" button
2. Select "A" record type
3. Enter "@" in Name field
4. Enter your Digital Ocean App IP in Value field
5. Set TTL to 600
6. Save

**Repeat for www subdomain:**
1. Add another A record
2. Enter "www" in Name field
3. Same IP address in Value field

### 3. Add Email Records

**MX Record:**
1. Click "Add" → "MX"
2. Name: "@"
3. Value: "mail.privateemail.com"
4. Priority: 10
5. TTL: 3600

**CNAME Records:**
1. Add CNAME for "mail" → "mail.privateemail.com"
2. Add CNAME for "webmail" → "mail.privateemail.com"

**TXT Records:**
1. Add SPF record with value: `v=spf1 include:spf.privateemail.com ~all`
2. Add DMARC record with value: `v=DMARC1; p=quarantine; rua=mailto:contact@rtdynamicbc.co.za`

### 4. Remove Conflicting Records
- Delete any existing A records pointing to GoDaddy parking
- Remove default MX records if present
- Keep only the records you've added

---

## 📋 Complete DNS Configuration Example

```
# Website Records
A     @     [Your-Server-IP]     600
A     www   [Your-Server-IP]     600

# Email Records
MX    @     mail.privateemail.com     10     3600
CNAME mail  mail.privateemail.com            3600
CNAME webmail mail.privateemail.com          3600

# Email Authentication
TXT   @     v=spf1 include:spf.privateemail.com ~all     3600
TXT   _dmarc v=DMARC1; p=quarantine; rua=mailto:contact@rtdynamicbc.co.za     3600
TXT   default._domainkey [DKIM-Key-From-PrivateEmail]     3600
```

---

## ⚡ Quick Setup for rtdynamicbc.co.za

### Immediate Actions Needed:

1. **Get your hosting IP/CNAME:**
   - Digital Ocean: Check your app dashboard for IP
   - Vercel: Use `cname.vercel-dns.com`

2. **Configure in GoDaddy:**
   ```
   A     @     [Your-Hosting-IP]     600
   A     www   [Your-Hosting-IP]     600
   MX    @     mail.privateemail.com     10     3600
   TXT   @     v=spf1 include:spf.privateemail.com ~all     3600
   ```

3. **Test after 24-48 hours:**
   - Website: `http://rtdynamicbc.co.za`
   - Email: Send test email to `contact@rtdynamicbc.co.za`

---

## 🔍 Verification Tools

### DNS Propagation Check
- **Website:** https://dnschecker.org
- **Email:** https://mxtoolbox.com

### Test Commands
```bash
# Check A record
nslookup rtdynamicbc.co.za

# Check MX record
nslookup -type=MX rtdynamicbc.co.za

# Check SPF record
nslookup -type=TXT rtdynamicbc.co.za
```

---

## 🚨 Important Notes

1. **Propagation Time:** DNS changes take 24-48 hours to fully propagate
2. **TTL Values:** Lower TTL (600) for faster updates during setup
3. **Backup:** Screenshot current DNS settings before making changes
4. **Email Downtime:** Expect brief email interruption during MX record changes
5. **SSL Certificate:** May need to regenerate after DNS changes

---

## 📞 Support Contacts

- **GoDaddy Support:** 1-480-505-8877
- **PrivateEmail Support:** Through GoDaddy account
- **Digital Ocean Support:** Through DO dashboard

---

## ✅ Post-Configuration Checklist

- [ ] Website loads at rtdynamicbc.co.za
- [ ] Website loads at www.rtdynamicbc.co.za
- [ ] Email sending works from contact forms
- [ ] Email receiving works at contact@rtdynamicbc.co.za
- [ ] SSL certificate is active
- [ ] All DNS records propagated (check with dnschecker.org)

---

**Last Updated:** August 2025  
**Domain:** rtdynamicbc.co.za  
**Email Provider:** PrivateEmail (GoDaddy)  
**Hosting:** Digital Ocean App Platform / Vercel