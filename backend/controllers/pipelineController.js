const asyncHandler = require("express-async-handler")

const Pipeline = require("../models/pipelineModel")

// @desc    Get pipeline
// @route   GET /api/pipeline
// @access  Public
const getPipeline = asyncHandler(async (req, res) => {
  const pipeline = await Pipeline.findById("63b45abe73de332d62712eb3")
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
  const { pipelineArray } = req.body
  for (const pipelineIndividual of pipelineArray) {
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

    pipeline = await Pipeline.create({
      total_pipeline_operations: pipelineIndividual.total_pipeline_operations,
      depth: pipelineIndividual.depth,
      nodes: pipelineIndividual.nodes,
      preprocessing: pipelineIndividual.preprocessing,
      additional_info: pipelineIndividual.additional_info,
    })
  }

  res.status(200).json("Successful")
})

module.exports = {
  getPipeline,
  putPipeline,
}
