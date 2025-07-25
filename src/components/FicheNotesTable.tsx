"use client";

import { useState } from "react";

type Note = {
  nom: string;
  className: string;
  postnom: string;
  prenom: string;
  sexe:  string;
  cours: string;
  score: number;
  maxscore: number;
};

type Props = {
  notes: Note[];
};

export default function FicheNotesTable({ notes }: Props) {
  const [editableNotes, setEditableNotes] = useState(notes);

  const handleScoreChange = (index: number, value: number) => {
    const updated = [...editableNotes];
    updated[index].score = value;
    setEditableNotes(updated);

    // TODO: Ajouter ici l'enregistrement via API si nécessaire
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Nom</th>
            <th className="px-4 py-2 text-left">Postnom</th>
            <th className="px-4 py-2 text-left">Prenom</th>
            <th className="px-4 py-2 text-left">Sexe</th>
            <th className="px-4 py-2 text-left">Score</th>
            <th className="px-4 py-2 text-left">Max</th>
          </tr>
        </thead>
        <tbody>
          {editableNotes.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Aucune note à afficher
              </td>
            </tr>
          ) : (
            editableNotes.map((note, i) => (
              <tr key={i} className="even:bg-gray-50">
                <td className="px-4 py-2">{note.nom}</td>
                <td className="px-4 py-2">{note.postnom}</td>
                <td className="px-4 py-2">{note.prenom}</td>
                 <td className="px-4 py-2">{note.sexe}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-20"
                    value={note.score}
                    onChange={(e) => handleScoreChange(i, parseFloat(e.target.value))}
                  />
                </td>
                <td className="px-4 py-2">{note.maxscore}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
