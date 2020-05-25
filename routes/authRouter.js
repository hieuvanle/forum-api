const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { bodyValidator, schemas } = require("../middlewares/routeValidator");

router
  .route("/register")
  .post(bodyValidator(schemas.userSchema), authController.register);
router
  .route("/login")
  .post(bodyValidator(schemas.loginSchema), authController.login);

module.exports = router;
