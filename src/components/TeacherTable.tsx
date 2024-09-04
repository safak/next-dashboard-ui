"use client";
import React, { useState, useEffect } from "react";
import { teachersData, updateTeacherData, deleteTeacherData } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import EditTeacherDialog from "./EditTeacherDialog";
import Swal from "sweetalert2";

const TeacherTable = ({ searchTerm }: { searchTerm: string }) => {
  const [filteredTeachers, setFilteredTeachers] = useState(teachersData);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    const filtered = teachersData.filter((teacher) =>
      Object.values(teacher).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredTeachers(filtered);
  }, [searchTerm]);

  const handleEdit = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (teacherId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTeacherData(teacherId);
        setFilteredTeachers(
          filteredTeachers.filter((teacher) => teacher.id !== teacherId)
        );
        Swal.fire("Deleted!", "The teacher has been deleted.", "success");
      }
    });
  };

  const handleSave = (updatedTeacher: any) => {
    updateTeacherData(updatedTeacher);
    setFilteredTeachers(
      filteredTeachers.map((teacher) =>
        teacher.id === updatedTeacher.id ? updatedTeacher : teacher
      )
    );
    setIsEditDialogOpen(false);
  };

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
              Subjects
            </TableHead>
            <TableHead className="font-semibold text-left p-4 hidden lg:table-cell">
              Classes
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
          {filteredTeachers.map((teacher) => (
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
              <TableCell className="p-4 text-gray-600 hidden md:table-cell">
                {teacher.email}
              </TableCell>
              <TableCell className="p-4 text-gray-600 hidden md:table-cell">
                {teacher.phone}
              </TableCell>
              <TableCell className="p-4 hidden lg:table-cell">
                {teacher.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1"
                  >
                    {subject}
                  </span>
                ))}
              </TableCell>
              <TableCell className="p-4 hidden lg:table-cell">
                {teacher.classes.map((class_, index) => (
                  <span
                    key={index}
                    className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1"
                  >
                    {class_}
                  </span>
                ))}
              </TableCell>
              <TableCell className="p-4 text-gray-600 hidden xl:table-cell">
                {teacher.address}
              </TableCell>
              <TableCell className="p-4">
                <div className="flex space-x-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    title="Edit"
                    onClick={() => handleEdit(teacher)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Delete"
                    onClick={() => handleDelete(teacher.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isEditDialogOpen && (
        <EditTeacherDialog
          teacher={selectedTeacher}
          onSave={handleSave}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default TeacherTable;
