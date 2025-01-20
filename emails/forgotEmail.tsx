
interface forgotEmailProps {
    username: string;
    otp: string;
  }
  
  export default function forgotEmail({ username, otp }: forgotEmailProps): string { 
    const htmlString = `<!DOCTYPE html>
  <html lang="en" dir="ltr">
  <head>
  <title>Forgot Password Code</title>
  <style>
    body {
      font-family: 'Roboto', Verdana, sans-serif;
    }
  </style>
  </head>
  <body>
  <div style="padding: 20px;">
    <h2>Hello ${username},</h2>
    <p>Otp to reset your password is:</p>
    <p style="font-size: 20px; font-weight: bold;">${otp}</p>
    <p>If you did not request this code, please ignore this email.</p>
  </div>
  </body>
  </html>`;
  return htmlString;
  }