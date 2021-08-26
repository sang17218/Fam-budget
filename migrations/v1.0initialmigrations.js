module.exports = {
    up: async(queryInterface, Sequelize) => {
        return Promise.all([
        //     await queryInterface.sequelize.query(`
        //     CREATE TABLE IF NOT EXISTS AccountHolder (
        //       customerId BIGINT(8) NOT NULL,
        //       createdAt DATETIME NOT NULL,
        //       updatedAt DATETIME,
        //       CONSTRAINT PK_AccountHolder PRIMARY KEY (customerId)  // acntType = primary, secondary
        //   )`),

        //             // CONSTRAINT FK_AccountHolder FOREIGN KEY (customerId) REFERENCES AccountHolder(customerId)
          await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS Account (
            accountNumber VARCHAR(255) NOT NULL,
            balance FLOAT NOT NULL,
            actualBalance FLOAT NOT NULL,
            accountType VARCHAR(255) NOT NULL, 
            customerId VARCHAR(255),
            applicationId VARCHAR(255) NOT NULL,

            CONSTRAINT PK_Account PRIMARY KEY (accountNumber)

        )`),
        ]);
        },
        down: async(queryInterface, Sequelize) => {
            return Promise.all([
                await queryInterface.dropTable('Account'),

                // await queryInterface.dropTable('AccountHolder'),
            ]);
        },
    }; 