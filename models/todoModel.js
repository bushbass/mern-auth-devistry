const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: String, require: true },
});

module.exports = Todo = mongoose.model('todo', todoSchema);
