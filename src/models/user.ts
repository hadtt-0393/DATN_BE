import { timeStamp } from "console";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    require: true,
  },
  city:{
    type: String,
    require: true,
  }

}, { timestamps: true },);

UserSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email });
};

export default mongoose.model("user", UserSchema);