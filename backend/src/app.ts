import express from "express";
import swaggerUi from "swagger-ui-express";
import { setupSwaggerDoc } from "./config/swager";
import { v1Router }  from '@src/config/routes';

const app = express();
app.use(express.json());
const swaggerDocument = setupSwaggerDoc();
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "Ok" });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument,{
  swaggerOptions : {
    persistAuthorization: true
  }
}));
app.use("/api/v1", v1Router);


export default app;