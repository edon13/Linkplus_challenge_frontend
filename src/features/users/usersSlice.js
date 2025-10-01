import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return await res.json();
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    nextId: 11,
    sortField: 'createdAt',
    sortDirection: 'desc',
  },
  reducers: {
    addUser: (state, action) => {
      const newUser = {
        ...action.payload,
        id: state.nextId,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newUser);
      state.nextId += 1;
    },
    updateUser: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.items.findIndex(user => user.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
      }
    },
    deleteUser: (state, action) => {
      state.items = state.items.filter(user => user.id !== action.payload);
    },
    setSortField: (state, action) => {
      state.sortField = action.payload;
    },
    setSortDirection: (state, action) => {
      state.sortDirection = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message || "Failed to fetch users";
      });
  },
});

export const { addUser, updateUser, deleteUser, setSortField, setSortDirection } = usersSlice.actions;
export default usersSlice.reducer;


