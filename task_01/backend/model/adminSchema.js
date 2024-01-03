import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// const Admin = mongoose.model('Admin', AdminSchema);
const Admin = mongoose.models.Admin || mongoose.model ("Admin", AdminSchema)
export default Admin;
