"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
      Product.belongsTo(models.SubCategory, {
        foreignKey: "subCategoryId",
        as: "subCategory",
      });
      Product.hasMany(models.Review, {
        foreignKey: "productId",
        as: "reviews",
      });
    }
  }

  Product.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      image: { type: DataTypes.STRING, allowNull: true },
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
      subCategoryId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
    }
  );

  return Product;
};
