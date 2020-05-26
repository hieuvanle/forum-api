const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  bodyValidator,
  paramsValidator,
  schemas,
} = require("../middlewares/routeValidator");
const { upload } = require("../middlewares/multer");

//All users
router.route("/").get(userController.getAllUsers);

//Specific user
router
  .route("/:id")
  .get(paramsValidator(schemas.idSchema, "id"), userController.getOne)
  .put(
    paramsValidator(schemas.idSchema, "id"),
    bodyValidator(schemas.optionalUserSchema),
    userController.updateUser
  )
  .delete(paramsValidator(schemas.idSchema, "id"), userController.deleteUser);
//Specific user updates avatar
router.route("/:id/avatar").put(upload.any(), userController.updateAvatar);

//Specific user, all posts
router
  .route("/:id/posts")
  .get(paramsValidator(schemas.idSchema, "id"), userController.getPosts)
  .post(
    paramsValidator(schemas.idSchema, "id"),
    bodyValidator(schemas.postSchema),
    userController.addPost
  );

//Specific user, specific post
router
  .route("/posts/:postId")
  .get(userController.getOnePost)
  .put(
    paramsValidator(schemas.idSchema, "postId"),
    bodyValidator(schemas.postSchema),
    userController.updatePost
  )
  .delete(
    paramsValidator(schemas.idSchema, "postId"),
    userController.deletePost
  );
module.exports = router;
