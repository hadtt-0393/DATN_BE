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
  phoneNumber: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    require: true,
  },
  isStaff: {
    type: Boolean,
    require: true,
  }


}, { timestamps: true },);

UserSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email });
};

export default mongoose.model("user", UserSchema);