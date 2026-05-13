import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface PromotionAttributes {
  id?: number;
  title: string;
  category: string;
  promotionType: string;
  desktopDiscount: number;
  mobileDiscount: number;
  code?: string;
  bookingStart: Date;
  bookingEnd: Date;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

class Promotion extends Model<PromotionAttributes> implements PromotionAttributes {
  public id!: number;
  public title!: string;
  public category!: string;
  public promotionType!: string;
  public desktopDiscount!: number;
  public mobileDiscount!: number;
  public code?: string;
  public bookingStart!: Date;
  public bookingEnd!: Date;
  public status!: 'active' | 'inactive';
}

Promotion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    promotionType: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    desktopDiscount: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    mobileDiscount: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    code: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    bookingStart: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    bookingEnd: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  },
  {
    sequelize,
    modelName: 'Promotion',
    tableName: 'promotions'
  }
);

export default Promotion;
