const Event = require('./models/event');

const { PubSub } = require("apollo-server-express");
const pubsub = new PubSub();

const EVENT = "EVENT";

const resolvers = {
  Subscription: {
    eventAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([EVENT])
    }
  },
  Query: {
    async events(root, args, context) {
      const events = await Event.read(context.db, args)
      return events;
      // return postController.posts();
    }
  },
  Mutation: {
    async createEvent(root, args, context) {
      const newEvent = await Event.create(context.db, args)
      pubsub.publish(EVENT, { eventAdded: newEvent });
      return newEvent;
      // return postController.addPost(args);
    }
  }
};

module.exports = {
  resolvers: resolvers,
  pubsub: pubsub
};
