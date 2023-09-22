const express = require("express");
const userControllers = require("../controllers/usersControllers");

const router = express.Router();

router.param("id", userControllers.checkId);

router
  .route("/")
  .get(userControllers.getAllUsers)
  .post(userControllers.checkBody, userControllers.createDataUsers);

router
  .route("/:_id")
  .get(userControllers.getUsersById)
  .patch(userControllers.patchDataUsers)
  .delete(userControllers.deleteDataUsers);

module.exports = router;
