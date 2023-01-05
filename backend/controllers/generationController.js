const asyncHandler = require("express-async-handler")

const Generation = require("../models/generationModel")
const Case = require("../models/caseModel")

// @desc    Create generation
// @route   POST /api/generation
// @access  Public
const createGeneration = asyncHandler(async (req, res) => {
  const { caseId, number } = req.body

  const generation = await Generation.create({
    case: caseId,
    number: number,
  })

  await Case.findByIdAndUpdate(caseId, {
    $push: { generations: generation._id },
  })

  res.status(200).json(generation)
})

// @desc    Get generation
// @route   GET /api/:id/generation
// @access  Public
const getGeneration = asyncHandler(async (req, res) => {
  const generation = await Generation.findById(req.params.id)

  res.status(200).json(generation)
})

module.exports = {
  createGeneration,
  getGeneration,
}
