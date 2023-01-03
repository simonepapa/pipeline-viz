const asyncHandler = require("express-async-handler")

const History = require("../models/historyModel")

// @desc    Get history
// @route   GET /api/history
// @access  Private
const getHistory = asyncHandler(async (req, res) => {
  const history = await History.findById("63b2fe24ff8dfdc5f056ef77")
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

module.exports = {
  getHistory,
}
