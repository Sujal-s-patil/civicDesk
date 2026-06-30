import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Absolute paths — never break depending on where you run `node index.js` from
const photoDir = path.join(__dirname, '..', 'uploads', 'photo');
const evidenceDir = path.join(__dirname, '..', 'uploads', 'evidence');

[photoDir, evidenceDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Two separate multer instances instead of one branching on req.originalUrl.
// If you ever rename a route, this can't silently break — the destination
// is bound at config time, not inferred from the URL string at request time.
const makeStorage = (destDir) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, destDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`); // uuid — never trust originalname, avoids collisions
    },
  });

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPEG/PNG/WebP images allowed'), false);
};

export const uploadPhoto = multer({
  storage: makeStorage(photoDir),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadEvidence = multer({
  storage: makeStorage(evidenceDir),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});