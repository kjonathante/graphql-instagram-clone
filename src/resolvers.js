const fs = require("fs");
const mkdirp = require("mkdirp");
const shortid = require("shortid");
const { PubSub } = require("apollo-server-express");
const Event = require("./models/event");
const Images = require("./models/images");

const pubsub = new PubSub();
const UPLOAD_DIR = "./uploads";
const EVENT = "EVENT";

// Ensure upload directory exists
mkdirp.sync(UPLOAD_DIR);

const storeFS = ({ stream, filename }) => {
  const id = shortid.generate();
  const path = `${UPLOAD_DIR}/${id}-${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on("error", error => {
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on("error", error => reject(error))
      .on("finish", () => resolve({ id, path }))
  );
};

const processUpload = async (db, upload) => {
  const { stream, filename, mimetype, encoding } = await upload;
  const { id, path } = await storeFS({ stream, filename });
  return await Images.create(db, { filename, mimetype, encoding, path });
};

const resolvers = {
  Subscription: {
    eventAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([EVENT])
    }
  },
  Query: {
    async events(root, args, context) {
      const events = await Event.read(context.db, args);
      return events;
      // return postController.posts();
    }
  },
  Mutation: {
    async createEvent(root, args, context) {
      const newEvent = await Event.create(context.db, args);
      pubsub.publish(EVENT, { eventAdded: newEvent });
      return newEvent;
      // return postController.addPost(args);
    },
    singleUpload: function(root, args, context) {
      return processUpload(context.db, args.file);
    }
  }
};

module.exports = {
  resolvers: resolvers,
  pubsub: pubsub
};
