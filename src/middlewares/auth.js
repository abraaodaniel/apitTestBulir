import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

     if (!authHeader) {
       return res.status(401).json({ error: 'No token provided' });
     }

    const [, token] = authHeader.split(' ');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

     if (!user) {
       return res.status(401).json({ error: 'Invalid token' });
     }

    req.user = user;
    return next();
  } catch (error) {
     return res.status(401).json({ error: 'Invalid token' });
  }
};