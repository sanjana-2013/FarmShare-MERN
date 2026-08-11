import { Schema, model, type HydratedDocument, type Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument {
  name: string;
  email: string;
  password: string;
  farmName: string;
  location: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

type UserModel = Model<UserDocument>;

const userSchema = new Schema<UserDocument, UserModel>(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    farmName: { type: String, required: true, trim: true, minlength: 2 },
    location: { type: String, required: true, trim: true, minlength: 2 },
  },
  { timestamps: true },
);

userSchema.pre("save", async function savePassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<UserDocument, UserModel>("User", userSchema);
export type UserDoc = HydratedDocument<UserDocument>;