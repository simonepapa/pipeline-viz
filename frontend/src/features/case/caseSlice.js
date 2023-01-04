import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import caseService from "./caseService"

const initialState = {
  cases: [],
  singleCase: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

// Get cases
export const getCases = createAsyncThunk(
  "case/getCases",
  async (name, thunkAPI) => {
    try {
      return await caseService.getCases(name)
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

// Create case
export const createCase = createAsyncThunk(
  "case/createCase",
  async (caseData, thunkAPI) => {
    try {
      const {name, description} = caseData
      return await caseService.createCase(name, description)
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

// Get case
export const getCase = createAsyncThunk(
  "case/getCase",
  async (caseId, thunkAPI) => {
    try {
      return await caseService.getCase(caseId)
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
  name: "case",
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
      .addCase(getCases.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCases.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.cases = action.payload
      })
      .addCase(getCases.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createCase.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createCase.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.cases.push(action.payload)
      })
      .addCase(createCase.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getCase.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCase.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.singleCase = action.payload
      })
      .addCase(getCase.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { resetAll, resetInfo } = pipelineSlice.actions
export default pipelineSlice.reducer
