const shortid = require("shortid");
shortid.seed(5)
module.exports = {
  generate: function() {
    return shortid.generate();
  }
};
