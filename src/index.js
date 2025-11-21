require('dotenv').config();

// import fastify & mongoose
const fastify = require('fastify');
const mongoose = require('mongoose');
const noteRootes = require('./routes/noteRoutes');
const s3Routes = require('./routes/s3Routes')


// initialized Fastify App
const app = fastify({
    bodyLimit: 1024 * 1024 * 50 // 50MB for big files
});



// Registre multipart
app.register(require('@fastify/multipart'));



// connect fastify to Mongo
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas");
    } catch (e) {
        console.error("Error connecting to MongoDB:", e);
        process.exit(1);
    }
}

connectDB();

//load routes

noteRootes(app);
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
