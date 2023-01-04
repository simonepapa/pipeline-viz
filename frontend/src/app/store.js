import { configureStore } from "@reduxjs/toolkit"
import pipelineReducer from "../features/pipeline/pipelineSlice"
import caseReducer from "../features/case/caseSlice"
import generationReducer from "../features/generation/generationSlice"

export const store = configureStore({
  reducer: {
    case: caseReducer,
    pipeline: pipelineReducer,
    generation: generationReducer,
  },
})
