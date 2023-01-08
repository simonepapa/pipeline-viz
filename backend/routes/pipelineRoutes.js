const express = require("express")
const router = express.Router()
const {
  getPipeline,
  putPipeline,
  //getPipelines
} = require("../controllers/pipelineController.js")

router.route("/").post(putPipeline)//.get(getPipelines)
router.route("/:id").get(getPipeline)

module.exports = router
