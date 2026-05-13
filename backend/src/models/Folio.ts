import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface FolioAttributes {
  id?: number;
  folioNumber: string;
  reservationNumber: string;
  guestName: string;
  arrival: Date;
  departure: Date;
  status: 'open' | 'settled' | 'void';
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Folio extends Model<FolioAttributes> implements FolioAttributes {
  public id!: number;
  public folioNumber!: string;
  public reservationNumber!: string;
  public guestName!: string;
  public arrival!: Date;
  public departure!: Date;
  public status!: 'open' | 'settled' | 'void';
  public balance!: number;
}

Folio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    folioNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    reservationNumber: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    guestName: {
      type: DataTypes.STRING(140),
      allowNull: false
    },
    arrival: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    departure: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('open', 'settled', 'void'),
      defaultValue: 'open'
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'Folio',
    tableName: 'folios'
  }
);

export default Folio;
