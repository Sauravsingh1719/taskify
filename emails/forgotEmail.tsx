interface ForgotEmailProps {
  email: string;
  otp: string;
}

export default function forgotEmail({ email, otp }: ForgotEmailProps): string {
  const htmlString = `<!DOCTYPE html>
  <html lang="en" dir="ltr">
  <head>
  <title>Forgot Password Code</title>
  <style>
    body {
      font-family: 'Roboto', Verdana, sans-serif;
      padding: 20px;
    }
    .email-container {
      border: 2px solid #e0e0e0;
      padding: 20px;
    }
    .logo {
      width: 100%;
      height: auto;
    }
  </style>
  </head>
  <body>
  <div style="padding: 20px;" class="email-container">
    <img src="https://res.cloudinary.com/dodghmpuy/image/upload/v1738011729/taskifylogo.png" alt="logo" class="logo" />
    <h2>Hello ${email},</h2>
    <p>We received a request to reset your password. Please use the following OTP to reset your password:</p>
    <p style="font-size: 20px; font-weight: bold;">${otp}</p>
    <p>If you did not request this code, please ignore this email.</p>
  </div>
  </body>
  </html>`;
  return htmlString;
}
