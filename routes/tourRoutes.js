const express = require("express");
const tourControllers = require("../controllers/toursControllers");

const router = express.Router();

router.param("id", tourControllers.checkId);

router
  .route("/")
  .get(tourControllers.getAllTours)
  .post(tourControllers.checkBody, tourControllers.createDataTours);

router
  .route("/:id")
  .get(tourControllers.getToursById)
  .patch(tourControllers.patchDataTours)
  .delete(tourControllers.deleteDataTours);

module.exports = router;
