

export class AppError extends Error {
    public statusCode: number;
    public error: string="";
    public details?: string;

    constructor(message: string, statusCode = 400, details?: any) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;

        Error.captureStackTrace?.(this, this.constructor);
    }
}



export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 422, details);
    }
}

export class AuthError extends AppError {
    constructor(message:string, details:string) {
        super(message, 401, details);
    }
}
export class RegisterUserError extends AppError {
    constructor(message:string, details:string) {
        super(message, 401, details);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Recurso no encontrado") {
        super(message, 404);
    }
}

export class DatabaseError extends AppError {
    constructor(message = "Error en la base de datos", details?: any) {
        super(message, 500, details);
    }
}

export class BusError extends AppError {
    constructor(message:string, details:string) {
        super(message, 401, details);
    }
}
