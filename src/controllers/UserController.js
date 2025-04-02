import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

class UserController {
  async register(req, res) {
    try {
      const { fullName, nif, email, password, userType } = req.body;

      // Verifica se já existe um usuário com o mesmo email ou NIF
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const existingNif = await User.findOne({ where: { nif } });
      if (existingNif) {
        return res.status(400).json({ error: 'NIF already registered' });
      }

      // Hash da senha antes de salvar
      // const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        fullName,
        nif,
        email,
        // password: hashedPassword, // Armazenando a senha criptografada
        password,
        userType
      });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      return res.status(201).json({
        user: { id: user.id, fullName, nif, email, userType },
        token
      });
    } catch (error) {
      console.error('Register Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      // Verificação do usuário
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Comparação da senha
      const passMatch = await bcrypt.compare(password, user.password);
      if (!passMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Geração do token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      return res.json({
        user: { id: user.id, fullName: user.fullName, nif: user.nif, email: user.email, userType: user.userType },
        token,
      });
    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async find(req, res) {
    try {
      const users = await User.findAll();
      return res.json({ users });
    } catch (error) {
      console.error('Find Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async remove(req, res) {
    const { id } = req.body;
    try {
      // Verifica se o usuário existe
      const user = await User.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Deleta o usuário
      await User.destroy({ where: { id } });
  
      return res.json({ message: 'User deleted successfully' , user: user});
    } catch (error) {
      console.error('Delete Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

}
  

export default new UserController();
