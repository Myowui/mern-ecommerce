import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});
app.get("/api/about", (req, res) =>{
    res.json({name : "Arshia"});
})

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));