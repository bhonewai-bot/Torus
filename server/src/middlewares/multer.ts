import multer from "multer";
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuid4 } from "uuid";

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), "uploads", "products");

        // Create directory if it doesn't exist
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: uuid-timestamp-originalname
        const uniqueName = `${uuid4()}-${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, WEBP, and GIF are allowed.`));
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fieldSize: 5 * 1024 * 1024,
        files: 10
    }
});