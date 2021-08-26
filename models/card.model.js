const { Sequelize, DataTypes } = require('sequelize');
const {Account} = require('../models/account.model')

const sequelize = new Sequelize({
    "username": "admin",
    "password": "Database123!",
    "database": "familyBudget",
    "host": "database-family-budget.cn8pmdhr4iv3.us-east-1.rds.amazonaws.com",
    "dialect": "mysql",
    "port": 3306
  });

const Card = sequelize.define('Card', {

    cardNumber: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cvv: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            len: [2, 4]
        }
    },
    expiryPeriod: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    pin:{
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            len: [3, 5]
        }
    }
},
{
    tableName: 'Card',
    timestamps: false
})
Card.hasOne(Account, { foreignKey: 'accountNumber' })
//Card.hasOne(SecondaryAccountHolder, {foreignKey: 'secondaryId'})

module.exports.Card = Card