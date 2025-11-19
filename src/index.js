// import fastify & mongoose
const fastify = require('fastify');
const mongoose = require('mongoose');
const noteRootes = require('./routes/noteRoutes');

// initialized Fastify App
const app = fastify();

// connect fastify to mongoose
try {
  mongoose.connect('mongodb://localhost:27017/notes_db');
} catch (e) {
  console.error(e);
}

noteRootes(app);

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
