import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";

const storage = multer.diskStorage({
    destination: "../storage/",
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  const upload = multer({
    storage: storage,
  }).single("file");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Serve static files from the "storage" directory
app.use("../storage", express.static("storage"));


app.post("/upload", async (req, res) => {
    try {
        upload(req, res, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "File upload failed" });
            }
            res.json({ file: req.file });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
