"use strict";

const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");

const secret = speakeasy.generateSecret({ name: "Ecommerce Admin (admin@ecommerce.com)" });
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10); // Change password later securely
    const adminEmail = await process.env.ADMIN_EMAIL;

    await queryInterface.bulkInsert("Admins", [
      {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        twoFactorSecret: secret.base32,
        is2FAEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Admins", { email: "admin@ecommerce.com" });
  },
};
