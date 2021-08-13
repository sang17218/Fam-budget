module.exports = {
    up: async (queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.sequelize.query(`ALTER TABLE AccountHolder AUTO_INCREMENT = 10000000`),
            await queryInterface.sequelize.query(`ALTER TABLE AccountHolder ADD UNIQUE (email)`)
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.dropTable('Card'),
        ]);
    },
};