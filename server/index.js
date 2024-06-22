import express from "express";
import cors from "cors";
import imageRouter from "./routes/imageRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import createTempFolder from "./utils/createTempFolder.js";

const app = express();

const PORT = process.env.PORT;
const ORIGINS = process.env.ALLOWED_ORIGINS;
const origin = ORIGINS.split(",").filter((origin) => origin !== "");

createTempFolder();
app.use(express.raw({ type: "application/octet-stream", limit: "2MB" }));
app.use(express.json({ limit: "1MB", type: "application/json" }));
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin,
        methods: ["POST"],
    })
);
app.use("/api/images", imageRouter);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
