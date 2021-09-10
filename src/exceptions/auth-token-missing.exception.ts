import HttpException from "./HttpException";

export class AuthenticationTokenMissingException extends HttpException {
    constructor() {
        super(401, "Authentication Token Missing!!");
    }
}
