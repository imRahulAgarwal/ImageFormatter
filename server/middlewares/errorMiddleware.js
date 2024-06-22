const errorMiddleware = async (error, req, res, next) => {
    if (error.statusCode === "ENOENT") {
        error.message = "File not found";
        error.statusCode = 415;
    }

    res.status(error.statusCode).json({ success: false, message: error.message });
};

export default errorMiddleware;
