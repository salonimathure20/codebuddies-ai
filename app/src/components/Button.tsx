import React from "react";
import "styles/components/button.css";
import Button from "@mui/material/Button";

//Props interface. Defines all the required props by the component
interface Props {
  value: string; //Text on the button
  styles?: object; //additional styles object
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; //Onclick event handler of the button element
  id: string; //Id of the input field. Would be postfixed with _element
  disabledButton?: boolean | false; //props to disable button ot not default(false)
}

//Common Button Component
export const ButtonComponent: React.FC<Props> = ({
  handleClick,
  value,
  id,
  styles,
  disabledButton,
}) => {
  return (
    <Button
      id={id + "_element"}
      className={"gradient-button"}
      style={styles ? styles : {}}
      sx={styles ? styles : {}}
      onClick={handleClick}
      disabled={disabledButton}
    >
      {value}
    </Button>
  );
};
