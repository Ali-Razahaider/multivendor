export const activationTemplate = (name, url) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden">
          <tr>
            <td style="padding:40px 30px;text-align:center;background:#2563eb">
              <h1 style="color:#fff;margin:0;font-size:22px">Activate Your Account</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px">
              <p style="font-size:15px;color:#333;margin:0 0 20px">Hi <strong>${name}</strong>,</p>
              <p style="font-size:14px;color:#666;margin:0 0 24px;line-height:1.6">
                Thanks for signing up! Please click the button below to activate your account and get started.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto">
                <tr>
                  <td style="background:#2563eb;border-radius:6px;padding:12px 32px">
                    <a href="${url}" style="color:#fff;text-decoration:none;font-size:15px;font-weight:bold">Activate Account</a>
                  </td>
                </tr>
              </table>
              <p style="font-size:13px;color:#999;margin:24px 0 0;line-height:1.5">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <span style="color:#2563eb;word-break:break-all">${url}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 30px;background:#f9f9f9;text-align:center;border-top:1px solid #eee">
              <p style="font-size:12px;color:#aaa;margin:0">This link expires in 10 minutes.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

export const welcomeTemplate = (name) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden">
          <tr>
            <td style="padding:40px 30px;text-align:center;background:#16a34a">
              <h1 style="color:#fff;margin:0;font-size:22px">Welcome Aboard!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px">
              <p style="font-size:15px;color:#333;margin:0 0 20px">Hi <strong>${name}</strong>,</p>
              <p style="font-size:14px;color:#666;margin:0;line-height:1.6">
                Your account has been activated successfully. You can now log in and start using our platform.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 30px;background:#f9f9f9;text-align:center;border-top:1px solid #eee">
              <p style="font-size:12px;color:#aaa;margin:0">Thank you for joining us!</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

export const orderConfirmationTemplate = (name, orderId, totalPrice, items) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden">
          <tr>
            <td style="padding:40px 30px;text-align:center;background:#16a34a">
              <h1 style="color:#fff;margin:0;font-size:22px">Order Confirmed!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px">
              <p style="font-size:15px;color:#333;margin:0 0 20px">Hi <strong>${name}</strong>,</p>
              <p style="font-size:14px;color:#666;margin:0 0 20px;line-height:1.6">
                Your order <strong>#${orderId}</strong> has been placed successfully.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:6px;margin-bottom:20px">
                <tr>
                  <td style="padding:12px 16px;background:#f9f9f9;font-size:13px;font-weight:bold;color:#333;border-bottom:1px solid #eee">Items</td>
                  <td style="padding:12px 16px;background:#f9f9f9;font-size:13px;font-weight:bold;color:#333;border-bottom:1px solid #eee;text-align:right">Total</td>
                </tr>
                ${items.map(item => `
                  <tr>
                    <td style="padding:10px 16px;font-size:13px;color:#666;border-bottom:1px solid #f4f4f4">
                      ${item.name} × ${item.qty}
                    </td>
                    <td style="padding:10px 16px;font-size:13px;color:#666;border-bottom:1px solid #f4f4f4;text-align:right">
                      $${((item.discountedPrice || item.price) * item.qty).toFixed(2)}
                    </td>
                  </tr>
                `).join('')}
                <tr>
                  <td style="padding:12px 16px;font-size:14px;font-weight:bold;color:#333">Total</td>
                  <td style="padding:12px 16px;font-size:14px;font-weight:bold;color:#333;text-align:right">$${totalPrice}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 30px;background:#f9f9f9;text-align:center;border-top:1px solid #eee">
              <p style="font-size:12px;color:#aaa;margin:0">You'll receive updates when your order status changes.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

export const statusUpdateTemplate = (name, orderId, status) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden">
          <tr>
            <td style="padding:40px 30px;text-align:center;background:#2563eb">
              <h1 style="color:#fff;margin:0;font-size:22px">Order Updated</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px">
              <p style="font-size:15px;color:#333;margin:0 0 20px">Hi <strong>${name}</strong>,</p>
              <p style="font-size:14px;color:#666;margin:0;line-height:1.6">
                The status of your order <strong>#${orderId}</strong> has been updated to
                <strong style="color:#2563eb">${status}</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 30px;background:#f9f9f9;text-align:center;border-top:1px solid #eee">
              <p style="font-size:12px;color:#aaa;margin:0">Thank you for shopping with us!</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
