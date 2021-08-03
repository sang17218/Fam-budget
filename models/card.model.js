const { Sequelize, DataTypes } = require('sequelize');
const {Account} = require('../models/account.model')
const {SecondaryAccountHolder} = require('../models/secondaryHolder.model')
const sequelize = new Sequelize({
    "username": "root",
    "password": "Itsasecret2@",
    "database": "FamilyBudget",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "port": 3306
  });

const Card = sequelize.define('Card', {

    cardNumber: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        validate: {
            len: [16, 18]
        }
    },
    accountNumber: {
        type: DataTypes.BIGINT,
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
    senderSecondary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    secondaryId: {
        type: DataTypes.BIGINT,
    }
})
Card.hasOne(Account, { foreignKey: 'accountNumber' })
Card.hasOne(SecondaryAccountHolder, {foreignKey: 'secondaryId'})

module.exports.Card = Card