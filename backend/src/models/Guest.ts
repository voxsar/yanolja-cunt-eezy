import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface GuestAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  company?: string;
  isVIP: boolean;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Guest extends Model<GuestAttributes> implements GuestAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public title?: string;
  public email?: string;
  public phone?: string;
  public mobile?: string;
  public country?: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public zipCode?: string;
  public nationality?: string;
  public idType?: string;
  public idNumber?: string;
  public company?: string;
  public isVIP!: boolean;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Guest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    zipCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    idType: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    idNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isVIP: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Guest',
    tableName: 'guests'
  }
);

export default Guest;
