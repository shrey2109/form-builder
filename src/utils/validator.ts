import { Field } from "../types";

export function validateField(field: Field, value: any): string | null {
  if (field.required) {
    if (value === undefined || value === null || value === "")
      return "This field is required";
  }
  for (const r of field.validations || []) {
    if (!r.enabled) continue;
    const k = r.kind;
    if (k === "minLength") {
      if (
        typeof value === "string" &&
        r.value !== undefined &&
        value.length < r.value
      )
        return r.message || `Minimum ${r.value} characters`;
    }
    if (k === "maxLength") {
      if (
        typeof value === "string" &&
        r.value !== undefined &&
        value.length > r.value
      )
        return r.message || `Maximum ${r.value} characters`;
    }
    if (k === "minValue") {
      if (
        value !== "" &&
        value !== undefined &&
        Number(value) < (r.value ?? -Infinity)
      )
        return r.message || `Minimum value ${r.value}`;
    }
    if (k === "maxValue") {
      if (
        value !== "" &&
        value !== undefined &&
        Number(value) > (r.value ?? Infinity)
      )
        return r.message || `Maximum value ${r.value}`;
    }
    if (k === "email") {
      const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (typeof value === "string" && value && !re.test(value))
        return r.message || "Invalid email";
    }
    if (k === "passwordRule") {
      const s = String(value || "");
      if (s.length < 8) return r.message || "Password must be at least 8 chars";
      if (!/\d/.test(s)) return r.message || "Password must contain a number";
    }
  }
  return null;
}
