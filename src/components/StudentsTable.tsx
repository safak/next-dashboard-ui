"use client";
import React, { useState, useEffect } from "react";
import { studentsData } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

const StudentsTable = ({ searchTerm }: { searchTerm: string }) => {
  const [filteredStudents, setFilteredStudents] = useState(studentsData);

  useEffect(() => {
    const filtered = studentsData.filter((student) =>
      Object.values(student).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredStudents(filtered);
  }, [searchTerm]);

  return (
    <div className="overflow-x-auto">
      <Table className="w-full border-collapse shadow-sm">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-semibold text-left p-4 w-24">
              Photo
            </TableHead>
            <TableHead className="font-semibold text-left p-4">Name</TableHead>
            <TableHead className="font-semibold text-left p-4 hidden md:table-cell">
              Email
            </TableHead>
            <TableHead className="font-semibold text-left p-4 hidden md:table-cell">
              Phone
            </TableHead>
            <TableHead className="font-semibold text-left p-4 hidden lg:table-cell">
              Grade
            </TableHead>
            <TableHead className="font-semibold text-left p-4 hidden lg:table-cell">
              Class
            </TableHead>
            <TableHead className="font-semibold text-left p-4 hidden xl:table-cell">
              Address
            </TableHead>
            <TableHead className="font-semibold text-left p-4">
              Edit/Delete
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((student) => (
            <TableRow
              key={student.id}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <TableCell className="p-4">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="rounded-full w-16 h-16 object-cover border-2 border-gray-200"
                />
              </TableCell>
              <TableCell className="p-4 font-medium">{student.name}</TableCell>
              <TableCell className="p-4 text-gray-600 hidden md:table-cell">
                {student.email}
              </TableCell>
              <TableCell className="p-4 text-gray-600 hidden md:table-cell">
                {student.phone}
              </TableCell>
              <TableCell className="p-4 hidden lg:table-cell">
                {student.grade}
              </TableCell>
              <TableCell className="p-4 hidden lg:table-cell">
                {student.class}
              </TableCell>
              <TableCell className="p-4 text-gray-600 hidden xl:table-cell">
                {student.address}
              </TableCell>
              <TableCell className="p-4">
                <div className="flex space-x-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentsTable;
