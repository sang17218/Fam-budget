const { Sequelize, DataTypes } = require('sequelize');
const {AccountHolder} = require('../models/accountHolder.model')
// const {SecondaryAccountHolder} = require('../models/secondaryHolder.model')
// const {Card} = require('../models/card.model')
// const {Transaction} = require('../models/transaction.model')

const sequelize = new Sequelize({
  "username": "admin",
  "password": "Database123!",
  "database": "familyBudget",
  "host": "database-family-budget.cn8pmdhr4iv3.us-east-1.rds.amazonaws.com",
  "dialect": "mysql",
  "port": 3306
});

const Account = sequelize.define('Account', {
  
  accountNumber: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true ,
    validate: {
        len: [9,11],
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
  minimumBalance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue:0.00
  },
  bcity: {
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
  customerId: {
    type: DataTypes.BIGINT,
  },
  actualBalance:{
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0.00
  }
  
},
{
  tableName: 'Account',
  timestamps: false
})

Account.hasOne(AccountHolder, {foreignKey: "customerId"})
// Account.belongsToMany(SecondaryAccountHolder, {foreignKey: 'secondaryId'});
// Account.belongsToMany(Card, {foreignKey: 'cardNumber'});
// Account.belongsToMany(Transaction, {foreignKey: 'transactionID'});

module.exports.Account =  Account