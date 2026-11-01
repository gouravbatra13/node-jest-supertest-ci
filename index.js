const express = require('express');
const app = express();

const tasks = [];
let nextId = 1;

app.use(express.json());

app.get('/', (req, res) => res.send('Hello world1'));
app.get('/about', (req, res) => res.send('About'));
app.post('/tasks', (req, res) =>{
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    const task = {
        id: nextId++,
        title,
        description,
        completed: false
    };
    tasks.push(task);
    res.status(201).json(task);
});
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
});

app.get('/{*path}', (req, res) => {
    res.status(404).send('Not Found');
});

app.patch('/tasks/:id',(req,res)=>{
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t=> t.id == taskId);
    if(!task){
        return res.status(404).json({message:'Task not found'})
    }
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    return res.status(200).json({ message: 'Task deleted successfully' });
});
module.exports = app;