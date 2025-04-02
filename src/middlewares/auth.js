import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async (req, res, next) => {
  try {
    // Pular verificação do token
    req.user = { id: 1, name: 'Usuário Padrão' }; // Dados de exemplo
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Erro inesperado' });
  }
};
