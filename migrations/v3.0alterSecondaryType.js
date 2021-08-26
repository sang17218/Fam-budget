module.exports = {
    up: async(queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.sequelize.query(`ALTER TABLE SecondaryAccountHolder MODIFY COLUMN secondaryId VARCHAR(320)`),
        ]);
        },
        down: async(queryInterface, Sequelize) => {
            return Promise.all([
                // await queryInterface.dropTable('SecondaryAccountHolder'),
                // await queryInterface.dropTable('Card'),
            ]);
        },
    }; 