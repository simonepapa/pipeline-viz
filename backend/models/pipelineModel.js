const mongoose = require("mongoose")

const pipelineModel = mongoose.Schema(
  {
    case: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case",
      },
      generation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Generation",
      }
    },
    fitness: {
      type: Object
    },
    graph: {
      type: Object
    },
    metadata: {
      type: Object
    },
    native_generation: {
      type: Number
    },
    parent_operator: {
      type: Object
    },
    uid: {
      type: String
    },
    _class_path: {
      type: String
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Pipeline", pipelineModel)
