import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcryptjs';

export interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'front_desk' | 'housekeeping' | 'manager';
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'front_desk' | 'housekeeping' | 'manager';
  public firstName?: string;
  public lastName?: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'front_desk', 'housekeeping', 'manager'),
      defaultValue: 'front_desk'
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

export default User;
