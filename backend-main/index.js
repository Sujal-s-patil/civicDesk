import express from "express"
import cors from "cors"
import config from "./config/env.js"
// import path from "path"

const app = express();

// const policeRouter = require("./routes/police.routes.js");
import citizenRouter from "./routes/citizen.js"
// const criminalRouter = require("./routes/criminal.routes.js");
// const ticketRouteer = require("./routes/ticket.routes.js")
// const photoRouter = require("./routes/photo.routes.js");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use("/police", policeRouter);
app.use("/citizen", citizenRouter);
// app.use("/criminal", criminalRouter)
// app.use("/ticket", ticketRouteer)
// app.use("/photo", photoRouter);



app.use((req, res, error) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.statusCode ? error.message : "internal server error"
  return res.status(statusCode).json({ success: false, message })
})


app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});


app.listen(config.PORT, "0.0.0.0", () => {
  console.log(`server started on `, config.PORT)
})