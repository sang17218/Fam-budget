const { Sequelize, DataTypes } = require('sequelize');
const {Card} = require('../models/card.model')
const {Transaction} = require('../models/transaction.model')
const {Account} = require("./account.model")
const sequelize = new Sequelize({
    "username": "admin",
    "password": "Database123!",
    "database": "familyBudget",
    "host": "database-family-budget.cn8pmdhr4iv3.us-east-1.rds.amazonaws.com",
    "dialect": "mysql",
    "port": 3306
  });

 const SecondaryAccountHolder = sequelize.define('SecondaryAccountHolder', {
    // Model attributes are defined here

    secondaryId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
    },
    accountNumber: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    isMinor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fundsAllocated: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.00
    },
    fundsSpent : {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.00
    }
}, {
    tableName: 'SecondaryAccountHolder',
    timestamps: false
});

SecondaryAccountHolder.hasOne(Account, { foreignKey: 'accountNumber' })
// SecondaryAccountHolder.belongsToMany(Transaction, {foreignKey: 'transactionID'})
// SecondaryAccountHolder.belongsToMany(Card, {foreignKey: 'cardNumber' })

module.exports.SecondaryAccountHolder = SecondaryAccountHolder