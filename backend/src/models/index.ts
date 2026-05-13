// Import all models
import User from './User';
import RoomType from './RoomType';
import Room from './Room';
import Guest from './Guest';
import Reservation from './Reservation';
import HousekeepingTask from './HousekeepingTask';

// Define associations
RoomType.hasMany(Room, { foreignKey: 'roomTypeId', as: 'rooms' });
Room.belongsTo(RoomType, { foreignKey: 'roomTypeId', as: 'roomType' });

Guest.hasMany(Reservation, { foreignKey: 'guestId', as: 'reservations' });
Reservation.belongsTo(Guest, { foreignKey: 'guestId', as: 'guest' });

Room.hasMany(Reservation, { foreignKey: 'roomId', as: 'reservations' });
Reservation.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

RoomType.hasMany(Reservation, { foreignKey: 'roomTypeId', as: 'reservations' });
Reservation.belongsTo(RoomType, { foreignKey: 'roomTypeId', as: 'roomType' });

Room.hasMany(HousekeepingTask, { foreignKey: 'roomId', as: 'housekeepingTasks' });
HousekeepingTask.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

export {
  User,
  RoomType,
  Room,
  Guest,
  Reservation,
  HousekeepingTask
};
