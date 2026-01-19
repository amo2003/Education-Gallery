import mongoose, { Schema, Document } from "mongoose";

export interface IPDf extends Document {
    subject: string;
    teacherName: string;
    fileName: string;
    filePath: string;
    uploadedBy: mongoose.Types.ObjectId;
}

const PdfSchema = new Schema<IPDf>({
    subject: { type: String, required: true },
    teacherName: { type: String, required: true },
    fileName: { type: String, required: true},
    filePath: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model<IPDf>("pdf", PdfSchema);