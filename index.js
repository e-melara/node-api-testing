const app = require('./src/app');

const server = app.listen(process.env.PORT, () => {
	/* console.log(`Corriendo en el puerto ${process.env.PORT}`); */
});

module.exports = { app, server };
