const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const checkErrorsRouter = require('./routes/checkErrors');
const compareCodeRouter = require('./routes/compareCode');
const checkLogicalErrorsRouter = require('./routes/checkLogicalErrors');
const authRoutes = require('./routes/auth');
const saveLogicalErrorsRoute = require('./routes/saveLogicalErrors');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use the checkErrors router
app.use('/api/checkErrors', checkErrorsRouter);

// Use the compareCode router
app.use('/api/compareCode', compareCodeRouter);

app.use('/api/checkLogicalErrors', checkLogicalErrorsRouter);
app.use('/api/saveLogicalErrors', saveLogicalErrorsRoute);


const URL = "mongodb+srv://urinduyatawaka:30VpqUiVEu3jTE1M@login.j8dwr.mongodb.net/?retryWrites=true&w=majority&appName=login"; 

mongoose.connect(URL, { //connect mongodb
    //useCreateIndex: true, 
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useFindAndModify: false
});

const connection = mongoose.connection; //hadagatta connection eka open karagannawa
connection.once("open", () => {
    console.log("Mongodb connection success!"); //if success
})

app.use('/api/auth', authRoutes);


// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
