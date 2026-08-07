import { ButtonComponent } from "components/Button";
import TextField from "components/Textfield";
import { SingleToggleSwitch } from "components/ToggleButton";
import { useState } from "react";
import "styles/components/form.css";

export type Field = {
  name: string;
  label?: string;
  type: string;
  placeholder?: string;
};

type Props = {
  fields: Field[];
  onSubmit: (formData: Record<string, string>) => void;
  toggleSwitch?: boolean;
  handleToggle?: (state: boolean) => void;
  toggleText?: string;
};

export const Form: React.FC<Props> = ({
  fields,
  onSubmit,
  toggleSwitch,
  handleToggle,
  toggleText,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => {
      acc[field.name] = "";

      return acc;
    }, {} as Record<string, string>)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log("form", formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Pass the form data back to the parent
  };

  return (
    <form className="dynamic-form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="form-field">
          <TextField
            label={field.label ?? ""}
            value={formData[field.name]}
            onChange={(e) => handleChange(e)}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
          />
        </div>
      ))}
      {toggleSwitch && (
        <div className="toggle-div">
          <SingleToggleSwitch defaultState={false} onToggle={handleToggle} />
          <p>{toggleText}</p>
        </div>
      )}
      <ButtonComponent
        value={"Submit"}
        handleClick={handleSubmit}
        id={"form-button"}
      />
    </form>
  );
};
