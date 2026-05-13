import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface RoomTypeAttributes {
  id?: number;
  name: string;
  code: string;
  description?: string;
  basePrice: number;
  maxOccupancy: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class RoomType extends Model<RoomTypeAttributes> implements RoomTypeAttributes {
  public id!: number;
  public name!: string;
  public code!: string;
  public description?: string;
  public basePrice!: number;
  public maxOccupancy!: number;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoomType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    maxOccupancy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'RoomType',
    tableName: 'room_types'
  }
);

export default RoomType;
