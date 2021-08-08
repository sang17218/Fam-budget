const { Sequelize, DataTypes } = require('sequelize');
const {Card} = require('../models/card.model')
const {Transaction} = require('../models/transaction.model')
const {Account} = require("./account.model")
const sequelize = new Sequelize({
    "username": "root",
    "password": "ashwin1234",
    "database": "FamilyBudget",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port": 3306
  });

 const SecondaryAccountHolder = sequelize.define('SecondaryAccountHolder', {
    // Model attributes are defined here

    //   customerId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true 
    //   },
    

    secondaryId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
            len: [9, 11]
        },
        primaryKey: true,
        autoIncrement: true 
    },
    accountNumber: {
        type: DataTypes.BIGINT,
        allowNull: false
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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [9,11]
        }
    },
    gender: {
        type: DataTypes.ENUM("Male", "Female", "Other")
        // allowNull defaults to true
    },
    relationship: {
        type: DataTypes.STRING(255),
        allowNull: false
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
        type: DataTypes.STRING,
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