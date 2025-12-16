import { FastifyInstance } from "fastify"
import userController from "../controllers/userController"



export default  function userRoutes(app: FastifyInstance) {
    //register
    app.post('/api/users', userController.register)
}