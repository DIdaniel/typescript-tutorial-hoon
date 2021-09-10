import { Request, Response, NextFunction } from "express";
import HttpException from "exceptions/HttpException";

function errorMiddleware(
    err: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const status = err.status || 500;
    const message = err.message || "서버 에러";

    res.status(status).send(message);
}

export default errorMiddleware;
