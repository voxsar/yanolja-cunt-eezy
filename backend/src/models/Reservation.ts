import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface ReservationAttributes {
  id?: number;
  reservationNumber: string;
  guestId: number;
  roomId?: number;
  roomTypeId: number;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  source: 'direct' | 'booking_engine' | 'airbnb' | 'booking_com' | 'expedia' | 'walk_in' | 'phone' | 'email' | 'other';
  businessSource?: string;
  salesPerson?: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  rateType?: string;
  specialRequests?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Reservation extends Model<ReservationAttributes> implements ReservationAttributes {
  public id!: number;
  public reservationNumber!: string;
  public guestId!: number;
  public roomId?: number;
  public roomTypeId!: number;
  public checkIn!: Date;
  public checkOut!: Date;
  public adults!: number;
  public children!: number;
  public status!: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  public source!: 'direct' | 'booking_engine' | 'airbnb' | 'booking_com' | 'expedia' | 'walk_in' | 'phone' | 'email' | 'other';
  public businessSource?: string;
  public salesPerson?: string;
  public totalAmount!: number;
  public paidAmount!: number;
  public balanceAmount!: number;
  public rateType?: string;
  public specialRequests?: string;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    reservationNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    guestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'guests',
        key: 'id'
      }
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rooms',
        key: 'id'
      }
    },
    roomTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'room_types',
        key: 'id'
      }
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: false
    },
    adults: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    children: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'),
      defaultValue: 'pending'
    },
    source: {
      type: DataTypes.ENUM('direct', 'booking_engine', 'airbnb', 'booking_com', 'expedia', 'walk_in', 'phone', 'email', 'other'),
      defaultValue: 'direct'
    },
    businessSource: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    salesPerson: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    balanceAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    rateType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservations'
  }
);

export default Reservation;
