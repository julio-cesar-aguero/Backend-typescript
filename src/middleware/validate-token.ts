import { Request, Response,NextFunction, Router} from "express"


export class validateToken{


    async verifyToken(req: Request, res: Response, next: NextFunction){
      console.log('verifyToken')
      next();
    }
    async isAdmin(req: Request, res: Response, next: NextFunction){
        console.log('isAdmin')
        next();
    }
    async isUser(req: Request, res: Response, next: NextFunction){
        console.log('isUser')
        next();
    }
}

