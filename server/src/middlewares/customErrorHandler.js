

const customErrorHandler = (err, req, res, next) => {
    let { message, statusCode, errorDetails } = err;
    statusCode = statusCode || 500;
    message = message || "Internal Server Error";

  
    if (err.name === "CastError") {
        message = `Invalid ${err.path}: ${err.value}`;
        statusCode = 400;
    } 

    if (err.code === 11000) {
        message = "Duplicate field value entered";
        statusCode = 400;
    }

    if (err.name === "ValidationError") {
        message = Object.values(err.errors).map((val) => val.message).join(", ");
        statusCode = 400;
    }

    if (err.name === "JsonWebTokenError") {
        message = "Invalid Token, please log in again";
        statusCode = 401;
    }  

    if (err.name === "TokenExpiredError") {
        message = "Your token has expired, please log in again";
        statusCode = 401;
    }  


    res.status(statusCode).json({
        success: false,
        message,
        errorDetails: errorDetails || null,
    });
};

export default customErrorHandler;
