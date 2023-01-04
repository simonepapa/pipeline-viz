const asyncHandler = require("express-async-handler")

const Case = require("../models/caseModel")

// @desc    Create case
// @route   GET /api/case
// @access  Public
const getCases = asyncHandler(async (req, res) => {
  const cases = await Case.find()

  res.status(200).json(cases)
})

// @desc    Create case
// @route   POST /api/case
// @access  Public
const createCase = asyncHandler(async (req, res) => {
  const { name, description } = req.body

  const newCase = await Case.create({
    name,
    description,
  })

  res.status(200).json(newCase)
})

module.exports = {
  getCases,
  createCase,
}
