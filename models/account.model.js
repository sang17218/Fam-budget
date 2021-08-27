const { Sequelize, DataTypes } = require('sequelize');
// const {AccountHolder} = require('../models/accountHolder.model')
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
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.00
  },
  customerId: {
    type: DataTypes.STRING,
  },
  actualBalance:{
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0.0
  },
  applicationId: {
    type: DataTypes.STRING,
  },
  accountType : {
    type: DataTypes.STRING,
    allowNull: false,
  }
  
},
{
  tableName: 'Account',
  timestamps: false
})

// Account.hasOne(AccountHolder, {foreignKey: "customerId"})
// Account.belongsToMany(SecondaryAccountHolder, {foreignKey: 'secondaryId'});
// Account.belongsToMany(Card, {foreignKey: 'cardNumber'});
// Account.belongsToMany(Transaction, {foreignKey: 'transactionID'});

module.exports.Account =  Account