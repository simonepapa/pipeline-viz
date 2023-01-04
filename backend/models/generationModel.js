const mongoose = require("mongoose")

const generationModel = mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
    },
    number: {
      type: Number
    },
    pipelines: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pipeline",
      type: Array,
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Generation", generationModel)
