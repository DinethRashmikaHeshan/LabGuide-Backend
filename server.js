const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const checkErrorsRouter = require('./routes/checkErrors');
const compareCodeRouter = require('./routes/compareCode');
const checkLogicalErrorsRouter = require('./routes/checkLogicalErrors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use the checkErrors router
app.use('/api/checkErrors', checkErrorsRouter);

// Use the compareCode router
app.use('/api/compareCode', compareCodeRouter);

app.use('/api/checkLogicalErrors', checkLogicalErrorsRouter);

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
