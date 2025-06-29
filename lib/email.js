import nodemailer from 'nodemailer';

// Validate email configuration
const validateEmailConfig = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration missing: EMAIL_USER and EMAIL_PASS must be set');
  }
};

// Create transporter with error handling
const createTransporter = () => {
  try {
    validateEmailConfig();
    
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    throw error;
  }
};

// Email templates
export const emailTemplates = {
  orderConfirmation: (orderData) => ({
    subject: `Order Confirmation - Order #${orderData._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6600, #ff8533); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Clicks & Types</h1>
          <p style="margin: 5px 0 0 0; font-size: 16px;">Order Confirmation</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Thank you for your order!</h2>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #ff6600; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${orderData._id}</p>
            <p><strong>Order Date:</strong> ${new Date(orderData.date).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₱${orderData.amount}</p>
            <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
            <p><strong>Status:</strong> <span style="color: #ff6600; font-weight: bold;">${orderData.status}</span></p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #ff6600; margin-top: 0;">Order Items</h3>
            ${orderData.items.map(item => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p style="margin: 0; font-weight: bold;">${item.product?.name || 'Product'}</p>
                <p style="margin: 5px 0; color: #666;">Quantity: ${item.quantity}</p>
                <p style="margin: 5px 0; color: #666;">Price: ₱${item.product?.offerPrice || 0}</p>
              </div>
            `).join('')}
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #ff6600; margin-top: 0;">Delivery Address</h3>
            <p style="margin: 0;">${orderData.address?.fullName || ''}</p>
            <p style="margin: 5px 0;">${orderData.address?.area || ''}, ${orderData.address?.city || ''}</p>
            <p style="margin: 5px 0;">${orderData.address?.state || ''} - ${orderData.address?.pincode || ''}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-orders" style="background: #ff6600; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Track Your Order
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            <p>If you have any questions, please contact us at clics&types@gmail.com</p>
            <p>Thank you for choosing Clicks & Types!</p>
          </div>
        </div>
      </div>
    `
  }),

  orderApproved: (orderData) => ({
    subject: `Order Approved - Order #${orderData._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745, #34ce57); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Clicks & Types</h1>
          <p style="margin: 5px 0 0 0; font-size: 16px;">Order Approved</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Great news! Your order has been approved!</h2>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #28a745; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${orderData._id}</p>
            <p><strong>Order Date:</strong> ${new Date(orderData.date).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₱${orderData.amount}</p>
            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">${orderData.status}</span></p>
            ${orderData.trackingNumber ? `<p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>` : ''}
            ${orderData.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(orderData.estimatedDelivery).toLocaleDateString()}</p>` : ''}
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">What's Next?</h3>
            <p style="margin: 0;">Your order is now being processed and will be shipped soon. You'll receive tracking updates as your package makes its way to you.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/track-order?orderId=${orderData._id}" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Track Your Order
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            <p>If you have any questions, please contact us at clics&types@gmail.com</p>
            <p>Thank you for choosing Clicks & Types!</p>
          </div>
        </div>
      </div>
    `
  }),

  orderShipped: (orderData) => ({
    subject: `Order Shipped - Order #${orderData._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Clicks & Types</h1>
          <p style="margin: 5px 0 0 0; font-size: 16px;">Order Shipped</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Your order is on its way! 🚚</h2>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #007bff; margin-top: 0;">Shipping Details</h3>
            <p><strong>Order ID:</strong> ${orderData._id}</p>
            ${orderData.trackingNumber ? `<p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>` : ''}
            ${orderData.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(orderData.estimatedDelivery).toLocaleDateString()}</p>` : ''}
            <p><strong>Status:</strong> <span style="color: #007bff; font-weight: bold;">${orderData.status}</span></p>
          </div>
          
          <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">Track Your Package</h3>
            <p style="margin: 0;">Use the tracking number above to monitor your package's journey to your doorstep.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/track-order?orderId=${orderData._id}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Track Your Order
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            <p>If you have any questions, please contact us at clics&types@gmail.com</p>
            <p>Thank you for choosing Clicks & Types!</p>
          </div>
        </div>
      </div>
    `
  })
};

// Send email function
export const sendEmail = async (to, template, data) => {
  try {
    // Validate inputs
    if (!to || !template || !data) {
      throw new Error('Missing required parameters: to, template, data');
    }

    if (!emailTemplates[template]) {
      throw new Error(`Email template '${template}' not found`);
    }

    const emailContent = emailTemplates[template](data);
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}; 