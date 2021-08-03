const { Sequelize, DataTypes } = require('sequelize');
const {Account} = require('../models/account.model')
const {SecondaryAccountHolder} = require("../models/secondaryHolder.model")
const sequelize = new Sequelize({
    "username": "root",
    "password": "Itsasecret2@",
    "database": "FamilyBudget",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port": 3306
  });

const Policy = sequelize.define('Policy', {
    policyId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            len: [7, 10]
        },
        primaryKey: true,
    },
    accountNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    spendLimit: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    isSecondaryHolder: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    secondaryId: {
        type: DataTypes.BIGINT,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
    expirationDate: {
        type: DataTypes.DATE,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    isSecondaryHolder: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},{
    tableName: "Policy",
    timestamps: false
})

Policy.hasOne(Account, { foreignKey: 'accountNumber' })
Policy.hasOne(SecondaryAccountHolder, {foreignKey: 'secondaryId'})

module.exports.Policy = Policy