const ENV = process.env.ENVIRONMENT;

class ErrorHandler extends Error {
    constructor(error, statusCode) {
        if (ENV === "Development") {
            console.error(error.message);
        }
        super(error.message || "Internal server error");
        this.statusCode = statusCode || 500;
    }
}

export default ErrorHandler;
