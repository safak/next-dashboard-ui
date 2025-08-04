'use client';

import { useCallback, useEffect, useState } from "react";
import jsPDF from "jspdf";

interface jsPDFWithPlugin extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

const getImageBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export default function BulletinPDF() {
  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    fetch("/uploads/rdc.png")
      .then((res) => res.blob())
      .then((blob) => getImageBase64(new File([blob], "rdc.png")))
      .then((base64) => setImageData(base64))
      .catch(console.error);
  }, []);

  const generatePDF = useCallback(() => {
    if (!imageData || typeof imageData !== "string") {
      alert("L’image n’est pas encore chargée ou est invalide.");
      return null;
    }

    const doc = new jsPDF("p", "mm", "a4") as jsPDFWithPlugin;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const frameWidth = pageWidth - margin * 2;

    // --- En-tête simplifié pour raccourcir ---
    const headerHeight = 36;
    doc.setDrawColor(0);
    doc.setLineWidth(0.7);
    doc.rect(margin, margin, frameWidth, 280);
    doc.rect(margin, margin, frameWidth, headerHeight);

    doc.addImage(imageData, "PNG", margin + 3, margin + 3, 18, 18);
    doc.addImage(imageData, "PNG", margin + frameWidth - 21, margin + 3, 18, 18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const headerLines = [
      "REPUBLIQUE DEMOCRATIQUE DU CONGO",
      "MINISTERE DE L'ENSEIGNEMENT PRIMAIRE, SECONDAIRE ET",
      "PROFESSIONNEL",
    ];
    headerLines.forEach((line, i) => {
      doc.text(line, margin + frameWidth / 2, margin + 10 + i * 6, { align: "center" });
    });

    // --- Tableau complexe "Premier semestre" / "Second semestre" ---

    // Position tableau
    const tableX = margin;
    const tableY = margin + headerHeight + 50;
    const tableWidth = frameWidth;
    const tableHeight = 30;

    // Largeurs colonnes tableau :
    // Branche, Premier Semestre, Second Semestre, Exam Repechage %, Sign Prof
    // On subdivise Premier Semestre et Second Semestre en colonnes comme demandé
    const colWidths = [
      40, // Branche
      60, // Premier Semestre (total)
      60, // Second Semestre (total)
      25, // Examen Repechage %
      25, // Sign Prof
    ];

    // Calcul positions colonnes principales
    const colPos = [tableX];
    colWidths.reduce((acc, w) => {
      colPos.push(acc + w);
      return acc + w;
    }, tableX);

    // Colonnes internes Premier semestre (TR JOURN, 1er P, 2e P, EXAM, TOT)
    // Tu voulais 1er P et 2e P dans cadres séparés sous TR JOURN qui recouvre leur largeur
    // Détaillons la subdivision de la colonne Premier semestre (60 mm)
    const premierSemWidths = [20, 20, 20]; // 1erP, 2eP, EXAM+TOT (les deux derniers réunis par simplicité)
    // Mais pour respecter ta demande on découpe comme suit :
    // Premier semestre = 60 mm subdivisé en:
    // - TR JOURN (largeur totale 40mm = 1erP+2eP)
    // - Sous TR JOURN, deux cadres séparés 1erP(20), 2eP(20)
    // - Puis EXAM (10), TOT (10) à droite, total 60 mm.

    // Pour que ça colle on décompose la colonne Premier semestre en 4 colonnes :
    // TR JOURN (largeur 40 mm) => au-dessus 1erP et 2eP séparés de 20 mm chacun
    // EXAM (10 mm)
    // TOT (10 mm)
    // On modifie donc la subdivision comme suit :
    const premierSemSubCols = [20, 20, 10, 10]; // 1erP, 2eP, EXAM, TOT

    // Idem pour second semestre
    const secondSemSubCols = [20, 20, 10, 10]; // 3eP, 4eP, EXAM, TOT

    // Positions colonnes internes premier semestre (relatives à colPos[1])
    const premierSemSubPos = [colPos[1]];
    premierSemSubCols.reduce((acc, w) => {
      premierSemSubPos.push(acc + w);
      return acc + w;
    }, colPos[1]);

    // Positions colonnes internes second semestre (relatives à colPos[2])
    const secondSemSubPos = [colPos[2]];
    secondSemSubCols.reduce((acc, w) => {
      secondSemSubPos.push(acc + w);
      return acc + w;
    }, colPos[2]);

    // Hauteurs pour créer les cadres imbriqués
    const rowHeightTotal = 30;
    const premierSemHeight = rowHeightTotal;
    const premierSemTopHeight = 10; // hauteur cadre "Premier Semestre"
    const premierSemMidHeight = 10; // cadre TR JOURN
    const premierSemBottomHeight = 10; // cadre 1erP et 2eP

    // Même logique second semestre
    const secondSemHeight = rowHeightTotal;
    const secondSemTopHeight = 10;
    const secondSemMidHeight = 10;
    const secondSemBottomHeight = 10;

    // Ligne horizontale découpe 1erP/2eP sous TR JOURN Premier Semestre
    const premierSemBottomY = tableY + premierSemTopHeight + premierSemMidHeight;
    // Ligne horizontale découpe 3eP/4eP sous TR JOURN Second Semestre
    const secondSemBottomY = tableY + secondSemTopHeight + secondSemMidHeight;

    // --- Dessin des cadres principaux ---

    // Cadre général table
   // --- Dessin des cadres principaux ---

doc.setDrawColor(0);
doc.setLineWidth(0.6);
doc.rect(tableX, tableY, tableWidth, tableHeight);

doc.rect(colPos[0], tableY, colWidths[0], rowHeightTotal);

doc.rect(colPos[1], tableY, colWidths[1], premierSemTopHeight); // Cadre Premier semestre haut
doc.rect(colPos[1], tableY + premierSemTopHeight, 40, premierSemMidHeight); // TR JOURN

doc.rect(colPos[1], tableY + premierSemTopHeight + premierSemMidHeight, 20, premierSemBottomHeight); // 1erP
doc.rect(colPos[1] + 20, tableY + premierSemTopHeight + premierSemMidHeight, 20, premierSemBottomHeight); // 2eP

// Fusion cadres EXAM et TOT sur toute la hauteur (30 mm)
doc.rect(colPos[1] + 40, tableY, 10, rowHeightTotal); // EXAM premier semestre
doc.rect(colPos[1] + 50, tableY, 10, rowHeightTotal); // TOT premier semestre

doc.rect(colPos[2], tableY, colWidths[2], secondSemTopHeight); // Second semestre haut
doc.rect(colPos[2], tableY + secondSemTopHeight, 40, secondSemMidHeight); // TR JOURN second semestre

doc.rect(colPos[2], tableY + secondSemTopHeight + secondSemMidHeight, 20, secondSemBottomHeight); // 3eP
doc.rect(colPos[2] + 20, tableY + secondSemTopHeight + secondSemMidHeight, 20, secondSemBottomHeight); // 4eP

// Fusion cadres EXAM et TOT second semestre
doc.rect(colPos[2] + 40, tableY, 10, rowHeightTotal); // EXAM second semestre
doc.rect(colPos[2] + 50, tableY, 10, rowHeightTotal); // TOT second semestre

doc.rect(colPos[3], tableY, colWidths[3], rowHeightTotal);
doc.rect(colPos[4], tableY, colWidths[4], rowHeightTotal);

// --- Texte ---

doc.setFontSize(8);
doc.setFont("helvetica", "bold");
doc.text("BRANCHES", colPos[0] + colWidths[0] / 2, tableY + rowHeightTotal / 2, {
  align: "center",
  baseline: "middle",
});

doc.text(
  "PREMIER SEMESTRE",
  colPos[1] + colWidths[1] / 2,
  tableY + premierSemTopHeight / 2,
  { align: "center", baseline: "middle" }
);

doc.text(
  "TR. JOURN",
  colPos[1] + 40 / 2,
  tableY + premierSemTopHeight + premierSemMidHeight / 2,
  { align: "center", baseline: "middle" }
);

doc.setFontSize(7);
doc.text(
  "1er P",
  colPos[1] + 20 / 2,
  tableY + premierSemTopHeight + premierSemMidHeight + premierSemBottomHeight / 2,
  { align: "center", baseline: "middle" }
);
doc.text(
  "2e P",
  colPos[1] + 20 + 20 / 2,
  tableY + premierSemTopHeight + premierSemMidHeight + premierSemBottomHeight / 2,
  { align: "center", baseline: "middle" }
);

// EXAM et TOT centrés dans leurs cadres fusionnés
doc.setFontSize(8);
doc.text(
  "EXAM",
  colPos[1] + 40 + 10 / 2,
  tableY + rowHeightTotal / 2,
  { align: "center", baseline: "middle" }
);
doc.text(
  "TOT",
  colPos[1] + 50 + 10 / 2,
  tableY + rowHeightTotal / 2,
  { align: "center", baseline: "middle" }
);

doc.setFontSize(8);
doc.text(
  "SECOND SEMESTRE",
  colPos[2] + colWidths[2] / 2,
  tableY + secondSemTopHeight / 2,
  { align: "center", baseline: "middle" }
);

doc.text(
  "TR. JOURN",
  colPos[2] + 40 / 2,
  tableY + secondSemTopHeight + secondSemMidHeight / 2,
  { align: "center", baseline: "middle" }
);

doc.setFontSize(7);
doc.text(
  "3e P",
  colPos[2] + 20 / 2,
  tableY + secondSemTopHeight + secondSemMidHeight + secondSemBottomHeight / 2,
  { align: "center", baseline: "middle" }
);
doc.text(
  "4e P",
  colPos[2] + 20 + 20 / 2,
  tableY + secondSemTopHeight + secondSemMidHeight + secondSemBottomHeight / 2,
  { align: "center", baseline: "middle" }
);

// EXAM et TOT second semestre
doc.setFontSize(8);
doc.text(
  "EXAM",
  colPos[2] + 40 + 10 / 2,
  tableY + rowHeightTotal / 2,
  { align: "center", baseline: "middle" }
);
doc.text(
  "TOT",
  colPos[2] + 50 + 10 / 2,
  tableY + rowHeightTotal / 2,
  { align: "center", baseline: "middle" }
);

doc.text(
  "%",
  colPos[3] + colWidths[3] / 2,
  tableY + rowHeightTotal / 2,
  { align: "center", baseline: "middle" }
);

doc.text(
  "SIGN PROF",
  colPos[4] + colWidths[4] / 2,
  tableY + rowHeightTotal / 2,
  { align: "center", baseline: "middle" }
);

    // --- Fin du tableau ---

    // Sauvegarde PDF
    doc.save("bulletin.pdf");
    return null;
  }, [imageData]);

  return (
    <>
      <button
        onClick={generatePDF}
        className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
      >
        Télécharger Bulletin PDF
      </button>
    </>
  );
}
