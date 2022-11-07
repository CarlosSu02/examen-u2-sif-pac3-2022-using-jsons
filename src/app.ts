
import express, { json } from "express";
import cors from "cors";
import categoriesRoutes from "./routes/categories.routes";
import wordRoutes from "./routes/word.routes";
import categoryController from "./controllers/category.controller";
import wordController from "./controllers/word.controller";
import gameRoutes from "./routes/game.routes";

class App {

    public express: express.Application;

    constructor() {

        this.express = express();
        this.middlewares();

        // this.db();
        this.routes();

    }

    middlewares = () => {

        this.express.use(json());
        this.express.use(cors());

    };

    routes = () => {

        this.express.use('/api', categoriesRoutes.router);
        this.express.use('/api', wordRoutes.router);
        this.express.use('/api/game', gameRoutes.router);

    };

    listen = (PORT: number) => {

        this.express.listen(PORT, () => {

            console.log(`Server is running on port: ${PORT}, http://localhost:${PORT} \n`);

        })

    };

}

export default new App();
