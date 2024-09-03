import React from "react";
import { teachersData } from "@/lib/data"; // Adjust the import path as necessary
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react"; // Import icons

const TeacherTable = () => {
  return (
    <Table className="w-full border-collapse shadow-sm">
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead className="font-semibold text-left p-4 w-24">
            Photo
          </TableHead>
          <TableHead className="font-semibold text-left p-4">Name</TableHead>
          <TableHead className="font-semibold text-left p-4">Email</TableHead>
          <TableHead className="font-semibold text-left p-4">Phone</TableHead>
          <TableHead className="font-semibold text-left p-4">
            Subjects
          </TableHead>
          <TableHead className="font-semibold text-left p-4">Classes</TableHead>
          <TableHead className="font-semibold text-left p-4">Address</TableHead>
          <TableHead className="font-semibold text-left p-4">
            Edit/Delete
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teachersData.map((teacher) => (
          <TableRow
            key={teacher.id}
            className="border-b hover:bg-gray-50 transition-colors"
          >
            <TableCell className="p-4">
              <img
                src={teacher.photo}
                alt={teacher.name}
                className="rounded-full w-16 h-16 object-cover border-2 border-gray-200"
              />
            </TableCell>
            <TableCell className="p-4 font-medium">{teacher.name}</TableCell>
            <TableCell className="p-4 text-gray-600">{teacher.email}</TableCell>
            <TableCell className="p-4 text-gray-600">{teacher.phone}</TableCell>
            <TableCell className="p-4">
              {teacher.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1"
                >
                  {subject}
                </span>
              ))}
            </TableCell>
            <TableCell className="p-4">
              {teacher.classes.map((class_, index) => (
                <span
                  key={index}
                  className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1"
                >
                  {class_}
                </span>
              ))}
            </TableCell>
            <TableCell className="p-4 text-gray-600">
              {teacher.address}
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
  );
};

export default TeacherTable;
