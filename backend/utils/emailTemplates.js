import { frontendUrl } from '../config/env.js';

// Transactional email templates. Everything user-controlled is escaped.

const BRAND = '#4f46e5';

const escape = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const button = (url, label) => `
  <table cellpadding="0" cellspacing="0" style="margin:8px auto 0">
    <tr>
      <td style="background:${BRAND};border-radius:10px;padding:13px 30px">
        <a href="${escape(url)}" style="color:#fff;text-decoration:none;font-size:15px;font-weight:600">${label}</a>
      </td>
    </tr>
  </table>`;

const fallbackLink = (url) => `
  <p style="font-size:12px;color:#94a3b8;margin:24px 0 0;line-height:1.5">
    If the button doesn't work, copy and paste this link into your browser:<br>
    <span style="color:${BRAND};word-break:break-all">${escape(url)}</span>
  </p>`;

const layout = ({ title, body, footer = '' }) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
          <tr>
            <td style="padding:0 4px 18px">
              <a href="${frontendUrl()}" style="text-decoration:none;color:#0f172a;font-size:22px;font-weight:800;letter-spacing:-0.5px">
                <span style="display:inline-block;width:30px;height:30px;line-height:30px;text-align:center;border-radius:9px;background:${BRAND};color:#fff;font-size:17px;vertical-align:middle;margin-right:8px">b</span><span style="vertical-align:middle">bazaarly</span>
              </a>
            </td>
          </tr>
          <tr>
            <td style="background:#fff;border-radius:16px;padding:36px 32px;border:1px solid #e2e8f0">
              <h1 style="margin:0 0 18px;font-size:22px;color:#0f172a;letter-spacing:-0.3px">${title}</h1>
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 4px;text-align:center;font-size:12px;color:#94a3b8;line-height:1.6">
              ${footer}${footer ? '<br>' : ''}Bazaarly — independent shops, one marketplace.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const p = (html) => `<p style="font-size:15px;color:#334155;margin:0 0 16px;line-height:1.6">${html}</p>`;

export const activationTemplate = (name, url) =>
  layout({
    title: 'Confirm your email',
    body: `${p(`Hi <strong>${escape(name)}</strong>,`)}
      ${p('Thanks for joining Bazaarly! Confirm your email address to activate your account.')}
      ${button(url, 'Activate account')}
      ${fallbackLink(url)}`,
    footer: 'This link expires in 30 minutes. If you didn’t sign up, you can ignore this email.',
  });

export const welcomeTemplate = (name) =>
  layout({
    title: 'Welcome to Bazaarly',
    body: `${p(`Hi <strong>${escape(name)}</strong>,`)}
      ${p('Your account is active. Discover great products from independent sellers, all in one place.')}
      ${button(frontendUrl(), 'Start shopping')}`,
  });

export const passwordResetTemplate = (name, url) =>
  layout({
    title: 'Reset your password',
    body: `${p(`Hi <strong>${escape(name)}</strong>,`)}
      ${p('We received a request to reset your password. Choose a new one using the button below.')}
      ${button(url, 'Reset password')}
      ${fallbackLink(url)}`,
    footer: 'This link expires in 30 minutes. If you didn’t request a reset, no action is needed.',
  });

export const orderConfirmationTemplate = (name, orderId, totalPrice, items) =>
  layout({
    title: 'Thanks for your order!',
    body: `${p(`Hi <strong>${escape(name)}</strong>,`)}
      ${p(`Your order <strong>#${escape(orderId)}</strong> has been placed. We’ll email you as it moves along.`)}
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;margin:8px 0 20px;border-collapse:separate">
        ${items
          .map(
            (item) => `
          <tr>
            <td style="padding:12px 16px;font-size:14px;color:#334155;border-bottom:1px solid #f1f5f9">${escape(item.name)} <span style="color:#94a3b8">× ${escape(item.qty)}</span></td>
            <td style="padding:12px 16px;font-size:14px;color:#334155;border-bottom:1px solid #f1f5f9;text-align:right;white-space:nowrap">$${((item.discountedPrice || item.price) * item.qty).toFixed(2)}</td>
          </tr>`
          )
          .join('')}
        <tr>
          <td style="padding:14px 16px;font-size:15px;font-weight:700;color:#0f172a">Total paid</td>
          <td style="padding:14px 16px;font-size:15px;font-weight:700;color:#0f172a;text-align:right">$${escape(totalPrice)}</td>
        </tr>
      </table>
      ${button(`${frontendUrl()}/profile`, 'View my orders')}`,
  });

export const statusUpdateTemplate = (name, orderId, status) =>
  layout({
    title: 'Your order has an update',
    body: `${p(`Hi <strong>${escape(name)}</strong>,`)}
      ${p(`Order <strong>#${escape(orderId)}</strong> is now:`)}
      <p style="display:inline-block;margin:0 0 20px;padding:8px 14px;border-radius:999px;background:#eef2ff;color:${BRAND};font-weight:700;font-size:14px">${escape(status)}</p>
      ${button(`${frontendUrl()}/user/order/${escape(orderId)}`, 'View order')}`,
  });

export const plainNoticeTemplate = (title, name, message) =>
  layout({
    title: escape(title),
    body: `${p(`Hi <strong>${escape(name)}</strong>,`)}${p(escape(message))}`,
  });
