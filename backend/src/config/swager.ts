import path from "path";
import fs from "fs";

export const setupSwaggerDoc = () => {

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../docs/swagger/bundled.json"), "utf-8")
);
return swaggerDocument
};

