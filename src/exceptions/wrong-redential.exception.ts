import HttpException from "./HttpException";

export class WrongCredentialExeption extends HttpException {
    constructor() {
        // super : extends 된 (httpException)  // 상속받아온 parent의 constructor를 실행
        super(400, "이메일 혹은 비밀번호가 잘못되었어요!");
    }
}
