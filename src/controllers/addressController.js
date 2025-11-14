const { UserAddress } = require("../models");
const asyncHandler = require("../middleware/asyncHandler");
const { success } = require("../utils/response");

// ➕ Add new address
exports.createAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id; // from token
  const { name, phone, pincode, address, city, state, landmark, isDefault } = req.body;

  if (isDefault) {
    await UserAddress.update({ isDefault: false }, { where: { userId } });
  }

  const newAddress = await UserAddress.create({
    userId,
    name,
    phone,
    pincode,
    address,
    city,
    state,
    landmark,
    isDefault,
  });

  return success(res, "Address added successfully", newAddress, 201);
});

// 📋 Get all addresses
exports.getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addresses = await UserAddress.findAll({ where: { userId } });
  return success(res, "Addresses fetched successfully", addresses);
});

// ✏️ Update address
exports.updateAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const address = await UserAddress.findOne({ where: { id, userId } });
  if (!address) {
    const err = new Error("Address not found");
    err.statusCode = 404;
    throw err;
  }

  if (req.body.isDefault) {
    await UserAddress.update({ isDefault: false }, { where: { userId } });
  }

  await address.update(req.body);
  return success(res, "Address updated successfully", address);
});

// ❌ Delete address
exports.deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const address = await UserAddress.findOne({ where: { id, userId } });
  if (!address) {
    const err = new Error("Address not found");
    err.statusCode = 404;
    throw err;
  }

  await address.destroy();
  return success(res, "Address deleted successfully");
});
