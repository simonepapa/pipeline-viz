const asyncHandler = require("express-async-handler")

const History = require("../models/historyModel")

// @desc    Get history
// @route   GET /api/history
// @access  Private
const getHistory = asyncHandler(async (req, res) => {
  const history = await History.findById("63b45abe73de332d62712eb3")
  const historyJSON = history.toObject()
  historyJSON.edges = []
  historyJSON.nodes.map((node, index) => {
    historyJSON.nodes[index] = { data: node, grabbable: false }
    node.id = node.operation_id.toString()
    delete node.operation_id
    node.nodes_from.map((link) => {
      historyJSON.edges.push({
        data: {
          id: link.toString() + node.id.toString(),
          source: link.toString(),
          target: node.id.toString(),
        },
        grabbable: false,
      })
    })
  })

  res.status(200).json(historyJSON)
})

// @desc    Put history
// @route   POST /api/history
// @access  Private
const putHistory = asyncHandler(async (req, res) => {
  const { historyArray } = req.body
  for (const historyIndividual of historyArray) {
    //historyIndividual.edges = []
    //historyIndividual.nodes.map((node, index) => {
    //  historyIndividual.nodes[index] = { data: node, grabbable: false }
    //  node.id = node.operation_id.toString()
    //  delete node.operation_id
    //  node.nodes_from.map((link) => {
    //    historyIndividual.edges.push({
    //      data: {
    //        id: link.toString() + node.id.toString(),
    //        source: link.toString(),
    //        target: node.id.toString(),
    //      },
    //      grabbable: false,
    //    })
    //  })
    //})
    //result = historyIndividual

    history = await History.create({
      total_pipeline_operations: historyIndividual.total_pipeline_operations,
      depth: historyIndividual.depth,
      nodes: historyIndividual.nodes,
      preprocessing: historyIndividual.preprocessing,
      additional_info: historyIndividual.additional_info,
    })
  }

  res.status(200).json("Successful")
})

module.exports = {
  getHistory,
  putHistory,
}
