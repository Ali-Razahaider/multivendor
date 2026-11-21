import { setAuthCookie } from './cookies.js';

const sendShopToken = (res, shopId) =>
  setAuthCookie(res, 'shop_token', { shopId });

export default sendShopToken;
