import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};
  const deletePostAPI = async (postId, token) => {
    const response = await fetch(`http://localhost:3001/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to delete post");
    }
  };


// Async thunk for deleting a post
export const deletePostAsync = createAsyncThunk(
  "auth/deletePost",
  async (postId, { getState }) => {
    const { token } = getState().auth;
    try {
      const response = await deletePostAPI(postId, token);
      return response.data; // Assuming the API returns relevant data
    } catch (error) {
      console.error("Error deleting post:", error.message);
      throw error;
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;
