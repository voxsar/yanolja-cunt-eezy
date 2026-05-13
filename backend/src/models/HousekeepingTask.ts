import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface HousekeepingTaskAttributes {
  id?: number;
  roomId: number;
  assignedTo?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  taskType: 'cleaning' | 'inspection' | 'maintenance';
  notes?: string;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class HousekeepingTask extends Model<HousekeepingTaskAttributes> implements HousekeepingTaskAttributes {
  public id!: number;
  public roomId!: number;
  public assignedTo?: string;
  public status!: 'pending' | 'in_progress' | 'completed';
  public priority!: 'low' | 'medium' | 'high';
  public taskType!: 'cleaning' | 'inspection' | 'maintenance';
  public notes?: string;
  public completedAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HousekeepingTask.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'id'
      }
    },
    assignedTo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
      defaultValue: 'pending'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    taskType: {
      type: DataTypes.ENUM('cleaning', 'inspection', 'maintenance'),
      defaultValue: 'cleaning'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'HousekeepingTask',
    tableName: 'housekeeping_tasks'
  }
);

export default HousekeepingTask;
