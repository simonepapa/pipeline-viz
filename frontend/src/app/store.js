import { configureStore } from "@reduxjs/toolkit"
import caseReducer from "../features/case/caseSlice"
import historyReducer from "../features/history/historySlice"

export const store = configureStore({
  reducer: {
    case: caseReducer,
    history: historyReducer,
  },
})
