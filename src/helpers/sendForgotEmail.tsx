import nodemailer from 'nodemailer';
import forgotEmail from '../../emails/forgotEmail';


export async function sendForgotEmail(
  email: string,
  forgotPasswordCode: string
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
      subject: 'Taskify Code for password reseting',
      html: forgotEmail({ email: email, otp: forgotPasswordCode }),
    };

    
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Forgot password code sent successfully.' };
  } catch (emailError) {
    console.error('Error sending Forgot password code email:', emailError);
    return { success: false, message: 'Failed to send Forgot password code email.' };
  }
}