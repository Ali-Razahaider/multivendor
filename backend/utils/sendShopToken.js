import jwt from 'jsonwebtoken';

const sendShopToken = (res, shopId) => {
  const token = jwt.sign({ shopId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  const isProduction = process.env.NODE_ENV === 'PRODUCTION' || process.env.NODE_ENV === 'production';
  res.cookie('shop_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default sendShopToken;
