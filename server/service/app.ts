import initializeRoutes from "./routers/index";

import cors from "cors";
import bodyParser from "body-parser";
import { init } from "./controller/wss-controller";

const initialize = async (app: any) => {
  const WEB_SOCKET_PORT = 8090;

  init(WEB_SOCKET_PORT);

  app.use(cors());
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
  app.disable("etag");

  initializeRoutes(app);
};

export default initialize;
