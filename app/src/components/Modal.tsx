import React from "react";
import "styles/components/modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  title?: string;
  children?: any;
  style?: any;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title,
  children,
  style,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={style}>
        {!children && (
          <>
            <h2>{title}</h2>
            <p>{message}</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="modal-btn confirm" onClick={onConfirm}>
                Confirm
              </button>
            </div>
          </>
        )}
        {children}
      </div>
    </div>
  );
};
