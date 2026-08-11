import type { UserDoc } from "../models/User";

export function toPublicUser(user: UserDoc) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    farmName: user.farmName,
    location: user.location,
    createdAt: user.createdAt,
  };
}