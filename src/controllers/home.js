const Note = require("../models/Note");

exports.home = function (req, res) {
  Note.find({}, function (err, notes) {
    res.json(notes);
  })
};
