import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const errorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error(err);


    // Check if the error is an instance of ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(
            new ApiResponse(
                err.statusCode,
                {
                    success: err.success,
                    errors: err.errors,
                },
                err.message
            )
        );
    }

    // Handle other types of errors (e.g., basic JavaScript errors)
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: {
            name: err.name,
            message: err.message,
        },
    });
};

export default errorHandler;
