import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Service from './Service.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Service,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending'
  },
  bookingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

Booking.belongsTo(User, { as: 'client', foreignKey: 'clientId' });
Booking.belongsTo(Service, { as: 'service', foreignKey: 'serviceId' });

export default Booking;