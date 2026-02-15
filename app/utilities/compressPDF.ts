'use client'
// src/utils/compressPdf.ts
import { PDFDocument } from 'pdf-lib';

export async function compressPdf(file: File): Promise<File> {
  try {
    const fileBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer);

    const compressedBytes = await pdfDoc.save({ 
      useObjectStreams: true, 
      addDefaultPage: false 
    });

    if (compressedBytes.byteLength >= file.size) {
      return file;
    }

    
    return new File([compressedBytes as BlobPart], file.name, {
      type: 'application/pdf',
      lastModified: Date.now(),
    });

  } catch (error) {
    console.error("Compression failed, using original file:", error);
    return file; 
  }
}