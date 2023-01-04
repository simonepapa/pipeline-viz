const express = require("express")
const dotenv = require("dotenv").config()
const { errorHandler } = require("./middleware/errorMiddleware")
const connectDB = require("./config/db")
const PORT = process.env.PORT || 5000

// Connect to database
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Pipeline Viz APP" })
})

// Routes
app.use("/api/case", require("./routes/caseRoutes"))
app.use("/api/pipeline", require("./routes/pipelineRoutes"))

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
