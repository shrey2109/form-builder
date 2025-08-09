# Dynamic Form Builder

A fully dynamic **Form Builder** built with **React, TypeScript, Redux Toolkit, and Material-UI**, with localStorage persistence.  
Users can create, preview, and manage forms — including **custom validations, derived fields, and live preview functionality** — without any backend.

---

## 📌 Features

### 1. Create Forms (/create)

- Add multiple field types:
  - **Text**, **Number**, **Textarea**, **Select**, **Radio**, **Checkbox**, **Date**
- Configure each field:
  - **Label**
  - **Required toggle**
  - **Default value**
  - **Validation rules** (Not empty, Min/Max length, Email format, Password rule, etc.)
- **Derived Fields**:
  - Compute value based on one or more parent fields
  - Example: Age calculated from Date of Birth
- Reorder fields (drag & drop)
- Delete unwanted fields
- Save form configuration to **localStorage** with a custom form name

---

### 2. Preview Forms (/preview)

- Full **end-user view** of the created form
- Supports:
  - **User input**
  - **Real-time validations**
  - **Live derived field updates**
- Error messages shown clearly for invalid inputs

---

### 3. My Forms (/myforms)

- List all saved forms from localStorage
- Display:
  - **Form Name**
  - **Date Created**
- Click to open **Preview** mode for any saved form

---

## 🛠 Tech Stack

- **React 18**
- **TypeScript**
- **Redux Toolkit** (State management)
- **Material UI (MUI)** (UI components)
- **LocalStorage API** (Persistent storage)

---

## 📂 Folder Structure

```

src/
│
├── components/ # Reusable UI components
├── pages/ # Main route pages (/create, /preview, /myforms)
├── redux/ # Redux slices & store
├── types/ # TypeScript type definitions
├── utils/ # Helper functions (validation, derived logic)
└── App.tsx # Main app routes

```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/form-builder.git
cd form-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

---

## 💾 LocalStorage Schema

Each form is saved as an object in `localStorage` under a key like:

```json
{
  "formName": "Employee Registration",
  "createdAt": "2025-08-09T10:30:00Z",
  "fields": [
    {
      "id": "uuid",
      "type": "text",
      "label": "Name",
      "required": true,
      "defaultValue": "",
      "validations": { "minLength": 3 },
      "derived": false
    }
  ]
}
```

---

## 🧪 Evaluation Highlights

- Clean, modular code with **strong TypeScript typings**
- Organized **Redux Toolkit** store for predictable state management
- **Error handling** and **edge case coverage**
- Accurate **preview with validations** and **derived fields**
- **User-friendly MUI-based UI**

---

## 🌐 Live Demo

[Click here to view deployed app](https://yourdeploymentlink.com)
