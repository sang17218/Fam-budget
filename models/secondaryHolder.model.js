const { Sequelize, DataTypes } = require('sequelize');
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

    //   customerId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true 
    //   },
    

    secondaryId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    // primary user's account number
    primaryUserAccountNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    relationship: {
        type: DataTypes.STRING(255),
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

SecondaryAccountHolder.hasOne(Account, { foreignKey: 'primaryUserAccountNumber' })
// SecondaryAccountHolder.belongsToMany(Transaction, {foreignKey: 'transactionID'})
// SecondaryAccountHolder.belongsToMany(Card, {foreignKey: 'cardNumber' })

module.exports.SecondaryAccountHolder = SecondaryAccountHolder