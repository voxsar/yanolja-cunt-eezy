import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface PaymentGatewaySettingAttributes {
  id?: number;
  paymentType: string;
  paymentCaption: string;
  userId: string;
  password: string;
  merchantId: string;
  gatewayUrl: string;
  enabled: boolean;
  linkSettings: object;
  createdAt?: Date;
  updatedAt?: Date;
}

class PaymentGatewaySetting
  extends Model<PaymentGatewaySettingAttributes>
  implements PaymentGatewaySettingAttributes {
  public id!: number;
  public paymentType!: string;
  public paymentCaption!: string;
  public userId!: string;
  public password!: string;
  public merchantId!: string;
  public gatewayUrl!: string;
  public enabled!: boolean;
  public linkSettings!: object;
}

PaymentGatewaySetting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    paymentType: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true
    },
    paymentCaption: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    merchantId: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    gatewayUrl: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    linkSettings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    }
  },
  {
    sequelize,
    modelName: 'PaymentGatewaySetting',
    tableName: 'payment_gateway_settings'
  }
);

export default PaymentGatewaySetting;
