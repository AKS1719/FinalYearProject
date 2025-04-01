import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    topics: [] // Stores user queries
};

const chatTopSlice = createSlice({
    name: "chatTopic",
    initialState,
    reducers: {
		setTopic: (state,action)=>{
			state.topics = action.payload;
		},
        addTopic: (state, action) => {
            state.topics.push(action.payload); // Add new topic
        }
    }
});

export const { setTopic, addTopic } = chatTopSlice.actions;
export default chatTopSlice.reducer;
