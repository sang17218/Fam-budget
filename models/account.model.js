const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize();

const Account = sequelize.define('Account', {
  
  accountNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    validate: {
        len: [8, 10]
      }
  },
  branch: {
    type: DataTypes.STRING(255),
    allowNull:false
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.00
  },
  accountType: {
    type: DataTypes.STRING(255)
  },
  mininmumBalance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue:0.00
  },
  city: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  isActive : {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
})
Account.belongsTo(AccountHolder);
