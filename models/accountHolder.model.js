const { Sequelize, DataTypes } = require('sequelize');
// const {Account} = require('../models/account.model')
const sequelize = new Sequelize({
  "username": "admin",
  "password": "Database123!",
  "database": "familyBudget",
  "host": "database-family-budget.cn8pmdhr4iv3.us-east-1.rds.amazonaws.com",
  "dialect": "mysql",
  "port": 3306
});

 const AccountHolder = sequelize.define('AccountHolder', {
  // Model attributes are defined here

  customerId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true 
  }

}, {
    tableName: 'AccountHolder',
    timestamps: false
});

// Account.belongsTo(AccountHolder);
// AccountHolder.belongsToMany(Account, {foreignKey: "accountNumber"})

// AccountHolder.hasMany(Account)
module.exports.AccountHolder = AccountHolder

