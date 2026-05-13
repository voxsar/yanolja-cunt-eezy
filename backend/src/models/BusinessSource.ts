import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface BusinessSourceAttributes {
  id?: number;
  shortCode: string;
  name: string;
  color?: string;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

class BusinessSource extends Model<BusinessSourceAttributes> implements BusinessSourceAttributes {
  public id!: number;
  public shortCode!: string;
  public name!: string;
  public color?: string;
  public status!: 'active' | 'inactive';
}

BusinessSource.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    shortCode: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  },
  {
    sequelize,
    modelName: 'BusinessSource',
    tableName: 'business_sources'
  }
);

export default BusinessSource;
