import { constants } from 'http2';

export class NotFoundError extends Error {
    statusCode: number;

    constructor(message: string = 'Данные не найдены') {
        super(message);
        this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
    }
}

export class BadRequestError extends Error {
    statusCode: number;

    constructor(message: string = 'Переданы некорректные данные или объекта не существует') {
        super(message);
        this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
    }
}

export class AutorizationError extends Error {
    statusCode: number;

    constructor(message: string = 'Неверный логин или пароль') {
        super(message);
        this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
    }
}

export class AccessDenided extends Error {
    statusCode: number;

    constructor(message: string = 'Доступ к данным запрещен') {
        super(message);
        this.statusCode = constants.HTTP_STATUS_FORBIDDEN;
    }
}

export class ConflictError extends Error {
    statusCode: number;

    constructor(message: string = 'Дублирование уникальных данных') {
        super(message);
        this.statusCode = constants.HTTP_STATUS_CONFLICT;
    }
}
