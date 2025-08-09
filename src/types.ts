export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "derived";

export type ValidationKind =
  | "required"
  | "minLength"
  | "maxLength"
  | "minValue"
  | "maxValue"
  | "email"
  | "passwordRule";

export interface ValidationRule {
  id: string;
  kind: ValidationKind;
  value?: number;
  message?: string;
  enabled: boolean;
}

export interface DerivedConfig {
  parents: string[];
  formula: string;
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  options: string[];
  validations: ValidationRule[];
  derived?: DerivedConfig | null;
  value?: any;
  rules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
}

// export interface Field {
//   id: string;
//   label: string;
//   type: "text" | "checkbox";
//   value?: any;
//   rules?: {
//     required?: boolean;
//     minLength?: number;
//     maxLength?: number;
//   };
// }

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: Field[];
}
