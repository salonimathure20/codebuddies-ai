import { Request, Response } from "express";
import { Profile } from "../models/profile";

export const createProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, bio, techSkills, previousExperience, profilePicture } =
      req.body;
    const profile = new Profile({
      userId,
      bio,
      techSkills,
      previousExperience,
      profilePicture,
    });
    await profile.save();
    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create profile" });
  }
};

export const getProfileByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Find the profile by userId
    const profile = await Profile.findOne({ userId: id });

    // If profile not found, send a 404 response
    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return; // Explicitly return to stop further execution
    }

    // If profile is found, send a 200 response with the profile
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);

    // If there's an error during execution, send a 500 response
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { profileId } = req.params;
    const updates = req.body;
    const profile = await Profile.findByIdAndUpdate(profileId, updates, {
      new: true,
    });
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
