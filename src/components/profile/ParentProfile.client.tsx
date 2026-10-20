"use client";

import ProfileLayout from "./ProfileLayout";

type Parent = {
  id: string;
  name: string;
  surname: string;
  phone?: string | null;
  img?: string | null;
  lastActiveAt?: Date | null;
};

export default function ParentProfileClient({
  parent,
  editSlot,
}: {
  parent: Parent;
  editSlot: React.ReactNode;
}) {
  const fullName = `${parent.name} ${parent.surname}`;
  const initials = `${parent.name[0]}${parent.surname[0]}`.toUpperCase();

  return (
    <ProfileLayout
      userId={parent.id}
      img={parent.img ?? null}
      initials={initials}
      name={fullName}
      roleLabel="Parent"
      lastActiveAt={parent.lastActiveAt ?? null}
    >
      <Section title="Account Information" editSlot={editSlot}>
        <Info label="Role" value="Parent" />
        <Info label="Name" value={fullName} />
        <Info label="Phone" value={parent.phone ?? "-"} />
        <Info label="User ID" value={parent.id} mono />
      </Section>
    </ProfileLayout>
  );
}

/* ================= HELPERS ================= */

function Section({
  title,
  editSlot,
  children,
}: {
  title: string;
  editSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        {editSlot}
      </div>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Info({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`font-medium ${mono ? "font-mono text-sm" : ""}`}>
        {value}
      </p>
    </div>
  );
}