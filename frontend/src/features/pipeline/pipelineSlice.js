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
  async (_, thunkAPI) => {
    try {
      return await pipelineService.getPipeline()
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
  async (pipelineArray, thunkAPI) => {
    try {
      return await pipelineService.putPipeline(pipelineArray)
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
