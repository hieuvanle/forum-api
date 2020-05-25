const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const {
  paramsValidator,
  bodyValidator,
  schemas,
} = require("../middlewares/routeValidator.js");

router.route("/").get(postController.getAllPosts);

router
  .route("/:id")
  .get(paramsValidator(schemas.idSchema, "id"), postController.getOne);

module.exports = router;
