const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize();

const Transaction = sequelize.define('Transaction', {
  
  transactionID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    validate: {
        len: [10, 12]
      }
  },
  merchant: {
    type: DataTypes.STRING(255),
    allowNull:false
  },
  description: {
    type: DataTypes.STRING(255),
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  senderSecondary : {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  secondaryId: {
    type: DataTypes.INTEGER,
  },
  transactionStartedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  },
  transactionEndedAt: {
    type: DataTypes.DATE,
  },
  isSuccessful: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  senderAccountNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiverAccountNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
})

Transaction.hasMany(Account, {foreignKey:  'accountNumber' })
Transaction.hasOne('SecondaryAccountHolder', {foreignKey: secondaryId})