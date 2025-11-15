"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class InventoryLog extends Model {
    static associate(models) {
      InventoryLog.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
    }
  }

  InventoryLog.init(
    {
      productId: { type: DataTypes.INTEGER, allowNull: false },
      change: { type: DataTypes.INTEGER, allowNull: false },
      reason: { type: DataTypes.STRING, allowNull: false },
      previousQuantity: { type: DataTypes.INTEGER, allowNull: false },
      newQuantity: { type: DataTypes.INTEGER, allowNull: false },
      adminId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: "InventoryLog",
      tableName: "InventoryLogs",
    }
  );

  return InventoryLog;
};
