const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize();

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
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
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
})

Policy.hasOne(Account, { foreignKey: 'accountNumber' })
Policy.hasOne('SecondaryAccountHolder', {foreignKey: secondaryId})