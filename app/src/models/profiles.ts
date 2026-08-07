export interface IProfile {
  _id: string;
  userId: string;
  bio?: string;
  techSkills?: string[];
  previousExperience?: string;
  profilePicture?: string;
}
