const express = require("express")
const router = express.Router()
const {
  getCases,
  createCase,
  getCase,
} = require("../controllers/caseController.js")

router.route("/").get(getCases).post(createCase)
router.route("/:id").get(getCase)

module.exports = router
