import { FormSchema } from "../types";

const LS_FORMS = "form-builder:forms";
const LS_DRAFT = "form-builder:draft";

export const loadForms = (): FormSchema[] => {
  try {
    const raw = localStorage.getItem(LS_FORMS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveForms = (forms: FormSchema[]) => {
  try {
    localStorage.setItem(LS_FORMS, JSON.stringify(forms));
  } catch {}
};

export const loadDraft = (): any => {
  try {
    const raw = localStorage.getItem(LS_DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveDraft = (draft: any) => {
  try {
    localStorage.setItem(LS_DRAFT, JSON.stringify(draft));
  } catch {}
};

export const clearDraft = () => {
  localStorage.removeItem(LS_DRAFT);
};
