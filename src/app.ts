import * as express from "express";
import * as mongoose from "mongoose";
import * as cookieParser from "cookie-parser";

import errorMiddleware from "./middleware/errors.middleware";

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers, port) {
        //임의의 this={}
        this.app = express();
        this.port = port;

        this.connectToDatabase();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandler();
    }

    private initializeMiddleware() {
        this.app.use(express.json());
        this.app.use(cookieParser());
    }

    private initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }

    // 에러 핸들링 미들웨어
    private initializeErrorHandler() {
        this.app.use(errorMiddleware);
    }

    private async connectToDatabase() {
        try {
            const connection = await mongoose.connect(process.env.MONGO_SRV, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            });

            console.log(`MONGO DB :: ${connection.connection.name}`);
        } catch (err) {
            console.error(err);
        }
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`서버가 ${this.port}에서 실행중입니다!`);
        });
    }
}

export default App;
