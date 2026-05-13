import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface GuestPortalRequestAttributes {
  id?: number;
  reservationNumber: string;
  guestName: string;
  date: Date;
  room?: string;
  request: string;
  bookingStatus: string;
  status: 'open' | 'in_progress' | 'closed';
  createdAt?: Date;
  updatedAt?: Date;
}

class GuestPortalRequest
  extends Model<GuestPortalRequestAttributes>
  implements GuestPortalRequestAttributes {
  public id!: number;
  public reservationNumber!: string;
  public guestName!: string;
  public date!: Date;
  public room?: string;
  public request!: string;
  public bookingStatus!: string;
  public status!: 'open' | 'in_progress' | 'closed';
}

GuestPortalRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    reservationNumber: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    guestName: {
      type: DataTypes.STRING(140),
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    room: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    request: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    bookingStatus: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'closed'),
      defaultValue: 'open'
    }
  },
  {
    sequelize,
    modelName: 'GuestPortalRequest',
    tableName: 'guest_portal_requests'
  }
);

export default GuestPortalRequest;
