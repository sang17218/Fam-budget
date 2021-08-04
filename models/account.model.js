const { Sequelize, DataTypes } = require('sequelize');
const {AccountHolder} = require('../models/accountHolder.model')
// const {SecondaryAccountHolder} = require('../models/secondaryHolder.model')
// const {Card} = require('../models/card.model')
// const {Transaction} = require('../models/transaction.model')

const sequelize = new Sequelize({
  "username": "root",
  "password": "ashwin1234",
  "database": "FamilyBudget",
  "host": "127.0.0.1",
  "dialect": "mysql",
  "port": 3306
});

const Account = sequelize.define('Account', {
  
  accountNumber: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true 
    // validate: {
    //     len: [8, 10]
    //   }
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
},{
  tableName: 'Account',
  timestamps: false
})

// Account.belongsToMany(SecondaryAccountHolder, {foreignKey: 'secondaryId'});
// Account.belongsToMany(Card, {foreignKey: 'cardNumber'});
// Account.belongsToMany(Transaction, {foreignKey: 'transactionID'});

module.exports.Account =  Account