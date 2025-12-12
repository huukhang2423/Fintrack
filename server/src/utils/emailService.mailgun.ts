import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);

// Initialize Mailgun client
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationEmail = async (
  email: string,
  name: string,
  code: string
): Promise<void> => {
  try {
    const domain = process.env.MAILGUN_DOMAIN || '';
    const fromEmail = process.env.MAILGUN_FROM_EMAIL || `noreply@${domain}`;

    const messageData = {
      from: `FinTrack <${fromEmail}>`,
      to: [email],
      subject: 'Xác thực Email - FinTrack',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #4F46E5;
              margin-bottom: 10px;
            }
            .verification-code {
              background-color: #4F46E5;
              color: white;
              font-size: 36px;
              font-weight: bold;
              text-align: center;
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
              letter-spacing: 8px;
            }
            .message {
              text-align: center;
              margin: 20px 0;
              color: #666;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #999;
            }
            .warning {
              background-color: #FEF3C7;
              border-left: 4px solid #F59E0B;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎯 FinTrack</div>
              <h2>Xác thực Email của bạn</h2>
            </div>

            <p>Xin chào <strong>${name}</strong>,</p>

            <p>Cảm ơn bạn đã đăng ký tài khoản FinTrack! Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã xác thực bên dưới:</p>

            <div class="verification-code">${code}</div>

            <p class="message">Mã xác thực này sẽ hết hạn sau <strong>10 phút</strong>.</p>

            <div class="warning">
              <strong>⚠️ Lưu ý bảo mật:</strong>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Không chia sẻ mã này với bất kỳ ai</li>
                <li>FinTrack sẽ không bao giờ yêu cầu mã xác thực qua điện thoại hoặc email</li>
                <li>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này</li>
              </ul>
            </div>

            <p>Nếu bạn gặp bất kỳ vấn đề gì, vui lòng liên hệ với chúng tôi.</p>

            <p>Trân trọng,<br><strong>Đội ngũ FinTrack</strong></p>

            <div class="footer">
              <p>Email này được gửi tự động, vui lòng không trả lời.</p>
              <p>&copy; 2024 FinTrack. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await mg.messages.create(domain, messageData);
    console.log('✅ Email sent successfully via Mailgun to', email);
    console.log('📧 Message ID:', result.id);
  } catch (error: any) {
    console.error('❌ Mailgun error:', error.message || error);
    throw new Error('Failed to send email via Mailgun');
  }
};
