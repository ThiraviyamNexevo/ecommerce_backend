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
