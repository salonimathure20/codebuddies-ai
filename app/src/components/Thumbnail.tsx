import React, { useState } from "react";
import "styles/components/thumbnail.css";

interface ThumbnailProps {
  buddy: string;
  date: string;
  language: string;
  videoUrl: string;
  codePreviewUrl: string;
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  buddy,
  date,
  language,
  videoUrl,
  codePreviewUrl,
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsVideoPlaying(true);
  };

  return (
    <div className="thumbnail-container">
      {/* Media Section */}
      <div className="media-section">
        {!isVideoPlaying ? (
          <div className="code-preview-container">
            <img
              src={codePreviewUrl}
              alt="Code Preview"
              className="code-preview"
            />
            <button className="play-button" onClick={handlePlayClick}>
              ▶
            </button>
          </div>
        ) : (
          <video src={videoUrl} className="video" controls autoPlay muted />
        )}
      </div>
      {/* Details Section */}
      <div className="details">
        <p className="text">
          <strong>Buddy:</strong> {buddy}
        </p>
        <p className="text">
          <strong>Date:</strong> {date}
        </p>
        <p className="text">
          <strong>Language:</strong> {language}
        </p>
      </div>
    </div>
  );
};

export default Thumbnail;
