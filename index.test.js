const request = require('supertest')
const app = require('./index')

describe('GET routes', () => {
    test('GET / returns the home page message', async () => {
        const response = await request(app).get('/')

        expect(response.status).toBe(200)
        expect(response.text).toBe('Hello world1')
    })

    test('GET /about returns the about page message', async () => {
        const response = await request(app).get('/about')

        expect(response.status).toBe(542544)
        expect(response.text).toBe('About')
    })

    test('GET /invalid returns 404', async () => {
        const response = await request(app).get('/invalid')
        expect(response.status).toBe(404)
    })


    //post request
    test('POST /tasks should create a task', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({
                title: 'Learn Jest',
                description: 'Practice testing',
            });

        expect(response.status).toBe(201);
        expect(response.body.title).toBe('Learn Jest');
        expect(response.body.completed).toBe(false);
        expect(response.body).toHaveProperty('id');
    });

    //Validation testing
    test('POST /tasks should reject missing title', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({
                description: 'No title provided',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Title is required');
    });

    //Error / 404 testing
    test('GET missing task should return 404', async () => {
        const response = await request(app).get('/tasks/999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Task not found');
    });

    test('GET unknown route should return 404', async () => {
        const response = await request(app).get('/invalid-route');
        expect(response.status).toBe(404);
    });

    //PATCH: update task
    test('PATCH /tasks/:id should update a task', async () => {
        const created = await request(app)
            .post('/tasks')
            .send({ title: 'Old title' });

        const response = await request(app)
            .patch(`/tasks/${created.body.id}`)
            .send({ title: 'New title', completed: true });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('New title');
        expect(response.body.completed).toBe(true);
    });

    //Delete Task 
    test('DELETE /tasks/:id should delete a task', async () => {
        const created = await request(app)
            .post('/tasks')
            .send({ title: 'Delete me' });

        const id = created.body.id;

        const deleted = await request(app).delete(`/tasks/${id}`);
        const list = await request(app).get(`/tasks/${id}`);

        expect(deleted.status).toBe(200);
        expect(deleted.body.message).toBe('Task deleted successfully');
        expect(list.status).toBe(404);
    });
})
