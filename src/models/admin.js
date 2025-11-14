"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {}
  
  Admin.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      twoFactorSecret: {
        type: DataTypes.STRING,
      },
      is2FAEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastLoginAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Admin",
      tableName: "Admins",
    }
  );

  return Admin;
};
