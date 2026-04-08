import multer from "multer";
import fs from "node:fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = "temp";
    fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
