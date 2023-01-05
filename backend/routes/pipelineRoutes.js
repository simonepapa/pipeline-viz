const express = require("express")
const router = express.Router()
const {
  getPipeline,
  putPipeline
} = require("../controllers/pipelineController.js")

router.route("/").post(putPipeline)
router.route("/:id").get(getPipeline)

module.exports = router
