import express from "express";
import { testValue } from "@shared/test";
import swaggerUi from "swagger-ui-express";
import { setupSwaggerDoc } from "./config/swager";

const app = express();

app.use(express.json());
console.log(testValue);

const swaggerDocument = setupSwaggerDoc();
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument,{
  swaggerOptions : {
    persistAuthorization: true
  }
}));


export default app;