import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderItemAPI from './orderItemAPI'

export const fetchOrderItems = createAsyncThunk('orderItems/fetchByOrder', async (orderId, thunkAPI) => {
  try { return await orderItemAPI.getOrderItems(orderId) }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

export const createOrderItem = createAsyncThunk('orderItems/create', async (data, thunkAPI) => {
  try { return await orderItemAPI.createOrderItem(data) }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

export const updateOrderItem = createAsyncThunk('orderItems/update', async ({ id, data }, thunkAPI) => {
  try { return await orderItemAPI.updateOrderItem(id, data) }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

export const deleteOrderItem = createAsyncThunk('orderItems/delete', async (id, thunkAPI) => {
  try { await orderItemAPI.deleteOrderItem(id); return id }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

const orderItemSlice = createSlice({
  name: 'orderItems',
  initialState: {
    items: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    clearOrderItems: (state) => { state.items = [] },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderItems.pending, (state) => { state.isLoading = true; state.isError = false })
      .addCase(fetchOrderItems.fulfilled, (state, { payload }) => {
        state.isLoading = false; state.items = payload
      })
      .addCase(fetchOrderItems.rejected, (state, { payload }) => {
        state.isLoading = false; state.isError = true; state.message = payload
      })

      .addCase(createOrderItem.fulfilled, (state, { payload }) => {
        state.items = [...state.items, payload]
      })
      .addCase(createOrderItem.rejected, (state, { payload }) => {
        state.isError = true; state.message = payload
      })

      .addCase(updateOrderItem.fulfilled, (state, { payload }) => {
        state.items = state.items.map((i) => (i._id === payload._id ? payload : i))
      })
      .addCase(updateOrderItem.rejected, (state, { payload }) => {
        state.isError = true; state.message = payload
      })

      .addCase(deleteOrderItem.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((i) => i._id !== payload)
      })
      .addCase(deleteOrderItem.rejected, (state, { payload }) => {
        state.isError = true; state.message = payload
      })
  },
})

export const { clearOrderItems } = orderItemSlice.actions
export default orderItemSlice.reducer
