const { Sequelize } = require('sequelize');

module.exports.DatabaseUtil = class DatabaseUtil {

    static sequelize = new Sequelize(
        // {
    //     host: 'localhost',
    //     database: "FamilyBudget",
    //     username: "root",
    //     password: "",
    //     port: 3306,
    //     dialect: "mysql",
    //     benchmark: true,
    //     // dialectModule: 'mysql2'

    // }
    {
        "username": "admin",
        "password": "Database123!",
        "database": "familyBudget",
        "host": "database-family-budget.cn8pmdhr4iv3.us-east-1.rds.amazonaws.com",
        "dialect": "mysql",
        "port": 3306,
        "benchmark": true,
      })
    static async getDbConnection() {
        console.log("getDbConnection started")
        try {
            await this.sequelize.authenticate()
            console.log('Connection has been established successfully.');
            await this.initializeModels()

        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        console.log("getDbConnection end")
    }

    static async initializeModels() {
        console.log("initializeModels started")
        await this.sequelize.sync();
    }

    static async endDbConnection() {
        console.log("In endDbConnection")
        await this.sequelize.close()
    }
}