const mongoose = require("mongoose")

const caseModel = mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    history: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "History",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Case", caseModel)
