module.exports = {
    up: async(queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS Account (
              accountNumber INTEGER auto_increment NOT NULL,
              branch VARCHAR(255) NOT NULL,
              balance VARCHAR(255) NOT NULL,
              accountType VARCHAR(255) NOT NULL,
              minimumBalance FLOAT NOT NULL,
              city VARCHAR(255) NOT NULL,
              is_active TINYINT(1) NOT NULL DEFAULT false,
              created_at DATETIME NOT NULL,
              updated_at DATETIME,
              CONSTRAINT PK_Account PRIMARY KEY (accountNumber)
          )`),
            await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS AccountHolder (
              customerId INTEGER auto_increment NOT NULL,
              accountNumber INTEGER ,
              panNumber INTEGER NOT NULL,
              firstName VARCHAR(255) NOT NULL,
              lastName VARCHAR(255) NOT NULL,
              email VARCHAR(320) NOT NULL,
              mobile INTEGER NOT NULL,
              gender ENUM('Male', 'Female','Other') NOT NULL,
              is_kycVerified TINYINT(1) NOT NULL DEFAULT false,
              bcity VARCHAR(255) NOT NULL,
              is_active TINYINT(1) NOT NULL DEFAULT false,
              created_at DATETIME NOT NULL,
              updated_at DATETIME,
              CONSTRAINT PK_AccountHolder PRIMARY KEY (customerId),
              CONSTRAINT FK_AccountHolder FOREIGN KEY (accountNumber) REFERENCES Account(accountNumber)
          )`)
        ]);
        },
        down: async(queryInterface, Sequelize) => {
            return Promise.all([
                await queryInterface.dropTable('AccountHolder'),
                await queryInterface.dropTable('Account'),
            ]);
        },
    }; 