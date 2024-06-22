import sharp from "sharp";
import fs from "fs";
import ErrorHandler from "../utils/ErrorHandler.js";
import supportedFormats from "../utils/constants.js";
import { createHash } from "crypto";

const listSupportedFormats = async (req, res, next) => {
    return res.status(200).json({ success: true, formats: supportedFormats });
};

// This changes the format of the image and also reduces it disk size
const changeImageFormat = async (req, res, next) => {
    try {
        const { name, currentChunk, totalChunks, extension } = req.query;

        if (!extension || !supportedFormats.includes(extension)) {
            return next(new ErrorHandler("Format not supported", 400));
        }

        const firstChunk = parseInt(currentChunk) === 0;
        const lastChunk = parseInt(currentChunk) === parseInt(totalChunks);
        const currentImageExtension = name.split(".")[1] || ".jpg";

        if (currentImageExtension === extension) {
            return next(new ErrorHandler("Trying to convert to same image format", 400));
        }

        const data = req.body.toString().split(",")[1];
        const buffer = Buffer.from(data, "base64");

        const tempImageFile = `./temp/temp_${createHash("md5")
            .update(name + req.ip)
            .digest("hex")}.${currentImageExtension}`;

        if (firstChunk && fs.existsSync(tempImageFile)) {
            fs.unlinkSync(tempImageFile);
        }

        fs.appendFileSync(tempImageFile, buffer, { flag: "a+" });

        if (lastChunk) {
            // This extension is the specific extension in which the file will be converted
            const transform = sharp().toFormat(extension);
            switch (extension) {
                case "jpeg":
                    transform.jpeg();
                    break;
                case "png":
                    transform.png();
                    break;
                case "webp":
                    transform.webp();
                    break;
                case "avif":
                    transform.avif({ effort: 1, quality: 80 });
                    break;
            }

            const readableStream = fs.createReadStream(tempImageFile);
            const chunks = [];

            readableStream
                .pipe(transform)
                .on("data", (chunk) => {
                    chunks.push(chunk);
                })
                .on("end", () => {
                    if (fs.existsSync(tempImageFile)) {
                        fs.unlinkSync(tempImageFile);
                    }

                    const buffer = Buffer.concat(chunks);
                    const header = {
                        "Content-Type": `image/${extension}`,
                        "Content-Length": buffer.length,
                    };

                    res.writeHead(206, header);
                    return res.end(buffer);
                })
                .on("error", (err) => {
                    return next(new ErrorHandler(err));
                });
        } else {
            return res.status(200).json({ success: true, message: "Current chunk uploaded." });
        }
    } catch (error) {
        return next(new ErrorHandler(error));
    }
};

const changeImageHeightWidth = async (req, res, next) => {
    try {
        const { name, currentChunk, totalChunks, height, width } = req.query;

        const firstChunk = parseInt(currentChunk) === 0;
        const lastChunk = parseInt(currentChunk) === parseInt(totalChunks);
        const currentImageExtension = name.split(".")[1] || ".jpg";

        const data = req.body.toString().split(",")[1];

        const buffer = Buffer.from(data, "base64");
        const tempImageFile = `./temp/temp_${createHash("md5")
            .update(name + req.ip)
            .digest("hex")}.${currentImageExtension}`;

        if (firstChunk && fs.existsSync(tempImageFile)) {
            fs.unlinkSync(tempImageFile);
        }

        fs.appendFileSync(tempImageFile, buffer, { flag: "a+" });

        if (lastChunk) {
            const readableStream = fs.createReadStream(tempImageFile);
            const chunks = [];

            const transform = sharp().resize({
                fit: "fill",
                height: parseInt(height) ? parseInt(height) : null,
                width: parseInt(width) ? parseInt(width) : null,
            });

            readableStream
                .pipe(transform)
                .on("data", (chunk) => {
                    chunks.push(chunk);
                })
                .on("end", () => {
                    if (fs.existsSync(tempImageFile)) {
                        fs.unlinkSync(tempImageFile);
                    }

                    const buffer = Buffer.concat(chunks);
                    const header = {
                        "Content-Type": `image/${currentImageExtension}`,
                        "Content-Length": buffer.length,
                    };

                    res.writeHead(206, header);
                    return res.end(buffer);
                })
                .on("error", (err) => {
                    return next(new ErrorHandler(err));
                });
        } else {
            return res.status(200).json({ success: true, message: "Current chunk uploaded." });
        }
    } catch (error) {
        return next(new ErrorHandler(error));
    }
};

export default { listSupportedFormats, changeImageFormat, changeImageHeightWidth };
