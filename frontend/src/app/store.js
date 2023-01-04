import { configureStore } from "@reduxjs/toolkit"
import pipelineReducer from "../features/pipeline/pipelineSlice"
import caseReducer from "../features/case/caseSlice"

export const store = configureStore({
  reducer: {
    case: caseReducer,
    pipeline: pipelineReducer,
  },
})
