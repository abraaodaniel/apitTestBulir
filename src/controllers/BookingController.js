import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import sequelize from '../config/database.js';

class BookingController {
  async create(req, res) {
    const t = await sequelize.transaction();

    try {
      const { serviceId, bookingDate } = req.body;
      const clientId = req.user.id;

      if (req.user.userType !== 'client') {
        return res.status(403).json({ error: 'Only clients can make bookings' });
      }

      const service = await Service.findByPk(serviceId, { include: ['provider'] });
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      const client = await User.findByPk(clientId);
      if (client.balance < service.price) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Update balances
      await client.decrement('balance', { by: service.price, transaction: t });
      await service.provider.increment('balance', { by: service.price, transaction: t });

      const booking = await Booking.create({
        clientId,
        serviceId,
        bookingDate,
        amount: service.price,
        status: 'confirmed'
      }, { transaction: t });

      await t.commit();
      return res.status(201).json(booking);
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ error: error.message });
    }
  }

  async list(req, res) {
    try {
      // const userId = req.user.id;
      // const userType = req.user.userType;

      // const query = userType === 'client' 
      //   ? { clientId: userId }
      //   : { '$service.providerId$': userId };

      // const bookings = await Booking.findAll({
      //   where: query,
      //   include: [
      //     { model: User, as: 'client' },
      //     { model: Service, as: 'service' }
      //   ]
      // });

      const bookings = await Booking.findAll()

      return res.json(bookings);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async cancel(req, res) {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;
      const userId = req.user.id;

      const booking = await Booking.findByPk(id, {
        include: [
          { model: Service, as: 'service', include: ['provider'] }
        ]
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.clientId !== userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      if (booking.status !== 'confirmed') {
        return res.status(400).json({ error: 'Booking cannot be cancelled' });
      }

      // Refund the amount
      await User.increment('balance', {
        by: booking.amount,
        where: { id: booking.clientId },
        transaction: t
      });

      await User.decrement('balance', {
        by: booking.amount,
        where: { id: booking.service.providerId },
        transaction: t
      });

      booking.status = 'cancelled';
      await booking.save({ transaction: t });

      await t.commit();
      return res.json(booking);
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new BookingController();