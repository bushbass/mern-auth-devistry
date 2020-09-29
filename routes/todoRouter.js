const router = require('express').Router();
const auth = require('../middleware/auth');
const Todo = require('../models/todoModel');

router.post('/', auth, async (req, res) => {
  try {
    const { title } = req.body;
    //validation
    if (!title)
      return res.status(400).json({ msg: 'Not all fields have been entered' });

    const newTodo = new Todo({
      title,
      userId: req.user,
    });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all todos from logged in user
router.get('/', auth, async (req, res) => {
  const todos = await Todo.find({ userId: req.user });
  res.json(todos);
});

// get specific todo from logged in user
router.get('/:id', auth, async (req, res) => {
  const todo = await Todo.find({ userId: req.user, _id: req.params.id });
  res.json(todo);
});

router.delete('/:id', auth, async (req, res) => {
  console.log({ params: req.params });
  const todo = await Todo.findOne({ userId: req.user, _id: req.params.id });
  if (!todo)
    return res
      .status(400)
      .json({ msg: 'no todo found with id that belongs to current user' });

  const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
  console.log({ deletedTodo });
  res.json(deletedTodo);
});

module.exports = router;
