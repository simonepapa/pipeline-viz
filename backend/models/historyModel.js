const mongoose = require("mongoose")

const historyModel = mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
    },
    _is_multi_objective: {
      type: Boolean
    },
    _tuning_result: {
      type: Object
    },
    archive_history: {
      type: Array
    },
    individuals: {
      type: Array
    },
    individuals_pool: {
      type: Array
    },
    _class_path: {
      type: String
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("History", historyModel)
