import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Field } from "../types";

interface BuilderState {
  fields: Field[];
  selectedId?: string | null;
}

const initialState: BuilderState = { fields: [], selectedId: null };

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    addField(state, action: PayloadAction<Field>) {
      state.fields.push(action.payload);
      state.selectedId = action.payload.id;
    },
    updateField(
      state,
      action: PayloadAction<{ id: string; patch: Partial<Field> }>
    ) {
      const idx = state.fields.findIndex((f) => f.id === action.payload.id);
      if (idx >= 0)
        state.fields[idx] = { ...state.fields[idx], ...action.payload.patch };
    },
    removeField(state, action: PayloadAction<string>) {
      state.fields = state.fields.filter((f) => f.id !== action.payload);
      if (state.selectedId === action.payload)
        state.selectedId = state.fields.length ? state.fields[0].id : null;
    },
    reorderFields(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.fields.length ||
        toIndex >= state.fields.length
      )
        return;
      const [moved] = state.fields.splice(fromIndex, 1);
      state.fields.splice(toIndex, 0, moved);
    },
    setSelected(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    setFields(state, action: PayloadAction<Field[]>) {
      state.fields = action.payload;
      state.selectedId = state.fields.length ? state.fields[0].id : null;
    },
    resetBuilder(state) {
      state.fields = [];
      state.selectedId = null;
    },
  },
});

export const {
  addField,
  updateField,
  removeField,
  reorderFields,
  setSelected,
  setFields,
  resetBuilder,
} = builderSlice.actions;
export default builderSlice.reducer;
