"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Review.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
    }
  }

  Review.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      rating: { type: DataTypes.INTEGER, allowNull: false },
      review: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "Reviews",
    }
  );

  return Review;
};
