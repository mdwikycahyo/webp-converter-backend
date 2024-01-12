if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// const token = process.env.AUTH_TOKEN;
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");

const app = express();
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/convertImage", upload.single("file"), async (req, res) => {
  const imageQuality = +req.body.quality;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    // Use sharp to convert the image to webp
    const webpData = await sharp(req.file.buffer)
      .webp({ quality: imageQuality })
      .toBuffer();

    // Send the webp data as the response
    res.status(200).send(webpData);
  } catch (error) {
    console.error("Error converting image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Webhook is listening on port ${PORT}`);
});
