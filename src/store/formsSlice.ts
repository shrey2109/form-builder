import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormSchema } from "../types";
import { loadForms } from "../utils/localStorage";
import { v4 as uuidv4 } from "uuid";

interface FormsState {
  list: FormSchema[];
}

const initialState: FormsState = { list: loadForms() };

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    saveForm(state, action: PayloadAction<{ name: string; fields: any[] }>) {
      const form: FormSchema = {
        id: uuidv4(),
        name: action.payload.name,
        createdAt: new Date().toISOString(),
        fields: action.payload.fields,
      };
      state.list.unshift(form);
    },
    deleteForm(state, action: PayloadAction<string>) {
      state.list = state.list.filter((f) => f.id !== action.payload);
    },
  },
});

export const { saveForm, deleteForm } = formsSlice.actions;
export default formsSlice.reducer;
