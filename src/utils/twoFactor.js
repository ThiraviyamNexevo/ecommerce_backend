const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

/**
 * Generate a new 2FA secret and QR code URL
 */
exports.generate2FASecret = async (adminEmail) => {
  const secret = speakeasy.generateSecret({
    name: `Ecommerce Admin (${adminEmail})`,
  });

  const qrCode = await qrcode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    qrCode, // return QR code as Base64
  };
};

/**
 * Verify a 2FA token from the authenticator app
 */
exports.verify2FAToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1, // allows slight time skew
  });
};
