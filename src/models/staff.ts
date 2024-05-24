const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StaffSchema = new Schema({
  email: {
    type: String,
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

}, { timestamps: true },);

StaffSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email });
};

export default mongoose.model("staff", StaffSchema);