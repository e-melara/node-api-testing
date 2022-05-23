const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');

const router = express.Router();

const { home, post, put, dropNote } = require('../controllers/home');

router.get('/api/v1/notes', home);
router.post(
	'/api/v1/notes',
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			content: Joi.string().required().min(3),
			important: Joi.boolean().required(),
		}),
	}),
	post,
);

router.put(
	'/api/v1/notes/:id',
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			content: Joi.string().min(3),
			important: Joi.boolean(),
		}),
	}),
	put,
);

router.delete('/api/v1/notes/:id', dropNote);

module.exports = router;
