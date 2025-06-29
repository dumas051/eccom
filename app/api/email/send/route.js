import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { to, template, data } = await request.json();
    
    if (!to || !template || !data) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields: to, template, data" 
      });
    }

    const result = await sendEmail(to, template, data);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Email sent successfully",
        messageId: result.messageId
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Failed to send email",
        error: result.error
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    });
  }
} 