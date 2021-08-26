module.exports = {
    up: async(queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.sequelize.query(`ALTER TABLE Card ADD pin INTEGER`),
        ]);
        },
        down: async(queryInterface, Sequelize) => {
            return Promise.all([
                // await queryInterface.dropTable('Card'),
            ]);
        },
    }; 