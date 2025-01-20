import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, code, newPassword } = await request.json();

    const decodedEmail = decodeURIComponent(email);
    const user = await UserModel.findOne({ email: decodedEmail });

    if (!user) {
      return Response.json({
        success: false,
        message: "Email not found",
      }, {
        status: 404
      });
    }

    const isCodeValid = user.forgotPasswordCode === code;
    const isCodeNotExpired = new Date() < user.forgotPasswordCodeExpiry;

    if (isCodeValid && isCodeNotExpired) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();

      return Response.json({
        success: true,
        message: "Password reset successfully",
      }, {
        status: 200
      });
    } else if (!isCodeNotExpired) {
      return Response.json({
        success: false,
        message: "Code expired",
      }, {
        status: 400
      });
    } else {
      return Response.json({
        success: false,
        message: "Invalid code",
      }, {
        status: 400
      });
    }
  } catch (error) {
    console.error("Error verifying reset code:", error);
    return Response.json({
      success: false,
      message: "Failed to verify reset code",
    }, {
      status: 500
    });
  }
}