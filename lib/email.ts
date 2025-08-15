/**
 * Email utility functions for sending contact and business health check forms
 */

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject?: string;
  inquiryType?: string;
  message: string;
}

export interface BusinessHealthCheckData {
  // Company Information
  companyName: string;
  industry: string;
  entityType: string;
  annualRevenue: string;
  
  // Operations
  employees: string;
  employeeCount?: string;
  stockManagement: string;
  foreignCurrency: string;
  
  // Compliance
  taxCompliance: string;
  auditRequirements: string;
  regulatoryReporting: string;
  
  // Goals & Contact
  primaryGoal: string;
  challenges?: string;
  contactName: string;
  email: string;
  phone: string;
}

/**
 * Send contact form data to the server
 */
export async function sendContactForm(data: ContactFormData): Promise<boolean> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      console.error('Contact form submission failed:', response.statusText);
      return false;
    }
    
    const result = await response.json();
    return Boolean(result?.ok);
  } catch (error) {
    console.error('Error sending contact form:', error);
    return false;
  }
}

/**
 * Send business health check form data to the server
 */
export async function sendBusinessHealthCheck(data: BusinessHealthCheckData): Promise<boolean> {
  try {
    const response = await fetch('/api/business-health-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      console.error('Business health check submission failed:', response.status, response.statusText);
      // Return a more user-friendly error message based on status
      throw new Error(response.status === 404 ? 'Service temporarily unavailable' : 'Unable to submit. Please try again.');
    }
    
    const result = await response.json();
    return Boolean(result?.ok);
  } catch (error) {
    console.error('Error sending business health check:', error);
    return false;
  }
}

/**
 * Test server health endpoint
 */
export async function testServerHealth(): Promise<boolean> {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) return false;
    
    const result = await response.json();
    return Boolean(result?.ok);
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
}