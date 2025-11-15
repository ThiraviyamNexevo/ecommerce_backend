✅ Step 1 — Install Nodemailer
npm install nodemailer

✅ Step 2 — Create Email Utility

📄 src/utils/email.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * SEND EMAIL
 * @param {string} to 
 * @param {string} subject 
 * @param {string} html 
 */
exports.sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Ecommerce Store" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("📧 Email Sent To:", to);
};

✅ Step 3 — Add email env variables

📄 .env

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password


⚠️ For Gmail, you must generate an App Password.

✅ Step 4 — Create Order Email Template

📄 src/utils/emailTemplates.js

exports.orderConfirmationTemplate = (user, order, items) => {
  const itemHtml = items
    .map(
      (i) => `
      <tr>
        <td>${i.product.name}</td>
        <td>${i.quantity}</td>
        <td>₹${i.price}</td>
      </tr>
    `
    )
    .join("");

  return `
    <h2>Hi ${user.name},</h2>
    <p>Thank you for your order! 🎉</p>

    <h3>Order Details</h3>
    <p><b>Order ID:</b> #${order.id}</p>
    <p><b>Status:</b> ${order.orderStatus}</p>

    <table border="1" cellpadding="10" cellspacing="0">
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemHtml}
      </tbody>
    </table>

    <h3>Total Amount: ₹${order.total}</h3>

    <p>Shipping to:</p>
    <p>
      ${order.address.fullName}<br/>
      ${order.address.addressLine1}<br/>
      ${order.address.city}, ${order.address.state} - ${order.address.pincode}
    </p>

    <br/>
    <p>We will notify you when your order is shipped.</p>
    <p>Regards, <br/> Ecommerce Store Team</p>
  `;
};

✅ Step 5 — Modify Your Order Controller (Send Email After Order Creation)

Open:

📄 src/controllers/orderController.js

Find this part:

return success(res, "Order placed successfully", {
  orderId: order.id,
  total,
  paymentMethod,
});


Replace it with:

const { sendEmail } = require("../utils/email");
const { orderConfirmationTemplate } = require("../utils/emailTemplates");

// Send Email
await sendEmail(
  req.user.email,
  "Order Confirmation - #" + order.id,
  orderConfirmationTemplate(req.user, order, cartItems)
);

return success(res, "Order placed successfully, email sent!", {
  orderId: order.id,
  total,
  paymentMethod,
});

🧪 Example Output Email (User Receives)
Hi Ravi Kumar,

Thank you for your order! 🎉

Order ID: #25
Status: PENDING

-----------------------------------------------------
Product          Qty        Price
-----------------------------------------------------
Samsung Phone     1        ₹25000
Tablet            2        ₹18000
-----------------------------------------------------

Total Amount: ₹61000

Shipping to:
Ravi Kumar
No. 12, MG Road
Bangalore, Karnataka - 560001

We will notify you when your order is shipped.

Regards,
Ecommerce Store Team