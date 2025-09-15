export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
} as const;

export const MESSAGES = {
    SUCCESS: "Operation completed successfully",
    CREATED: "Resource created successfully",
    UPDATED: "Resource updated successfully",
    DELETED: "Resource deleted successfully",
    NOT_FOUND: "Resource not found",
    BAD_REQUEST: "Bad request",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Forbidden access",
    SERVER_ERROR: "Internal server error",
    USER_NOT_FOUND: "User not found",
    EMAIL_TAKEN: "Email is already registered",
    INVALID_CREDENTIALS: "Invalid email or password",
    ROOM_NOT_FOUND: "Room not found",
    MESSAGE_SAVED: "Message saved successfully",
    EMAIL_VERIFIED: "Email verified successfully",
    EMAIL_NOT_VERIFIED: "Email not verified",
    SUCCESS_LOGIN: "Login successful",
    NAME_BLANK: "The name field cannot be blank.",
    SUCCESS_LOGOUT: "Logout successful",
    ERROR_LOGOUT: "Error occurred during logout"

} as const;
