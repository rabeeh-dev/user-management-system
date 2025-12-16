const express = require('express')
const path = require('path')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const morgan = require('morgan')
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db')
const methodOverride = require('method-override');
const nocache = require('nocache')
require('dotenv').config()

connectDB()

const app = express()
app.use(nocache());

app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(methodOverride('_method'))


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});

app.use('/' , require('./routes/userRoute'))
app.use('/admin', require('./routes/adminRoute'));


app.set('view engine','ejs')
app.set('views', path.join(__dirname,'views'))

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})