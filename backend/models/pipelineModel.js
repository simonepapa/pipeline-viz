const mongoose = require("mongoose")

const pipelineModel = mongoose.Schema(
  {
    total_pipeline_operations: {
      type: Array,
    },
    depth: {
      type: Number,
    },
    nodes: {
      type: Array,
    },
    preprocessing: {
      type: Array,
    },
    additional_info: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Pipeline", pipelineModel)
