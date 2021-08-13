module.exports = {
    up: async (queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.sequelize.query(`ALTER TABLE SecondaryAccountHolder AUTO_INCREMENT = 1000000`),
            await queryInterface.sequelize.query(`ALTER TABLE SecondaryAccountHolder ADD UNIQUE (email)`)
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        return Promise.all([
            //await queryInterface.dropTable('Card'),
        ]);
    },
};