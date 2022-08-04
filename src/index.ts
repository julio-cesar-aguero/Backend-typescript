// Archivo principal Api Rest Node

//Express
//Mongoose
//Body parser
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import userRoutes from './routes/user';
import bodyparser from 'body-parser';
import cors from 'cors';
require("dotenv").config();

const corsOptions = {
    origin: "*", // Reemplazar con dominio
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

class Server {
    public app: express.Application;


    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {

        // cors
        this.app.use(cors(corsOptions));
        this.app.set('view engine','ejs')
        this.app.set('views', __dirname + '/views')
        this.app.use(express.static(__dirname + "/public"));
        // conexion a mongodb 
        const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.irtcf.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;



        mongoose.connect(uri, {

        })
            .then(() => {
                console.log("Base de datos conectada");
                //createRoles();
            })
            .catch((e) => console.log("error db:", e));

        this.app.set('port', process.env.PORT || 3000);
        //middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }))

    }
    routes() {

        this.app.use('/api',authRoutes);
        this.app.use('/api/admin',adminRoutes);
        this.app.use('/api/user',userRoutes);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'))
        })
    }
}
const server = new Server();
server.start();