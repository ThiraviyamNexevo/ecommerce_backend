"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },

      addressId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "UserAddresses", key: "id" },
        onDelete: "SET NULL",
      },

      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      tax: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },

      shipping: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },

      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      paymentMethod: {
        type: Sequelize.ENUM("COD", "ONLINE"),
        defaultValue: "COD",
      },

      paymentStatus: {
        type: Sequelize.ENUM("PENDING", "PAID", "FAILED"),
        defaultValue: "PENDING",
      },

      orderStatus: {
        type: Sequelize.ENUM(
          "PENDING",
          "CONFIRMED",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED"
        ),
        defaultValue: "PENDING",
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Orders");
  },
};
