import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

class UserController {
  async register(req, res) {
    try {
      const { fullName, nif, email, password, userType } = req.body;

      // Verifica se já existe um usuário com o mesmo email ou NIF
      const existingUser = await User.findOne({
        where: { email }
      });

      if (!existingUser) {
        const existingNif = await User.findOne({ where: { nif } });
        if (existingNif) {
          return res.status(400).json({ error: 'NIF already registered' });
        }
      } else {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash da senha antes de salvar
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        fullName,
        nif,
        email,
        password: hashedPassword,
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
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      return res.json({ 
        user: { id: user.id, fullName: user.fullName, nif: user.nif, email: user.email, userType: user.userType }, 
        token 
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  async find(req, res) {
    try {
      const user = await User.findAll();
      return res.json({user});
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new UserController();
