import { configureStore } from "@reduxjs/toolkit"

import authSlice from './authSlice.js'
import chatTopic from './chatTopicSlice.js'

const store = configureStore(
    {
        reducer: {
			authSlice,
            chatTopic
        }
    }
)

export default store