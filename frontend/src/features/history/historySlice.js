import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import historyService from "./historyService"

const initialState = {
  history: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

// Get history
export const getHistory = createAsyncThunk(
  "history/getHistory",
  async (historyId, thunkAPI) => {
    try {
      return await historyService.getHistory(historyId)
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

// Put history
export const putHistory = createAsyncThunk(
  "history/putHistory",
  async (data, thunkAPI) => {
    const {history, caseId} = data
    try {
      return await historyService.putHistory(history, caseId)
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

export const historySlice = createSlice({
  name: "history",
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
      .addCase(getHistory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.history = action.payload
      })
      .addCase(getHistory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(putHistory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(putHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(putHistory.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { resetAll, resetInfo } = historySlice.actions
export default historySlice.reducer
