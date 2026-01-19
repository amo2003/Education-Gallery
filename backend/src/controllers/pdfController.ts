import { Request, Response } from "express";
import Pdf from "../models/pdf";
import fs from "fs";

export const uploadPdf = async (req: Request, res: Response) => {
    const { subject, teacherName } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "PDF Required" });
    }


const pdf = await Pdf.create({
    subject,
    teacherName,
    fileName: req.file.filename,
    filePath: req.file.path,
    uploadedBy: (req as any).user.id,
});

    res.status(201).json(pdf);

}; 

export const getAllPdfs = async (req: Request, res: Response) => {
    const pdfs = await Pdf.find().sort({ createdAt: -1 });
    res.json(pdfs);
};

export const downloadPdf = async (req: Request, res: Response) => {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "pdf not found" });

    res.download(pdf.filePath, pdf.fileName);
};

export const updatePdf = async (req: any, res: Response) => {
  const pdf = await Pdf.findById(req.params.id);
  if (!pdf) return res.status(404).json({ message: "PDF not found" });

  // Check if the PDF belongs to the logged-in teacher
  if (pdf.uploadedBy.toString() !== req.user.id) {
    return res.status(403).json({ message: "You can only update your own PDFs" });
  }

  // update text fields
  pdf.subject = req.body.subject || pdf.subject;
  pdf.teacherName = req.body.teacherName || pdf.teacherName;

  // replace file if new PDF uploaded
  if (req.file) {
    fs.unlinkSync(pdf.filePath); // delete old file
    pdf.fileName = req.file.filename;
    pdf.filePath = req.file.path;
  }

  await pdf.save();
  res.json(pdf);
};

// ================== DELETE ==================
export const deletePdf = async (req: any, res: Response) => {
  const pdf = await Pdf.findById(req.params.id);
  if (!pdf) return res.status(404).json({ message: "PDF not found" });

  // Check if the PDF belongs to the logged-in teacher
  if (pdf.uploadedBy.toString() !== req.user.id) {
    return res.status(403).json({ message: "You can only delete your own PDFs" });
  }

  fs.unlinkSync(pdf.filePath); // delete file
  await pdf.deleteOne();

  res.json({ message: "PDF deleted successfully" });
};