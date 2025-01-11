import nodemailer from 'nodemailer';
import VerificationEmail from '../../emails/verificationEmail';


export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<any> {
  try {
    
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS,  
      },
    });



    const mailOptions = {
      from: process.env.GMAIL_USER, 
      to: email,
      subject: 'TO-DO App Verification Code',
      html: VerificationEmail({ username: username, otp: verifyCode }),
    };

    
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}