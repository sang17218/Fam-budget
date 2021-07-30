const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize();

const AccountHolder = sequelize.define('AccountHolder', {
  // Model attributes are defined here

  customerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true 
  },
  accountNumber: {
    type: DataTypes.INTEGER,
  },
  firstName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
    // allowNull defaults to true
  },
  mobile: {
    type: DataTypes.INTEGER(20),
    allowNull: false,
    validate:{
        min: 10,
        max: 15
    }
  },
  gender: {
    type: DataTypes.ENUM("Male","Female","Other")
    // allowNull defaults to true
  },
  isKycVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  bcity: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  panNumber: {
    type: DataTypes.INTEGER,
    allowNull: false

  },
  isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: new Date(),
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
 
}, {
    tableName: 'AccountHolder'
});
AccountHolder.hasMany(Account, { foreignKey: 'accountNumber' });

