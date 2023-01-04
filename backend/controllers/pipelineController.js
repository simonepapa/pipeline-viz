const asyncHandler = require("express-async-handler")

const Pipeline = require("../models/pipelineModel")
const Generation = require("../models/generationModel")

// @desc    Get pipeline
// @route   GET /api/pipeline
// @access  Public
const getPipeline = asyncHandler(async (req, res) => {
  const pipeline = await Pipeline.findById(req.params.id)
  const pipelineJSON = pipeline.toObject()
  pipelineJSON.edges = []
  pipelineJSON.nodes.map((node, index) => {
    pipelineJSON.nodes[index] = { data: node, grabbable: false }
    node.id = node.operation_id.toString()
    delete node.operation_id
    node.nodes_from.map((link) => {
      pipelineJSON.edges.push({
        data: {
          id: link.toString() + node.id.toString(),
          source: link.toString(),
          target: node.id.toString(),
        },
        grabbable: false,
      })
    })
  })

  res.status(200).json(pipelineJSON)
})

// @desc    Put pipeline
// @route   POST /api/pipeline
// @access  Public
const putPipeline = asyncHandler(async (req, res) => {
  const { pipelines, caseId, generation } = req.body

  const generationToUpdate = await Generation.findById(generation)

  for (const pipeline of pipelines) {
    //pipelineIndividual.edges = []
    //pipelineIndividual.nodes.map((node, index) => {
    //  pipelineIndividual.nodes[index] = { data: node, grabbable: false }
    //  node.id = node.operation_id.toString()
    //  delete node.operation_id
    //  node.nodes_from.map((link) => {
    //    pipelineIndividual.edges.push({
    //      data: {
    //        id: link.toString() + node.id.toString(),
    //        source: link.toString(),
    //        target: node.id.toString(),
    //      },
    //      grabbable: false,
    //    })
    //  })
    //})
    //result = pipelineIndividual

    const newPipeline = await Pipeline.create({
      "case.id": caseId,
      "case.generation": generation,
      total_pipeline_operations: pipeline.total_pipeline_operations,
      depth: pipeline.depth,
      nodes: pipeline.nodes,
      preprocessing: pipeline.preprocessing,
      additional_info: pipeline.additional_info,
    })
    await Generation.findByIdAndUpdate(generation, { $push: { pipelines: newPipeline._id } })
  }

  res.status(200).json("Successful")
})

module.exports = {
  getPipeline,
  putPipeline,
}
