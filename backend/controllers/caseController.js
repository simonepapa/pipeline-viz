const asyncHandler = require("express-async-handler")

const Case = require("../models/caseModel")
const Generation = require("../models/generationModel")
const Pipeline = require("../models/pipelineModel")

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

// @desc    Get generation cases
// @route   GET /api/:id/cases
// @access  Public
const getGenerationCases = asyncHandler(async (req, res) => {
  const { ids } = req.body
  const pipelines = []
  let tempPipelines = []

  for (let i = 0; i < ids.length; i++) {
    const temp = await Pipeline.find({
      "case.id": req.params.id,
      _id: { $in: ids[i] },
    })
    for (let j = 0; j < temp.length; j++) {
      const pipelineJSON = temp[j].toObject()
      pipelineJSON.edges = []
      pipelineJSON.nodes = []
      pipelineJSON.graph.operator._nodes.map((node, index) => {
        pipelineJSON.nodes[index] = { data: node.content, grabbable: false }
        pipelineJSON.nodes[index].data.id = node.uid
        node._nodes_from.map((link) => {
          pipelineJSON.edges.push({
            data: {
              id: link.toString() + node.uid.toString(),
              source: link.toString(),
              target: node.uid.toString(),
            },
            grabbable: false,
          })
        })
      })
      tempPipelines.push(pipelineJSON)
    }
    pipelines.push(tempPipelines)
    tempPipelines = []
  }

  res.status(200).json(pipelines)
})

module.exports = {
  getCases,
  createCase,
  getCase,
  getGenerations,
  getGenerationCases,
}
