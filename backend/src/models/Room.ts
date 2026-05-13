import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface RoomAttributes {
  id?: number;
  roomNumber: string;
  roomTypeId: number;
  floor?: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance' | 'blocked';
  housekeepingStatus: 'clean' | 'dirty' | 'inspected' | 'out_of_order';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Room extends Model<RoomAttributes> implements RoomAttributes {
  public id!: number;
  public roomNumber!: string;
  public roomTypeId!: number;
  public floor?: number;
  public status!: 'available' | 'occupied' | 'reserved' | 'maintenance' | 'blocked';
  public housekeepingStatus!: 'clean' | 'dirty' | 'inspected' | 'out_of_order';
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    roomNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    roomTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'room_types',
        key: 'id'
      }
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'reserved', 'maintenance', 'blocked'),
      defaultValue: 'available'
    },
    housekeepingStatus: {
      type: DataTypes.ENUM('clean', 'dirty', 'inspected', 'out_of_order'),
      defaultValue: 'dirty'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms'
  }
);

export default Room;
