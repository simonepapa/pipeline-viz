const express = require("express")
const router = express.Router()
const {
  createGeneration,
  getGeneration,
} = require("../controllers/generationController.js")

router.route("/").post(createGeneration)
router.route("/:id").get(getGeneration)

module.exports = router
