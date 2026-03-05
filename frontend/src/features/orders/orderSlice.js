import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderAPI from './orderAPI'

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, thunkAPI) => {
  try { return await orderAPI.getOrders() }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, thunkAPI) => {
  try { return await orderAPI.getOrder(id) }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

export const createOrder = createAsyncThunk('orders/create', async (data, thunkAPI) => {
  try { return await orderAPI.createOrder(data) }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

export const updateOrder = createAsyncThunk('orders/update', async ({ id, data }, thunkAPI) => {
  try { return await orderAPI.updateOrder(id, data) }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

export const deleteOrder = createAsyncThunk('orders/delete', async (id, thunkAPI) => {
  try { await orderAPI.deleteOrder(id); return id }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    selected: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
  },
  reducers: {
    resetOrderState: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
    clearSelectedOrder: (state) => {
      state.selected = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.isLoading = true; state.isError = false })
      .addCase(fetchOrders.fulfilled, (state, { payload }) => {
        state.isLoading = false; state.items = payload
      })
      .addCase(fetchOrders.rejected, (state, { payload }) => {
        state.isLoading = false; state.isError = true; state.message = payload
      })

      .addCase(fetchOrder.pending, (state) => { state.isLoading = true; state.isError = false })
      .addCase(fetchOrder.fulfilled, (state, { payload }) => {
        state.isLoading = false; state.selected = payload
      })
      .addCase(fetchOrder.rejected, (state, { payload }) => {
        state.isLoading = false; state.isError = true; state.message = payload
      })

      .addCase(createOrder.pending, (state) => { state.isLoading = true; state.isError = false })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.isLoading = false; state.isSuccess = true
        state.message = 'Order created successfully'
        state.items = [payload, ...state.items]
      })
      .addCase(createOrder.rejected, (state, { payload }) => {
        state.isLoading = false; state.isError = true; state.message = payload
      })

      .addCase(updateOrder.fulfilled, (state, { payload }) => {
        state.isSuccess = true; state.message = 'Order updated'
        state.items = state.items.map((o) => (o._id === payload._id ? payload : o))
        if (state.selected?._id === payload._id) {
          state.selected = { ...state.selected, ...payload }
        }
      })
      .addCase(updateOrder.rejected, (state, { payload }) => {
        state.isError = true; state.message = payload
      })

      .addCase(deleteOrder.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((o) => o._id !== payload)
      })
      .addCase(deleteOrder.rejected, (state, { payload }) => {
        state.isError = true; state.message = payload
      })
  },
})

export const { resetOrderState, clearSelectedOrder } = orderSlice.actions
export default orderSlice.reducer
