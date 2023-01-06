const express = require("express")
const router = express.Router()
const {
  getCases,
  createCase,
  getCase,
  getGenerations,
  getGenerationCases,
} = require("../controllers/caseController.js")

router.route("/").get(getCases).post(createCase)
router.route("/:id").get(getCase)
router.route("/:id/generations").post(getGenerations)
router.route("/:id/cases").post(getGenerationCases)

module.exports = router
