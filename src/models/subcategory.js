"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SubCategory extends Model {
    static associate(models) {
      SubCategory.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
      SubCategory.hasMany(models.Product, {
        foreignKey: "subCategoryId",
        as: "products",
      });
    }
  }

  SubCategory.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "SubCategory",
      tableName: "SubCategories",
    }
  );

  return SubCategory;
};
