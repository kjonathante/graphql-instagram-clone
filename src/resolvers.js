const fs = require("fs");
const mkdirp = require("mkdirp");
const shortid = require("shortid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PubSub } = require("apollo-server-express");
const Event = require("./models/event");
const Images = require("./models/images");
const User = require("./models/user");

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
    },
    async signup(root, args, context) {
      const password = await bcrypt.hash(args.password, 10);
      const user = await User.create(context.db, {
        ...args,
        password: password
      });
      const token = jwt.sign({ userId: user._id }, "secret");
      return {
        token,
        user
      };
    },
    async login(root, args, context) {
      const user = await User.user(context.db, { email: args.email });
      if (!user) {
        throw new Error("No such user found");
      }

      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign({ userId: user._id }, "secret");
      return {
        token,
        user
      };
    }
  },
  AuthPayload: {
    async user(root, args, context) {
      return await User.user(context.db, { _id: root.user._id });
    }
  }
};

module.exports = {
  resolvers: resolvers,
  pubsub: pubsub
};
