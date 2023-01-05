const express = require("express")
const router = express.Router()
const {
  createGeneration,
  getGeneration,
  getGenerations,
} = require("../controllers/generationController.js")

router.route("/").post(createGeneration)
router.route("/:id").get(getGeneration)

module.exports = router
