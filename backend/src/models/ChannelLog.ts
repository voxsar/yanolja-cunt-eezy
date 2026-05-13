import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface ChannelLogAttributes {
  id?: number;
  source: string;
  forDate: Date;
  operation: string;
  roomType?: string;
  ratePlan?: string;
  requestAt: Date;
  processedAt?: Date;
  updatedValue?: string;
  user?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class ChannelLog extends Model<ChannelLogAttributes> implements ChannelLogAttributes {
  public id!: number;
  public source!: string;
  public forDate!: Date;
  public operation!: string;
  public roomType?: string;
  public ratePlan?: string;
  public requestAt!: Date;
  public processedAt?: Date;
  public updatedValue?: string;
  public user?: string;
}

ChannelLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    source: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    forDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    operation: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    roomType: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    ratePlan: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    requestAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedValue: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user: {
      type: DataTypes.STRING(120),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'ChannelLog',
    tableName: 'channel_logs'
  }
);

export default ChannelLog;
