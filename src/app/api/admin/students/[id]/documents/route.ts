import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DocumentType } from "@prisma/client";

const REQUIRED_DOCUMENTS = [
  {
    type: DocumentType.BIRTH_CERTIFICATE,
    title: "Birth Certificate",
  },
  {
    type: DocumentType.STUDENT_AADHAAR,
    title: "Student Aadhaar",
  },
  {
    type: DocumentType.STUDENT_PHOTO,
    title: "Student Photo",
  },
  {
    type: DocumentType.TRANSFER_CERTIFICATE,
    title: "Transfer Certificate",
  },
  {
    type: DocumentType.ADDRESS_PROOF,
    title: "Address Proof",
  },
  {
    type: DocumentType.PARENT_AADHAAR,
    title: "Parent Aadhaar",
  },
  {
    type: DocumentType.MEDICAL_CERTIFICATE,
    title: "Medical Certificate",
  },
  {
    type: DocumentType.PREVIOUS_REPORT,
    title: "Previous School Report",
  },
  {
    type: DocumentType.CASTE_CERTIFICATE,
    title: "Caste Certificate",
  },
];

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found.",
        },
        {
          status: 404,
        },
      );
    }

    console.log("Route studentId:", id);

    const uploadedDocuments = await prisma.studentDocument.findMany({
      where: {
        studentId: id,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    console.log(JSON.stringify(uploadedDocuments, null, 2));

    console.log({
      id: student?.id,
      admissionNo: student?.admissionNo,
      name: student?.name,
      surname: student?.surname,
    });

    const documents = REQUIRED_DOCUMENTS.map((required) => {
      const uploaded = uploadedDocuments.find(
        (doc) => doc.documentType === required.type,
      );

      if (!uploaded) {
        return {
          id: 0,
          title: required.title,
          type: required.type,
          status: "MISSING",
        };
      }

      return {
        id: uploaded.id,
        title: required.title,
        type: required.type,
        status: "UPLOADED",
        originalFileName: uploaded.originalFileName,
        publicId: uploaded.publicId,
        fileUrl: uploaded.fileUrl,
        uploadedAt: uploaded.uploadedAt,
      };
    });

    const uploaded = documents.filter((d) => d.status === "UPLOADED").length;

    const missing = documents.filter((d) => d.status === "MISSING").length;

    console.log("Mapped documents:");
    console.log(JSON.stringify(documents, null, 2));

    return NextResponse.json({
      success: true,

      summary: {
        uploaded,
        missing,
        total: REQUIRED_DOCUMENTS.length,
      },

      documents,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load documents.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await params;

    const formData = await request.formData();

    const documentType = formData.get("documentType") as string;

    console.log("POST Student:", id);
    console.log("POST Document Type:", documentType);

    const file = formData.get("file") as File | null;

    if (!documentType || !file) {
      return NextResponse.json(
        {
          success: false,
          message: "Document type and file are required.",
        },
        {
          status: 400,
        },
      );
    }

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found.",
        },
        {
          status: 404,
        },
      );
    }

    // ---------------------------------------------------
    // TODO
    // Upload file to Cloudinary / Azure / AWS S3
    // ---------------------------------------------------

    // Example
    //
    // const upload = await uploadToCloudinary(file)
    //
    // const fileUrl = upload.secure_url

    const fileUrl = `/uploads/${file.name}`;

    const existing = await prisma.studentDocument.findFirst({
      where: {
        studentId: id,
        documentType: documentType as DocumentType,
      },
    });

    if (existing) {
      const updated = await prisma.studentDocument.update({
        where: {
          id: existing.id,
        },
        data: {
          originalFileName: file.name,
          fileUrl,
          publicId: "...",
          uploadedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Document replaced successfully.",
        document: updated,
      });
    }

    const document = await prisma.studentDocument.create({
      data: {
        studentId: id,
        documentType: documentType as DocumentType,
        originalFileName: file.name,
        fileUrl,
        publicId: "...",
        uploadedBy: "Admin",
      },
    });

    const verify = await prisma.studentDocument.findMany({
      where: {
        studentId: id,
      },
    });

    console.log("Documents after upload");
    console.log(verify);

    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully.",
      document,
    });
  } catch (error) {
    console.error("DOCUMENT API ERROR");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
