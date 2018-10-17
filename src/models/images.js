function create(db, args) {
  return new Promise(function(resolve, reject) {
    db.images.insert(args, function(error, value) {
      if (error) {
        return reject(error);
      }
      return resolve(value);
    });
  });
}

module.exports = {
  create
}