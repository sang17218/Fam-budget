module.exports = {
    up: async (queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.sequelize.query(`ALTER TABLE Card
            ADD secondaryId BIGINT(8),
            ADD senderSecondary TINYINT(1) NOT NULL DEFAULT false,
            ADD CONSTRAINT FK_SecondaryAccountHolder_Card FOREIGN KEY (secondaryId) REFERENCES SecondaryAccountHolder(secondaryId)`),
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        return Promise.all([
            await queryInterface.dropTable('Card'),
        ]);
    },
};