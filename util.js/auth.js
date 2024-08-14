const { sign, verify } = require("jsonwebtoken");
const { compare } = require("bcrypt");
const { NotAuthError } = require("./error");

const key = "supersecret";

function createJSONToken(email) {
  return sign({ email }, KEY, { expireIn: "1h" });
}

function validateJSONToken(token) {
  return verify(token, KEY);
}

function isValidPassword(password, storePassword) {
  return compare(password, storePassword);
}

function checkAuthMiddleware(req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  if (!req.headers.authorization) {
    console.log("NOT AUTH. AUTH HEADER MISSING");
    return next(new NotAuthError("Not authenticated."));
  }

  const authFragments = req.headers.authorization.split(" ");

  if (authFragments.length !== 2) {
    console.log("Not Auth, Auth Header Invalid.");
    return next(new NotAuthError("Not Authenticated."));
  }

  const authToken = authFragments[1];
  try {
    const validatedToken = validateJSONToken(authToken);
    req.token = validatedToken;
  } catch (err) {
    console.log("NOT AUTH. TOKEN INVALID.");
    return next(new NotAuthError("Not authenticated."));
  }
  next();
}

exports.createJSONToken = createJSONToken;
exports.validateJSONToken = validateJSONToken;
exports.isValidPassword = isValidPassword;
exports.checkAuth = checkAuthMiddleware;
