---
name: MongoDB Atlas setup
description: The project-specific choice and environment constraint for FarmShare's external MongoDB database.
---

FarmShare uses MongoDB Atlas through the `MONGODB_URI` environment secret rather than a platform-managed database connector. JWT signing uses the separate `JWT_SECRET` secret.

**Why:** MongoDB Atlas was an explicit product requirement, and no managed MongoDB integration was available in this environment.

**How to apply:** Keep credentials in Replit Secrets, never in source or chat. The API should fail clearly at startup when either required secret is absent.