const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan') ;
const exphbs = require('express-handlebars')
const passport = require('passport');
const methodOverride = require('method-override')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
                                         
const index = require('./routes/index');          //* routes    
const  auth = require('./routes/auth');
const stories = require('./routes/stories');

dotenv.config({ path: './config/config.env'});  //* load config

require('./config/passport-setup')(passport)   //*start passport

connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 

app.use(methodOverride((req, res) => {          //* override POST having ?_method=DELETE
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

//* login
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

app.use(session({                  //* Session
    secret: 'keyboard cat',
    resave: false,                 //? don"t save unless changes have made   
    saveUninitialized: false,     //? dont create session unless smth is stored
    //cookie: { secure: true }   //?  https-only feature  
    store:                      //? svaes sessionn to db/ to keep login 
        MongoStore.create({mongoUrl: process.env.MONGO_URI}) //!migrating from v3 to v4 of mongo 
  }))

app.use(passport.initialize());  //* Passport middleware
app.use(passport.session());

app.use((req, res, next)=> {    //* Global user var
    res.locals.user = req.user || null
    next()
})

const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/helpers');

app.engine(                    //* Handlebars-config
    '.hbs', 
    exphbs.engine({ 
        helpers: {formatDate, truncate, stripTags, editIcon, select},
        defaultLayout: 'main', 
        extname: ".hbs"}))
app.set('view engine', '.hbs')
app.use(express.static('public')) //!__dirname, (unnecessary to use current path)

app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
