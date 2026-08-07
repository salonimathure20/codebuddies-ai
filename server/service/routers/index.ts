import userRoutes from "./user-router";
import sessionRoutes from "./session-router";
import s3Routes from "./s3-router";
import profileRoutes from "./profile-router";
import paymentsRoutes from "./payments-router";

const initializeRoutes = (app: any) => {
  app.use("/api/user", userRoutes);
  app.use("/api/session", sessionRoutes);
  app.use("/api/s3", s3Routes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/payments", paymentsRoutes);
};

export default initializeRoutes;
