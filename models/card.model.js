const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize();

const Card = sequelize.define('Card', {

    cardNumber: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        validate: {
            len: [16, 16]
        }
    },
    accountNumber: {
        type: DataTypes.INTEGER,
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
            len: [3, 3]
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
        type: DataTypes.INTEGER,
    }
})
Card.hasOne(Account, { foreignKey: 'accountNumber' })
Card.hasOne(SecondaryAccountHolder, {foreignKey: secondaryId})