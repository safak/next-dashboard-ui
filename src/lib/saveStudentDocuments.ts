import { DocumentType, Prisma } from "@prisma/client";

import type { StudentRegistrationFormValues } from "@/lib/formValidationSchemas";
import type { UploadedDocument } from "@/types/document";

export async function saveStudentDocuments(
  tx: Prisma.TransactionClient,
  studentId: string,
  documents: StudentRegistrationFormValues["documents"],
  uploadedBy?: string,
) {
  console.log("========== saveStudentDocuments ==========");
  console.log("Student ID:", studentId);
  console.log("Documents:", JSON.stringify(documents, null, 2));
  const items: {
    documentType: DocumentType;
    document?: UploadedDocument;
  }[] = [
    {
      documentType: DocumentType.BIRTH_CERTIFICATE,
      document: documents.birthCertificate,
    },
    {
      documentType: DocumentType.STUDENT_AADHAAR,
      document: documents.studentAadhaar,
    },
    {
      documentType: DocumentType.TRANSFER_CERTIFICATE,
      document: documents.transferCertificate,
    },
    {
      documentType: DocumentType.PARENT_AADHAAR,
      document: documents.parentAadhaar,
    },
    {
      documentType: DocumentType.ADDRESS_PROOF,
      document: documents.addressProof,
    },
    {
      documentType: DocumentType.MEDICAL_CERTIFICATE,
      document: documents.medicalCertificate,
    },
    {
      // Change this to DocumentType.VACCINATION_RECORD
      // after adding it to your Prisma enum.
      documentType: DocumentType.PREVIOUS_REPORT,
      document: documents.vaccinationRecord,
    },
  ];

  for (const item of items) {
    console.log("Processing:", item.documentType);

    if (!item.document) {
      console.log("Skipped");
      continue;
    }

    console.log("Creating document:", item.document.originalFileName);

    await tx.studentDocument.create({
      data: {
        studentId,
        documentType: item.documentType,
        originalFileName: item.document.originalFileName,
        fileUrl: item.document.fileUrl,
        publicId: item.document.publicId,
        folder: item.document.folder ?? null,
        mimeType: item.document.mimeType,
        fileSize: item.document.fileSize,
        uploadedBy,
      },
    });

    console.log("Inserted");
  }
}
