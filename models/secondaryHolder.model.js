const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize();

const SecondaryAccountHolder = sequelize.define('SecondaryAccountHolder', {
    // Model attributes are defined here

    //   customerId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true 
    //   },
    secondaryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            len: [1, 2]
        },
        primaryKey: true,
        // autoIncrement: true 
    },
    accountNumber: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER(20),
        allowNull: false,
        validate: {
            min: 10,
            max: 15
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
        type: DataTypes.INTEGER,
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

}, {
    tableName: 'SecondaryAccountHolder'
});

SecondaryAccountHolder.hasOne(Account, { foreignKey: 'accountNumber' })
SecondaryAccountHolder.belongsToMany(Transaction, {foreignKey: 'transactionID'})
SecondaryAccountHolder.belongsToMany(Card, {foreignKey: 'cardNumber' })
