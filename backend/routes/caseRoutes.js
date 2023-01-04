const express = require("express")
const router = express.Router()
const {
  getCases,
  createCase,
} = require("../controllers/caseController.js")

router.route("/").get(getCases).post(createCase)

module.exports = router
