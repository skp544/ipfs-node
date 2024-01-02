import cors from "cors";
import express from "express";
import fs from "fs";
import { create } from "kubo-rpc-client";
import multer from "multer";
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

async function ipfsUpload(file) {
  const client = create({ url: "http://44.201.19.127:5001/api/v0" });

  const { cid } = await client.add(file);

  return cid;
}

app.post("/upload", async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "File upload failed" });
      }

      // connect to the default API address http://localhost:5001

      // connect to a different API

      const filePath = `../storage/${req.file.filename}`;

      const file = fs.readFileSync(filePath);
      const cid = await ipfsUpload(file);

      res.json({ file: req.file.filename, cid });
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
