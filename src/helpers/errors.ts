import { constants } from 'http2';

export class NotFoundError extends Error {
    message: string;

    statusCode: number;

    constructor(message: string = 'Данные не найдены') {
        super(message);
        this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
        this.message = message;
    }
}

export class BadRequestError extends Error {
    message: string;

    statusCode: number;

    constructor(message: string = 'Переданы некорректные данные или объекта не существует') {
        super(message);
        this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
        this.message = message;
    }
}

export class AutorizationError extends Error {
    message: string;

    statusCode: number;

    constructor(message: string = 'Неверный логин или пароль') {
        super(message);
        this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
        this.message = message;
    }
}

export class AccessDenided extends Error {
    message: string;

    statusCode: number;

    constructor(message: string = 'Доступ к данным запрещен') {
        super(message);
        this.statusCode = constants.HTTP_STATUS_FORBIDDEN;
        this.message = message;
    }
}

export class ConflictError extends Error {
    message: string;

    statusCode: number;

    constructor(message: string = 'Дублирование уникальных данных') {
        super(message);
        this.statusCode = constants.HTTP_STATUS_CONFLICT;
        this.message = message;
    }
}
