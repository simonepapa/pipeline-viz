const express = require("express")
const router = express.Router()
const {
  getHistory,
  putHistory
} = require("../controllers/historyController.js")

router.route("/").get(getHistory).post(putHistory)

module.exports = router
