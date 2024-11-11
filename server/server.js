const express = require("express");
const mongoose = require("mongoose");
//add that route to this
// const hintRoutes = require("../route/HintRoutes");
const examRoutes = require("../route/ExamRoutes");

const codeRoutes = require("../route/codeRouter");
const checkErrorsRouter = require("../routes/checkErrors");
const compareCodeRouter = require("../routes/compareCode");
const checkLogicalErrorsRouter = require("../routes/checkLogicalErrors");
const authRoutes = require("../routes/auth");
const saveLogicalErrorsRoute = require("../routes/saveLogicalErrors");
const errorSuggestionsRouter = require("../routes/errorSuggestions"); // Import the new router
const getErrorDataRouter = require("../routes/getErrorData"); // Import the new router
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const mongoDbURL =
  "mongodb+srv://bhawan:200132400588@atlascluster.fl5bp73.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";

mongoose
  .connect(mongoDbURL)
  .then(() => console.log("Database Connected Successfully."))
  .catch((err) => console.log(err));

//use that route
app.use("/hint", hintRoutes);
app.use("/exam", examRoutes);
app.use("/api/codes", codeRoutes);

// Use the checkErrors router
app.use("/api/checkErrors", checkErrorsRouter);

// Use the compareCode router
app.use("/api/compareCode", compareCodeRouter);

app.use("/api/checkLogicalErrors", checkLogicalErrorsRouter);
app.use("/api/saveLogicalErrors", saveLogicalErrorsRoute);
app.use("/api/errorSuggestions", errorSuggestionsRouter); // Use the new error suggestions router
app.use("/api/getErrorData", getErrorDataRouter); // Use the new error data router
app.use("/api/auth", authRoutes);

app.listen(3000, () => console.log("Server Connected Successfully"));
