const { Sequelize, DataTypes } = require('sequelize');
// const {Account} = require('../models/account.model')
const sequelize = new Sequelize({
  "username": "admin",
  "password": "Database123!",
  "database": "familyBudget",
  "host": "database-family-budget.cn8pmdhr4iv3.us-east-1.rds.amazonaws.com",
  "dialect": "mysql",
  "port": 3306
});

 const AccountHolder = sequelize.define('AccountHolder', {
  // Model attributes are defined here

  customerId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true 
  },
  accountNumber: {
    type: DataTypes.BIGINT,
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
    unique: true,
    isEmail: true,
    allowNull: false

    // allowNull defaults to true
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [9, 11]
    }
  },
  gender: {
    type: DataTypes.ENUM("Male","Female","Other")
    // allowNull defaults to true
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
 
}, {
    tableName: 'AccountHolder',
    timestamps: false
});

// Account.belongsTo(AccountHolder);
// AccountHolder.belongsToMany(Account, {foreignKey: "accountNumber"})

// AccountHolder.hasMany(Account)
module.exports.AccountHolder = AccountHolder

