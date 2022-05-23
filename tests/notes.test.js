const mongosee = require('mongoose');
const supertest = require('supertest');

const Note = require('../src/models/Note');
const { app, server } = require('../index');

const api = supertest(app);

const intialNotes = [
	{
		important: true,
		date: new Date(),
		content: 'Aprediendo FullStack JS con midudev',
	},
	{
		important: true,
		date: new Date(),
		content: 'Sigueme en https://midu.tube',
	},
];

beforeAll(async () => {
	await Note.deleteMany({});

	const note1 = new Note(intialNotes[0]);
	await note1.save();

	const note2 = new Note(intialNotes[1]);
	await note2.save();
});

describe('GET /notes', () => {
	it('should return status code 200', async () => {
		await api
			.get('/api/v1/notes')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('there are two notes', async () => {
		const response = await api.get('/api/v1/notes');
		expect(response.body).toHaveLength(2);
	});

	test('the first note is about midudev', async () => {
		const response = await api.get('/api/v1/notes');
		expect(response.body[0].content).toBe(
			'Aprediendo FullStack JS con midudev',
		);
	});
});

describe('POST /notes', () => {
	const newNote = {
		content: 'Proximamente async/await',
		important: true,
	};

	test('should return status code 201', async () => {
		await api
			.post('/api/v1/notes')
			.send(newNote)
			.expect(201)
			.expect('Content-Type', /application\/json/)
			.then(response => {
				expect(response.body.data).toHaveProperty('content', newNote.content);
				expect(response.body.data.id).toBeTruthy();
			});
	});

	test('should validation content requerido', async () => {
		await api
			.post('/api/v1/notes')
			.send({})
			.expect(400)
			.then(response => {
				const { message, validation } = response.body;
				expect(message).toMatch(/failed/);
				expect(validation.body).toHaveProperty('message');
				expect(validation.body.message).toMatch('"content" is required');
			});
	});

	test('should validation content minimo 3 caracteres', async () => {
		await api
			.post('/api/v1/notes')
			.send({
				content: 'ab',
			})
			.expect(400)
			.then(response => {
				const { message, validation } = response.body;
				expect(message).toMatch(/failed/);
				expect(validation.body).toHaveProperty('message');
				expect(validation.body.message).toContain(
					'"content" length must be at least 3 characters long',
				);
			});
	});

	test('should validation important requerido', async () => {
		await api
			.post('/api/v1/notes')
			.send({
				content: 'abc',
			})
			.expect(400)
			.then(response => {
				const { message, validation } = response.body;
				expect(message).toMatch(/failed/);
				expect(validation.body).toHaveProperty('message');
				expect(validation.body.message).toContain('"important" is required');
			});
	});
});

describe('UPDATE /notes', () => {
	test('should update notes values', async () => {
		const note = await Note.create({
			content: 'Prueba de notes',
			important: false,
			date: Date.now(),
		});
		await api
			.put(`/api/v1/notes/${note._id}`)
			.send({
				content: 'Prueba numero dos',
				important: false,
			})
			.expect(200)
			.expect('Content-Type', /application\/json/)
			.then(function ({ body }) {
				expect(body.message).toMatch(/updated/);
				expect(body.data.id).toBeTruthy();
				expect(body.data.id).toEqual(note._id.toString());
				expect(body.data.important).toBe(false);
				expect(body.data.content).toMatch(/Prueba numero dos/);
			});
	});

	test('should update validation object id', async () => {
		await api
			.put('/api/v1/notes/123')
			.send({
				content: 'Prueba numero dos',
				important: false,
			})
			.expect(400)
			.then(function ({ body }) {
				expect(body.message).toMatch(/id no es valido/);
			});
	});

	test('should update validation content', async () => {
		await api
			.put('/api/v1/notes/628b3b6a1a31e770a72f9b50')
			.send({
				content: '',
			})
			.expect(400)
			.then(function ({ body }) {
				const { message, keys } = body.validation.body;
				expect(body.message).toMatch(/failed/);
				expect(message).toContain('"content" is not allowed to be empty');
				expect(keys[0]).toBe('content');
			});
	});
});

describe('DELETE /notes', () => {
	test('should delete validation id', async () => {
		await api
			.delete('/api/v1/notes/123')
			.expect(400)
			.expect('Content-Type', /application\/json/)
			.then(({ body }) => {
				expect(body.message).toMatch(/id no es valido/);
			});
	});

	test('should delete', async () => {
		await api
			.delete('/api/v1/notes/628b4143cf8d0881463bc130')
			.expect(200)
			.expect('Content-Type', /application\/json/)
			.then(({ body }) => {
				expect(body.message).toEqual('Note deleted');
			});
	});
});

afterAll(done => {
	mongosee.disconnect();
	server.close();
	done();
});
