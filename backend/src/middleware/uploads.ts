import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: "uploads/pdfs",
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});


export const uploadPdf = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        }else {
            cb(new Error("Only pdf files allowed"));
        }
    },
});