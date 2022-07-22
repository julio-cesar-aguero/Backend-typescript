"use strict";
// Archivo principal Api Rest Node
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Express
//Mongoose
//Body parser
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        // cors
        this.app.use((0, cors_1.default)(corsOptions));
        this.app.use(express_1.default.static(__dirname + "/public"));
        // conexion a mongodb 
        const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.irtcf.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
        mongoose_1.default.connect(uri, {})
            .then(() => {
            console.log("Base de datos conectada");
            //createRoles();
        })
            .catch((e) => console.log("error db:", e));
        this.app.set('port', process.env.PORT || 3000);
        //middlewares
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        this.app.use('/api', auth_1.default);
        this.app.use('/api/admin', admin_1.default);
        this.app.use('/api/user', user_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
