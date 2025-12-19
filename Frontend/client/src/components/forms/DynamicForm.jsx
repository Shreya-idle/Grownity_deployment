import { useState } from "react";
import FormField from "./FormField";

export default function DynamicForm({ schema, onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      {schema.map((q, index) => (
        <FormField key={index} field={q} onChange={handleChange} />
      ))}

      <button type="submit">Submit</button>
    </form>
  );
}
