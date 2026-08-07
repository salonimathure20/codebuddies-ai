import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import "styles/components/textfield.css";

interface TextFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder = "",
  value,
  type,
  onChange,
  name,
  onBlur,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <div className="textfield-container">
      <label className="textfield-label">{label}</label>
      <input
        className="textfield-input"
        type={
          type === "password" ? (isPasswordVisible ? "text" : "password") : type
        }
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
      />
      {type === "password" && (
        <div
          className="visibility-div"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? (
            <VisibilityOutlined className="icon" />
          ) : (
            <VisibilityOffOutlined className="icon" />
          )}
        </div>
      )}
    </div>
  );
};

export default TextField;
