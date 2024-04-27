// import 'express-async-errors'
import express from 'express'
import { AppDataSource } from './data-source'
// import { errorMiddleware } from './middlewares/error'
// import routes from './routes'

AppDataSource.initialize().then(() => {
	const app = express()

	app.use(express.json())

	app.get('/', (req, res) => {return res.json("oK")})

	return app.listen(process.env.PORT)
})