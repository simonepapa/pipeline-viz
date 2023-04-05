const express = require("express")
const router = express.Router()
const {
  getHistory,
  putHistory,
} = require("../controllers/historyController.js")

router.route("/").post(putHistory)
router.route("/:id").get(getHistory)

module.exports = router
