const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const app = express();
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
