const { ApolloServer }  = require('apollo-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const MONGODB = process.env.DATABASE_URL;
const server = new ApolloServer({
    typeDefs,
    resolvers
});
console.log(process.env.DATABASE_URL); 
mongoose.connect(MONGODB, {writeConcern: { w: 'majority' }})
    .then(() => {
        console.log("MongoDB Connected");
        return server.listen({port: 5000});
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`)
    });