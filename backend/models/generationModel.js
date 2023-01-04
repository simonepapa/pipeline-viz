const mongoose = require("mongoose")

const generationModel = mongoose.Schema(
  {
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
