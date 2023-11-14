const messagesResolvers = require('./messages');
const usersResolvers = require('./user');
module.exports = {
    Query: {
        ...messagesResolvers.Query,
        ...usersResolvers.Query
    },
    Mutation: {
        ...messagesResolvers.Mutation,
        ...usersResolvers.Mutation
    },
};