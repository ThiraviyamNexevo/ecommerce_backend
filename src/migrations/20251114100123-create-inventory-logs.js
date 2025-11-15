"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("InventoryLogs", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      productId: { type: Sequelize.INTEGER, allowNull: false },
      change: { type: Sequelize.INTEGER, allowNull: false }, // positive or negative
      reason: { type: Sequelize.STRING, allowNull: false }, // e.g. "order:12", "cancel:12", "admin:update"
      previousQuantity: { type: Sequelize.INTEGER, allowNull: false },
      newQuantity: { type: Sequelize.INTEGER, allowNull: false },
      adminId: { type: Sequelize.INTEGER, allowNull: true }, // optional
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("InventoryLogs");
  },
};
