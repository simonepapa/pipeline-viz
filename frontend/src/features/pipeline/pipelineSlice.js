import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import pipelineService from "./pipelineService"

const initialState = {
  pipeline: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

// Get pipeline
export const getPipeline = createAsyncThunk(
  "pipeline/getPipeline",
  async (pipelineId, thunkAPI) => {
    try {
      return await pipelineService.getPipeline(pipelineId)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Put pipeline
export const putPipeline = createAsyncThunk(
  "pipeline/putPipeline",
  async (data, thunkAPI) => {
    const {pipelines, caseId, generation} = data
    try {
      return await pipelineService.putPipeline(pipelines, caseId, generation)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const pipelineSlice = createSlice({
  name: "pipeline",
  initialState,
  reducers: {
    resetAll: (state) => initialState,
    resetInfo: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPipeline.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPipeline.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.pipeline = action.payload
      })
      .addCase(getPipeline.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(putPipeline.pending, (state) => {
        state.isLoading = true
      })
      .addCase(putPipeline.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(putPipeline.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { resetAll, resetInfo } = pipelineSlice.actions
export default pipelineSlice.reducer
