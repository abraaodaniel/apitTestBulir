import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  providerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

Service.belongsTo(User, { as: 'provider', foreignKey: 'providerId' });

export default Service;