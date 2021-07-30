module.exports = {
    up: async(queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.sequelize.query(`ALTER TABLE SecondaryAccountHolder
            ADD fundsAllocated FLOAT NOT NULL`),

            await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS Transaction(
              transactionID INTEGER NOT NULL,
              accountNumber INTEGER NOT NULL,
              merchant VARCHAR(255) NOT NULL,
              description VARCHAR(255) NOT NULL,
              amount FLOAT NOT NULL,
              senderSecondary TINYINT(1) NOT NULL DEFAULT false,
              secondaryId INTEGER,
              transactionStartedAt DATETIME NOT NULL,
              transactionEndedAt DATETIME NOT NULL,
              isSuccessful TINYINT(1) NOT NULL DEFAULT false,
              senderAccountNumber INTEGER NOT NULL,
              receiverAccountNumber INTEGER NOT NULL,
              CONSTRAINT PK_Transaction PRIMARY KEY (transactionID),
              CONSTRAINT FK_SecondaryAccountHolder_T FOREIGN KEY (secondaryId) REFERENCES SecondaryAccountHolder(secondaryId),
              CONSTRAINT FK_Account_T FOREIGN KEY (accountNumber) REFERENCES Account(accountNumber) )`),

            await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS Policy (
              policyId INTEGER NOT NULL,
              accountNumber INTEGER NOT NULL,
              spendLimit FLOAT NOT NULL,
              isSecondaryHolder TINYINT(1) NOT NULL DEFAULT false,
              secondaryId INTEGER,
              created_at DATETIME NOT NULL,
              updated_at DATETIME,
              expirationDate DATETIME,
              isActive TINYINT(1) NOT NULL DEFAULT true,
              CONSTRAINT PK_Policy PRIMARY KEY (policyId),
              CONSTRAINT FK_SecondaryAccountHolder_P FOREIGN KEY (secondaryId) REFERENCES SecondaryAccountHolder(secondaryId),
              CONSTRAINT FK_Account_P FOREIGN KEY (accountNumber) REFERENCES Account(accountNumber) )`),
        ]);
        },
        down: async(queryInterface, Sequelize) => {
            return Promise.all([
                await queryInterface.dropTable('Transaction'),
                await queryInterface.dropTable('Policy'),
            ]);
        },
    }; 