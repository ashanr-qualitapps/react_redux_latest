import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authAPI from './authAPI'

const user = JSON.parse(localStorage.getItem('user') || 'null')

const initialState = {
  user: user || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
}

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    return await authAPI.register(userData)
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Registration failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    return await authAPI.login(userData)
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed'
    return thunkAPI.rejectWithValue(message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  authAPI.logout()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.isError = false
        state.message = ''
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isSuccess = false
        state.isError = false
        state.message = ''
      })
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
