import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import HttpException from "../exceptions/HttpException";

function validationMiddleware<T>(type: any, skipMissingProperties = false) {
    return (req, res, next) => {
        validate(plainToClass(type, req.body), {
            skipMissingProperties,
        }).then((validationErrors: ValidationError[]) => {
            if (validationErrors.length > 0) {
                const message = validationErrors
                    .map((err: ValidationError) =>
                        Object.values(err.constraints)
                    )
                    .join(", ");

                next(new HttpException(400, message));
            } else {
                next();
            }
        });
    };
}

export default validationMiddleware;
