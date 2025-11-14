const speakeasy = require("speakeasy");

// Replace this with your seeded Admin's twoFactorSecret
const secret = "PVDWYUTPFQ2VMIK2MYZW46DBEZ6VMNR2OI4GIYTUG44XUJCJKARQ";  

const token = speakeasy.totp({
  secret,
  encoding: "base32"
});

console.log("✅ Current OTP:", token);
