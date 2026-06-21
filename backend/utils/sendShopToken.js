import jwt from 'jsonwebtoken';

const sendShopToken = (res, shopId) => {
  const token = jwt.sign({ shopId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  res.cookie('shop_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default sendShopToken;
