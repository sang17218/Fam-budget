const { Sequelize, DataTypes, Model } = require('sequelize');
const {Account} = require("./account.model")
const {SecondaryAccountHolder} = require("./secondaryHolder.model")
const sequelize = new Sequelize({
  "username": "admin",
  "password": "Database123!",
  "database": "familyBudget",
  "host": "database-family-budget.cn8pmdhr4iv3.us-east-1.rds.amazonaws.com",
  "dialect": "mysql",
  "port": 3306
});

const Transaction = sequelize.define('Transaction', {
  
  transactionID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    // validate: {
    //     len: [10, 12]
    //   }
  },
  merchant: {
    type: DataTypes.STRING(255),
    allowNull:true
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
    type: DataTypes.BIGINT,
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
},{
  tableName: "Transaction",
  timestamps: false
})

Transaction.hasMany(Account, {foreignKey:  'accountNumber' })
//Transaction.hasOne(SecondaryAccountHolder, {foreignKey: 'secondaryId'})

module.exports.Transaction = Transaction