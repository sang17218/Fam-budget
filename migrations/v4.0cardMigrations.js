module.exports = {
    up: async(queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS Card (
              cardNumber VARCHAR(255) NOT NULL,
              accountNumber VARCHAR(255) NOT NULL,
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
                await queryInterface.dropTable('Card'),
            ]);
        },
    }; 