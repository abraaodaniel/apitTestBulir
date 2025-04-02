import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async (req, res, next) => {
  try {
    // Verificar se o cabeçalho Authorization foi fornecido
    const token = req.headers.authorization?.split(' ')[1]; // O token vem após "Bearer"

    // if (!token) {
    //   return res.status(401).json({ error: 'Token não fornecido' });
    // }

    // Verificar e decodificar o token usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar o usuário no banco de dados com o id decodificado do token
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Adicionar os dados do usuário ao objeto `req` para ser utilizado nas rotas subsequentes
    req.user = user;

    // Passar para o próximo middleware ou rota
    return next();

  } catch (error) {
    return next();
    // return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
