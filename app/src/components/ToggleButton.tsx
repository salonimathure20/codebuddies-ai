import React, { useState } from "react";
import "styles/components/toggle-button.css";

interface Props {
  defaultState?: boolean;
  onToggle?: (state: boolean) => void;
}

export const SingleToggleSwitch: React.FC<Props> = ({
  defaultState = false,
  onToggle,
}) => {
  const [toggled, setToggled] = useState(defaultState);

  const handleToggle = () => {
    const newState = !toggled;
    setToggled(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div
      className={`switch ${toggled ? "switch-on" : "switch-off"}`}
      onClick={handleToggle}
    >
      <div className="switch-indicator"></div>
    </div>
  );
};
