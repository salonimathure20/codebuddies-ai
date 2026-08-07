import { Field, Form } from "components/Form";
import { Header } from "components/Header";
import { Navbar } from "components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProfile } from "services/profile-service";
import "styles/pages/user-profile.css";
import AvatarImg from "assets/avatar.png";
import { useAuth } from "hooks/use-auth";
import { uploadProfilePictureToS3 } from "services/s3-service";
import { useDispatch } from "react-redux";
import { showSnackbar } from "store/snackbar-store";

export const ProfileForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>(); // To preview the selected image

  const { user } = useAuth();

  const handleProfileCreate = async (formData: Record<string, string>) => {
    const {
      Bio: bio,
      TechSkills: techSkills,
      PreviousExperience: previousExperience,
    } = formData;

    try {
      let uploadedProfilePictureUrl = "";

      // Step 1: Upload profile picture to S3
      if (profilePicture) {
        const response = await uploadProfilePictureToS3(
          user?.id!,
          profilePicture
        );
        uploadedProfilePictureUrl = response.imgUrl;
      }

      // Step 2: Create profile with S3 URL
      await createProfile({
        userId: user?.id!,
        bio,
        techSkills: techSkills.split(","),
        previousExperience,
        profilePicture: uploadedProfilePictureUrl, // Use the uploaded picture URL
      });
      dispatch(
        showSnackbar({
          message: "Profile creation Successful!",
          severity: "success",
        })
      );
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating profile:", err);
      setError("Profile creation failed. Please try again.");
    }
  };

  const formFields: Array<Field> = [
    {
      name: "Bio",
      type: "text",
      label: "Bio",
      placeholder: "Tell us about yourself",
    },
    {
      name: "TechSkills",
      type: "text",
      label: "Tech Skills (comma separated)",
      placeholder: "JavaScript, React, Node.js",
    },
    {
      name: "PreviousExperience",
      type: "text",
      label: "Previous Experience",
      placeholder: "Describe your previous experience",
    },
  ];

  // Function to handle the file input click via avatar
  const handleFileInputClick = () => {
    document.getElementById("file-upload")?.click();
  };

  return (
    <>
      <Header headerLabel="Account Settings" />
      <Navbar avatarImgSrc={AvatarImg} />
      <div className="profile-form-main">
        <div className="profile-form-text">
          <h1>Create Your Profile</h1>
        </div>

        {/* Profile Picture Upload Section */}
        <div className="profile-picture-upload-container">
          <div className="profile-picture-upload">
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(event) => {
                if (event.target.files && event.target.files[0]) {
                  const file = event.target.files[0];
                  setProfilePicture(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfilePictureUrl(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ display: "none" }} // Hide the default input
            />
            {/* Avatar is now clickable */}
            <div
              className="avatar"
              onClick={handleFileInputClick} // Trigger file input when clicked
            >
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className="profile-picture-img"
                />
              ) : (
                <div className="default-avatar">+</div> // Default avatar
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <Form fields={formFields} onSubmit={handleProfileCreate} />

        {error && <p className="error-text">{error}</p>}
      </div>
    </>
  );
};
