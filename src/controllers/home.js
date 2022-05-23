const mongoose = require('mongoose');
const Note = require('../models/Note');

exports.home = function (req, res) {
	return Note.find({}, function (err, notes) {
		res.json(notes);
	});
};

exports.post = async function (req, res) {
	const { content, important = false, date = Date.now() } = req.body;
	const newNote = new Note({
		content,
		important,
		date,
	});

	const response = await newNote.save();
	res.status(201).json({
		message: 'nota agregada con exito',
		data: response,
	});
};

exports.put = async function (req, res, next) {
	const date = Date.now();
	const { id } = req.params;

	if (!mongoose.isValidObjectId(id)) {
		return res.status(400).json({
			message: 'El id no es valido',
		});
	}

	return Note.findByIdAndUpdate(
		id,
		{ ...req.body, date },
		{
			new: true,
		},
	)
		.then(response => {
			return res.status(200).json({
				message: 'Note updated',
				data: response,
			});
		})
		.catch(next);
};

exports.dropNote = async function (req, res, next) {
	const { id } = req.params;

	if (!mongoose.isValidObjectId(id)) {
		return res.status(400).json({
			message: 'El id no es valido',
		});
	}

	return Note.findByIdAndDelete(id)
		.then(function (note) {
			return res.status(200).json({
				message: 'Note deleted',
				data: note,
			});
		})
		.catch(next);
};
