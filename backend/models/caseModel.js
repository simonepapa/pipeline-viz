const mongoose = require("mongoose")

const caseModel = mongoose.Schema(
  {
    name: {
      type: String,
    },
    generations: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Generation",
      type: Array,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Case", caseModel)
