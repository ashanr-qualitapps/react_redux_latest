import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productAPI from './productAPI'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, thunkAPI) => {
  try { return await productAPI.getProducts(params) }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

export const createProduct = createAsyncThunk('products/create', async (data, thunkAPI) => {
  try { return await productAPI.createProduct(data) }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, thunkAPI) => {
  try { return await productAPI.updateProduct(id, data) }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
  try { await productAPI.deleteProduct(id); return id }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    total: 0,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
  },
  reducers: {
    resetProductState: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; state.isError = false })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.items = payload.products
        state.total = payload.total
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.isLoading = false; state.isError = true; state.message = payload
      })

      .addCase(createProduct.pending, (state) => { state.isLoading = true; state.isError = false })
      .addCase(createProduct.fulfilled, (state, { payload }) => {
        state.isLoading = false; state.isSuccess = true
        state.message = 'Product created successfully'
        state.items = [payload, ...state.items]
        state.total += 1
      })
      .addCase(createProduct.rejected, (state, { payload }) => {
        state.isLoading = false; state.isError = true; state.message = payload
      })

      .addCase(updateProduct.pending, (state) => { state.isLoading = true; state.isError = false })
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        state.isLoading = false; state.isSuccess = true
        state.message = 'Product updated successfully'
        state.items = state.items.map((p) => (p._id === payload._id ? payload : p))
      })
      .addCase(updateProduct.rejected, (state, { payload }) => {
        state.isLoading = false; state.isError = true; state.message = payload
      })

      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((p) => p._id !== payload)
        state.total = Math.max(0, state.total - 1)
      })
      .addCase(deleteProduct.rejected, (state, { payload }) => {
        state.isError = true; state.message = payload
      })
  },
})

export const { resetProductState } = productSlice.actions
export default productSlice.reducer
