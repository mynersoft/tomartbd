import nodemailer from 'nodemailer';

// Rate limiting storage (in production, use Redis or similar)
const rateLimit = new Map();

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    // Simple rate limiting
    const requests = rateLimit.get(ip) || [];
    const recentRequests = requests.filter(time => now - time < 15 * 60 * 1000); // 15 minutes
    
    if (recentRequests.length >= 5) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Too many requests. Please try again later.'
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Add current request
    requests.push(now);
    rateLimit.set(ip, requests.slice(-10)); // Keep only last 10 requests
    
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please provide all required fields'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please provide a valid email address'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify transporter connection
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('Email transporter verification failed:', verifyError);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email service configuration error. Please contact administrator.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Email content for admin
    const adminMailOptions = {
      from: `"Website Contact" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; font-weight: bold; width: 120px; color: #475569;">Name:</td>
                <td style="padding: 10px; color: #1e293b;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #475569;">Email:</td>
                <td style="padding: 10px; color: #1e293b;">
                  <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">
                    ${email}
                  </a>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #475569;">Phone:</td>
                <td style="padding: 10px; color: #1e293b;">
                  <a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">
                    ${phone}
                  </a>
                </td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #475569;">Subject:</td>
                <td style="padding: 10px; color: #1e293b;">${subject || 'General Inquiry'}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #475569; margin-top: 0;">Message:</h3>
            <div style="color: #334155; line-height: 1.6; white-space: pre-wrap;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
            <p>This email was sent from your website contact form.</p>
            <p>Time: ${new Date().toLocaleString()}</p>
            <p>IP Address: ${ip}</p>
          </div>
        </div>
      `,
      text: `
        NEW CONTACT FORM SUBMISSION
        ===========================
        
        Name: ${name}
        Email: ${email}
        ${phone ? `Phone: ${phone}` : ''}
        Subject: ${subject || 'General Inquiry'}
        
        Message:
        ${message}
        
        ---------------------------
        Sent from website contact form
        Time: ${new Date().toLocaleString()}
        IP Address: ${ip}
      `,
    };

    // Auto-reply to user
    const userMailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Your Company'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting us!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px 0;">
            <h1 style="color: #2563eb; margin: 0;">Thank You!</h1>
            <p style="color: #64748b; font-size: 18px;">We've received your message</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #475569; line-height: 1.6;">
              Hi ${name},
            </p>
            
            <p style="color: #475569; line-height: 1.6;">
              Thank you for reaching out to us. We have received your message and one of our team members will get back to you within 24 hours.
            </p>
            
            <div style="background-color: #e0f2fe; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
              <p style="margin: 0; color: #0369a1;">
                <strong>Your inquiry reference:</strong> CONTACT-${Date.now().toString().slice(-8)}
              </p>
            </div>
            
            <p style="color: #475569; line-height: 1.6;">
              <strong>What's next?</strong><br>
              1. Our team will review your message<br>
              2. We'll respond via email or phone<br>
              3. We'll work with you to address your inquiry
            </p>
            
            <p style="color: #475569; line-height: 1.6;">
              If you need immediate assistance, please feel free to call us at +1 (555) 123-4567.
            </p>
            
            <p style="color: #475569; line-height: 1.6;">
              Best regards,<br>
              <strong>The Your Company Team</strong>
            </p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #f1f5f9; border-radius: 8px; text-align: center;">
            <h3 style="color: #475569; margin-top: 0;">Need help sooner?</h3>
            <p style="color: #64748b;">
              Visit our <a href="https://yourcompany.com/help" style="color: #2563eb; text-decoration: none;">Help Center</a> or 
              check our <a href="https://yourcompany.com/faq" style="color: #2563eb; text-decoration: none;">FAQ</a>
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; text-align: center;">
            <p>This is an automated response. Please do not reply to this email.</p>
            <p>Your Company Name • 123 Business Street • New York, NY 10001</p>
            <p>
              <a href="https://yourcompany.com" style="color: #2563eb; text-decoration: none;">Website</a> • 
              <a href="https://yourcompany.com/privacy" style="color: #2563eb; text-decoration: none;">Privacy Policy</a>
            </p>
          </div>
        </div>
      `,
      text: `
        THANK YOU FOR CONTACTING US!
        =============================
        
        Hi ${name},
        
        Thank you for reaching out to us. We have received your message and one of our team members will get back to you within 24 hours.
        
        Your inquiry reference: CONTACT-${Date.now().toString().slice(-8)}
        
        What's next?
        1. Our team will review your message
        2. We'll respond via email or phone
        3. We'll work with you to address your inquiry
        
        If you need immediate assistance, please feel free to call us at +1 (555) 123-4567.
        
        Best regards,
        The Your Company Team
        
        ---------------------------
        
        Need help sooner?
        Visit our Help Center: https://yourcompany.com/help
        Check our FAQ: https://yourcompany.com/faq
        
        ---------------------------
        
        This is an automated response. Please do not reply to this email.
        Your Company Name • 123 Business Street • New York, NY 10001
        Website: https://yourcompany.com
        Privacy Policy: https://yourcompany.com/privacy
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    // Clean up old rate limit entries
    setTimeout(() => {
      for (const [key, times] of rateLimit.entries()) {
        const filtered = times.filter(time => Date.now() - time < 30 * 60 * 1000); // 30 minutes
        if (filtered.length === 0) {
          rateLimit.delete(key);
        } else {
          rateLimit.set(key, filtered);
        }
      }
    }, 60000); // Run every minute

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Something went wrong. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// OPTIONAL: Test endpoint (useful for debugging)
export async function GET(request) {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Contact API is working',
      endpoints: {
        POST: '/api/contact - Submit contact form',
      },
      environment: process.env.NODE_ENV,
      emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}