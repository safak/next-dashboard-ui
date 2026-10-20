"use client";

import Tooltip from "@/components/ui/Tooltip";
import { Phone, MessageCircle, CheckCircle } from "lucide-react";

type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  classInterested: string | null;
  status?: string;
  createdAt: Date;
};

export default function LeadTable({
  data,
  role,
}: {
  data: Lead[];
  role?: string;
}) {
  const updateStatus = async (id: string) => {
    await fetch("/api/lead/update-status", {
      method: "POST",
      body: JSON.stringify({ id, status: "CONTACTED" }),
    });

    location.reload();
  };

  const statusStyles: any = {
    NEW: "bg-yellow-100 text-yellow-700",
    CONTACTED: "bg-blue-100 text-blue-700",
    CONVERTED: "bg-green-100 text-green-700",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        {/* HEADER */}
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left px-3 py-2">Name</th>
            <th className="text-left px-3 py-2 hidden md:table-cell">
              Phone
            </th>
            <th className="text-left px-3 py-2 hidden md:table-cell">
              Class
            </th>
            <th className="text-left px-3 py-2 hidden md:table-cell">
              Date
            </th>
            <th className="text-left px-3 py-2">Status</th>
            {role === "admin" && (
              <th className="text-center px-3 py-2">Actions</th>
            )}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="cursor-pointer border-b hover:bg-purple-50 transition"
            >
              {/* NAME */}
              <td className="px-3 py-3">
                <div className="font-medium">{item.name || "-"}</div>

                {/* MOBILE */}
                <div className="md:hidden text-[10px] text-gray-500 mt-1">
                  📞 {item.phone} • 🎓 {item.classInterested}
                </div>
              </td>

              <td className="px-3 py-2 hidden md:table-cell">
                {item.phone || "-"}
              </td>

              <td className="px-3 py-2 hidden md:table-cell">
                {item.classInterested || "-"}
              </td>

              <td className="px-3 py-2 hidden md:table-cell">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>

              {/* STATUS */}
              <td className="px-3 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-[10px] ${
                    statusStyles[item.status || "NEW"]
                  }`}
                >
                  {item.status || "NEW"}
                </span>
              </td>

              {/* ACTIONS */}
              {role === "admin" && (
                <td className="px-3 py-2">
                  <div className="flex justify-center gap-2">
                    <Tooltip content="Call">
                      <a
                        href={`tel:${item.phone}`}
                        className="p-1.5 rounded-md hover:scale-110 hover:bg-green-100 text-green-600 transition"
                      >
                        <Phone size={14} />
                      </a>
                    </Tooltip>

                    <Tooltip content="WhatsApp">
                      <a
                        href={`https://wa.me/91${item.phone}`}
                        target="_blank"
                        className="p-1.5 rounded-md hover:scale-110 hover:bg-blue-100 text-blue-600 transition"
                      >
                        <MessageCircle size={14} />
                      </a>
                    </Tooltip>

                    <Tooltip content="Mark Contacted">
                      <button
                        onClick={() => updateStatus(item.id)}
                        className="p-1.5 rounded-md hover:scale-110 hover:bg-purple-100 text-purple-600 transition"
                      >
                        <CheckCircle size={14} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* EMPTY */}
      {data.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          🔍 No leads found
        </div>
      )}
    </div>
  );
}