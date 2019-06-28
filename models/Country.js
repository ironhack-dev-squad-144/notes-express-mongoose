const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countrySchema = new Schema({
  name: String,
  code: String,
});

const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
