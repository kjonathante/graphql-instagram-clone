const fs = require("fs");
const http = require("http");
const express = require("express");
const mongojs = require("mongojs");
const { ApolloServer, gql } = require("apollo-server-express");
const { resolvers } = require("./resolvers");
const typeDefs = gql(
  fs.readFileSync(__dirname.concat("/schema.graphql"), "utf8")
);

const db = mongojs("instagram_db", ["events"]);
// fix for this issue: ID cannot represent value: {_bsontype: \"ObjectID\"
const ObjectId = mongojs.ObjectId;
ObjectId.prototype.valueOf = function() {
  return this.toString();
};
// this will make sure that email field is unique
db.users.createIndex({ email: 1 }, { unique: true });

const port = 4000;
const app = express();
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      // check connection for metadata
      return {};
    } else {
      // check from req
      const token = req.headers.authorization || "";

      return { token, db };
    }
  }
});

apolloServer.applyMiddleware({ app });

const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(port, () => {
  console.log(
    `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${port}${
      apolloServer.subscriptionsPath
    }`
  );
});
