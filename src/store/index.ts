import { configureStore } from "@reduxjs/toolkit";
import builderReducer from "./builderSlice";
import formsReducer from "./formsSlice";

export const store = configureStore({
  reducer: {
    builder: builderReducer,
    forms: formsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
