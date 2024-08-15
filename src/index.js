import express from "express";
import imagesRouter from "./routers/images.router.js";

const app = express();
const port = process.env.IMAGE_RESIZE_PORT;

app.use("/images", imagesRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
