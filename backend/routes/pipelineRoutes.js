const express = require("express")
const router = express.Router()
const {
  getPipeline,
  putPipeline
} = require("../controllers/pipelineController.js")

router.route("/").get(getPipeline).post(putPipeline)

module.exports = router
