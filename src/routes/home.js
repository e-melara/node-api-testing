const express = require("express");
const router = express.Router();

const { home } = require("../controllers/home");

router.get("/api/v1/home", home);

module.exports = router;
