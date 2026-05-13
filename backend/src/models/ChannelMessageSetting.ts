import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface ChannelMessageSettingAttributes {
  id?: number;
  channelName: string;
  autoMode: boolean;
  customMessage: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class ChannelMessageSetting
  extends Model<ChannelMessageSettingAttributes>
  implements ChannelMessageSettingAttributes {
  public id!: number;
  public channelName!: string;
  public autoMode!: boolean;
  public customMessage!: string;
}

ChannelMessageSetting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    channelName: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true
    },
    autoMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    customMessage: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'ChannelMessageSetting',
    tableName: 'channel_message_settings'
  }
);

export default ChannelMessageSetting;
