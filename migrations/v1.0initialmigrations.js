module.exports = {
    up: async(queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS AccountHolder (
              customerId BIGINT(8) auto_increment NOT NULL,
              panNumber VARCHAR(255) NOT NULL,
              firstName VARCHAR(255) NOT NULL,
              lastName VARCHAR(255) NOT NULL,
              email VARCHAR(320) NOT NULL,
              mobile VARCHAR(255) NOT NULL,
              gender ENUM('Male', 'Female','Other') NOT NULL,
              isKycVerified TINYINT(1) NOT NULL DEFAULT false,
              bcity VARCHAR(255) NOT NULL,
              isActive TINYINT(1) NOT NULL DEFAULT false,
              createdAt DATETIME NOT NULL,
              updatedAt DATETIME,
              CONSTRAINT PK_AccountHolder PRIMARY KEY (customerId)
          )`),
          await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS Account (
            accountNumber BIGINT(8) auto_increment NOT NULL,
            branch VARCHAR(255) NOT NULL,
            balance FLOAT NOT NULL,
            actualBalance FLOAT NOT NULL,
            accountType VARCHAR(255) NOT NULL,
            minimumBalance FLOAT NOT NULL,
            bcity VARCHAR(255) NOT NULL,
            isActive TINYINT(1) NOT NULL DEFAULT false,
            createdAt DATETIME NOT NULL,
            updatedAt DATETIME,
            customerId BIGINT(8) NOT NULL,
            CONSTRAINT PK_Account PRIMARY KEY (accountNumber),
            CONSTRAINT FK_AccountHolder FOREIGN KEY (customerId) REFERENCES AccountHolder(customerId)
        )`),
        ]);
        },
        down: async(queryInterface, Sequelize) => {
            return Promise.all([
                await queryInterface.dropTable('Account'),

                await queryInterface.dropTable('AccountHolder'),
            ]);
        },
    }; 