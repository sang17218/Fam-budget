module.exports = {
    up: async(queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS SecondaryAccountHolder(
              accountNumber BIGINT(8) NOT NULL,
              secondaryId BIGINT(8) auto_increment NOT NULL,
              panNumber VARCHAR(255) NOT NULL,
              firstName VARCHAR(255) NOT NULL,
              lastName VARCHAR(255) NOT NULL,
              email VARCHAR(320) NOT NULL,
              relationship VARCHAR(320) NOT NULL,
              mobile  VARCHAR(255) NOT NULL,
              gender ENUM('Male', 'Female','Other') NOT NULL,
              isKycVerified TINYINT(1) NOT NULL DEFAULT false,
              bcity VARCHAR(255) NOT NULL,
              isMinor TINYINT(1) NOT NULL DEFAULT false,
              isActive TINYINT(1) NOT NULL DEFAULT false,
              createdAt DATETIME NOT NULL,
              updatedAt DATETIME,
              CONSTRAINT PK_SecondaryAccountHolder PRIMARY KEY (secondaryId),
              CONSTRAINT FK_Account_SAH FOREIGN KEY (accountNumber) REFERENCES Account(accountNumber)
          )`),
            await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS Card (
              cardNumber VARCHAR(255) NOT NULL,
              accountNumber BIGINT(8) NOT NULL,
              type VARCHAR(255) NOT NULL,
              cvv INTEGER NOT NULL,
              expiryPeriod DATETIME NOT NULL,
              CONSTRAINT PK_Card PRIMARY KEY (cardNumber),
              CONSTRAINT FK_Account_C FOREIGN KEY (accountNumber) REFERENCES Account(accountNumber)
          )`)
        ]);
        },
        down: async(queryInterface, Sequelize) => {
            return Promise.all([
                await queryInterface.dropTable('SecondaryAccountHolder'),
                await queryInterface.dropTable('Card'),
            ]);
        },
    }; 