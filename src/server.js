const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

const databaseUrl = process.env.DATABASE_URL
mongoose.connect(databaseUrl)
    .then(() => { console.log('Database success connected') })
    .catch((error) => { console.error('Error: ', error) })

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const bookSchema = new mongoose.Schema({
    name: String,
    author: String,
    image: String,
    desc: String,
    tags: [ String ],
    date: { type: Date, default: Date.now() },
    isPublished: { type: Boolean, default: false }
})

const BookModel = new mongoose.model('book', bookSchema)

app.post('/book', async (req, res) => {
    try {
        const { name, author, image, desc, tags } = req.body
        const book_created = new BookModel({
            name,
            author,
            image,
            desc,
            tags,
        })
        const book_saved = await book_created.save();
        res.status(200).json({
            message: "Book success created",
            book: book_saved
        })
    } catch(error) {
        res.status(500).json({
            message: 'Internal server error', 
            error 
        })
    }
})
app.get('/book', async (req, res) => {
    try {
        const books = await BookModel.find()
        res.status(200).json({
            message: "All books",
            books
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error
        })
    }
})
const port = process.env.PORT || 3000
app.listen(port, () => { console.log('Server is running. Port http://localhost:' + port)})