const asyncHandler = require("express-async-handler")

const Case = require("../models/caseModel")
const Generation = require("../models/generationModel")

// @desc    Get cases
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

// @desc    Get generations
// @route   GET /api/case/:id
// @access  Public
const getCase = asyncHandler(async (req, res) => {
  const singleCase = await Case.findById(req.params.id)

  res.status(200).json(singleCase)
})

// @desc    Get generations
// @route   GET /api/:id/generations
// @access  Public
const getGenerations = asyncHandler(async (req, res) => {
  const { ids } = req.body

  const generations = await Generation.find({
    case: req.params.id,
    _id: { $in: ids },
  })

  res.status(200).json(generations)
})

module.exports = {
  getCases,
  createCase,
  getCase,
  getGenerations,
}
