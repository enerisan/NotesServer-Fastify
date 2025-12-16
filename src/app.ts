// import fastify & mongoose
import fastify, { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'
import noteRoutes from './routes/noteRoutes';
import s3Routes from './routes/s3Routes';
import multipart from '@fastify/multipart';


dotenv.config();



// initialized Fastify App
const app: FastifyInstance = fastify({
    bodyLimit: 1024 * 1024 * 50 // 50MB for big files
});



// Registre multipart
app.register(multipart);



// connect fastify to Mongo
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected to MongoDB Atlas");
    } catch (e) {
        console.error("Error connecting to MongoDB:", e);
        process.exit(1);
    }
}

connectDB();

//load routes
userRoutes(app);
noteRoutes(app);
s3Routes(app);


// handle root route
app.get('/', (request, reply) => {
    reply.send("Hello world!");
});

// set application listening on port 5000
app.listen({ port: 5000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server running on ${address}`);
});
