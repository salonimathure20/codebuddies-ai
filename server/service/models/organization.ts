import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IOrganization } from "../../interfaces/organization";

interface IOrganizationModel extends IOrganization, Document {
  _id: ObjectId;
}

const organizationSchema = new Schema<IOrganizationModel>(
  {
    name: { type: String, required: true },
    adminIds: [{ type: Schema.Types.ObjectId, required: true }],
  },
  { timestamps: true }
);

const OrganizationModel = mongoose.model<IOrganizationModel>(
  "organizations",
  organizationSchema
);
export default OrganizationModel;
