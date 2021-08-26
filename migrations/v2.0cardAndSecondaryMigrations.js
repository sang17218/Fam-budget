module.exports = {
    up: async(queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS SecondaryAccountHolder(
                primaryUserAccountNumber VARCHAR(255) NOT NULL,
                secondaryUserAccountNumber VARCHAR(255) NOT NULL,
                secondaryId VARCHAR(320) NOT NULL,
                relationship VARCHAR(320) NOT NULL,
                isMinor TINYINT(1) NOT NULL DEFAULT false,
                fundsSpent FLOAT NOT NULL,
                fundsAllocated FLOAT NOT NULL,
  
                CONSTRAINT PK_SecondaryAccountHolder PRIMARY KEY (secondaryId),
                CONSTRAINT FK_Account_SAH FOREIGN KEY (primaryUserAccountNumber) REFERENCES Account(accountNumber),
                CONSTRAINT FK_Account_PAH FOREIGN KEY (secondaryUserAccountNumber) REFERENCES Account(accountNumber)
                )`),
        ]);
        },
        down: async(queryInterface, Sequelize) => {
            return Promise.all([
                await queryInterface.dropTable('SecondaryAccountHolder'),
            ]);
        },
    }; 