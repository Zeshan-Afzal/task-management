class ErrorHandler extends Error {
    constructor(message, statusCode = 500, errorDetails = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorDetails = errorDetails;

     
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;
