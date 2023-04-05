const asyncHandler = require("express-async-handler")

const History = require("../models/historyModel")
const Case = require("../models/caseModel")

// @desc    Get history
// @route   GET /api/history/:id
// @access  Public
const getHistory = asyncHandler(async (req, res) => {
  const history = await History.findById(req.params.id)

  res.status(200).json(history)
})

// @desc    Put history
// @route   POST /api/history
// @access  Public
const putHistory = asyncHandler(async (req, res) => {
  const { history, caseId } = req.body

  const newHistory = await History.create({
    caseId: caseId,
    _is_multi_objective: history._is_multi_objective,
    _tuning_result: history._tuning_result,
    archive_history: history.archive_history,
    individuals: history.individuals,
    individuals_pool: history.individuals_pool,
    _class_path: history._class_path
  })
  await Case.findByIdAndUpdate(caseId, { history: newHistory._id })

  res.status(200).json("Successful")
})

module.exports = {
  getHistory,
  putHistory,
}
