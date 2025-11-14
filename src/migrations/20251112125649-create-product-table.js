"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: Sequelize.STRING,
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      categoryId: {
        type: Sequelize.INTEGER,
        references: { model: "Categories", key: "id" },
        onDelete: "CASCADE",
      },
      subCategoryId: {
        type: Sequelize.INTEGER,
        references: { model: "SubCategories", key: "id" },
        onDelete: "SET NULL",
      },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Products");
  },
};
