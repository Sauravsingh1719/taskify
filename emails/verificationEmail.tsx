
interface VerificationEmailProps {
    username: string;
    otp: string;
  }
  
  export default function VerificationEmail({ username, otp }: VerificationEmailProps): string { 
    const htmlString = `<!DOCTYPE html>
  <html lang="en" dir="ltr">
  <head>
  <title>Verification Code</title>
  <style>
    body {
      font-family: 'Roboto', Verdana, sans-serif;
      padding: 20px; 
    }
      .email-container {
      border: 2px solid #e0e0e0;
      padding: 20px;
      }
      .logo{
        width:full
        height: auto;
      }
      
  </style>
  </head>
  <body>
  <div style="padding: 20px;" class="email-container">
  <img src="https://res.cloudinary.com/dodghmpuy/image/upload/v1738011729/taskifylogo.png" alt="logo" class="logo" />
    <h2>Hello ${username},</h2>
    <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
    <p style="font-size: 20px; font-weight: bold;">${otp}</p>
    <p>If you did not request this code, please ignore this email.</p>
  </div>
  </body>
  </html>`;
  return htmlString;
  }