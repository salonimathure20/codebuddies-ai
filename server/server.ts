import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import createDBConn from "./db-init/dbConnection";
import userRoutes from "./service/routers/user-router";
import sessionRoutes from "./service/routers/session-router";
import s3Routes from "./service/routers/s3-router";
import logger from "./utils/logger";
import { init } from "./service/controller/wss-controller";
import profileRoutes from "./service/routers/profile-router";
import initialize from "./service/app";

dotenv.config();
createDBConn();
// Extending express name space to have a user property that is used by the authorize middleware
declare module "express" {
  interface Request {
    user?: any;
  }
}

const app = express();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

initialize(app);

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });

  console.log("res", res);
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Example amount (in cents)
      currency: "usd",
    });

    console.log("PaymentIntent Response:", {
      clientSecret: paymentIntent.client_secret,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
    console.log("res2==", res);
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 3000;

createDBConn().then(() => {
  app
    .listen(parseInt(port.toString()), "0.0.0.0", () => {
      // Listen the express server on the given port and log a message to the logs
      logger.info(`Server is listening on port ${port}`);
    })
    .on("error", (err: any) => {
      // In case of an error, log the error to the logs
      logger.error(JSON.stringify(err));
    });
});

export default app;
