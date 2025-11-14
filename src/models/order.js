"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Order.belongsTo(models.UserAddress, { foreignKey: "addressId", as: "address" });
      Order.hasMany(models.OrderItem, { foreignKey: "orderId", as: "items" });
    }
  }

  Order.init(
    {
      userId: DataTypes.INTEGER,
      addressId: DataTypes.INTEGER,
      subtotal: DataTypes.DECIMAL(10, 2),
      tax: DataTypes.DECIMAL(10, 2),
      shipping: DataTypes.DECIMAL(10, 2),
      total: DataTypes.DECIMAL(10, 2),
      paymentMethod: DataTypes.STRING,
      paymentStatus: DataTypes.STRING,
      orderStatus: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
    }
  );

  return Order;
};
