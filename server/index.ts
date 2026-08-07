import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();
// Extending express name space to have a user property that is used by the authorize middleware
declare module "express" {
  interface Request {
    user?: any;
  }
}

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const port = process.env.PORT || 3000;

const createDBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("error");
    process.exit(1);
  }
};

createDBConnection().then(() => {
  app
    .listen(parseInt(port.toString()), "0.0.0.0", () => {
      // Listen the express server on the given port and log a message to the logs
      console.log(`Server is listening on port ${port}`);
    })
    .on("error", (err: any) => {
      // In case of an error, log the error to the logs
      console.log(JSON.stringify(err));
    });
});

export default app;
