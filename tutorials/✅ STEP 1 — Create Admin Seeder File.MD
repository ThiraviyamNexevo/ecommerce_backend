✅ STEP 1 — Create Admin Seeder File

Run this command in your project root:

npx sequelize-cli seed:generate --name seed-admin-account


It will generate a file inside:

src/seeders/xxxxxx-seed-admin-account.js

✅ STEP 2 — Edit the Seeder File

Open that file and replace its content with this:

📄 src/seeders/xxxxxx-seed-admin-account.js

"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10); // Change password later securely

    await queryInterface.bulkInsert("Admins", [
      {
        name: "Super Admin",
        email: "admin@ecommerce.com",
        password: hashedPassword,
        is2FAEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Admins", { email: "admin@ecommerce.com" });
  },
};

✅ STEP 3 — Run the Seeder

Run this command:

npx sequelize-cli db:seed:all


Expected output:

== Seeders Executing ==
✔ xxxxxxx-seed-admin-account.js -> Executed successfully.


To undo just this one seeder:

npx sequelize-cli db:seed:undo --seed src/seeders/xxxxxx-seed-admin-account.js


To undo all seeders:

npx sequelize-cli db:seed:undo:all