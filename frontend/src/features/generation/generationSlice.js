import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import generationService from "./generationService"

const initialState = {
  generation: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

// Create generation
export const createGeneration = createAsyncThunk(
  "case/createGeneration",
  async (data, thunkAPI) => {
    try {
      const { caseId, number } = data
      return await generationService.createGeneration(caseId, number)
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

// Get generation
export const getGeneration = createAsyncThunk(
  "case/getGeneration",
  async (generationId, thunkAPI) => {
    try {
      return await generationService.getGeneration(generationId)
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

export const generationSlice = createSlice({
  name: "generation",
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
      .addCase(createGeneration.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createGeneration.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(createGeneration.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getGeneration.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getGeneration.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.generation = action.payload
      })
      .addCase(getGeneration.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { resetAll, resetInfo } = generationSlice.actions
export default generationSlice.reducer
