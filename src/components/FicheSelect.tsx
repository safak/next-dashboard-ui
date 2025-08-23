"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  id: number;
  name: string;
};

type Props = {
  classId?: number;
  subjectId?: number;
  periodId?: number;
  classes: Option[];
  subjects: Option[];
  periodes: Option[];
};

export default function FicheFilterClient({
  classId,
  subjectId,
  periodId,
  classes,
  subjects,
  periodes,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex space-x-4 mb-6">
      <Select
        value={classId?.toString() || "all"}
        onValueChange={(val) => updateParam("classId", val)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Toutes les classes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les classes</SelectItem>
          {classes.map((c) => (
            <SelectItem key={c.id} value={c.id.toString()}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={subjectId?.toString() || "all"}
        onValueChange={(val) => updateParam("subjectId", val)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Toutes les matières" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les matières</SelectItem>
          {subjects.map((s) => (
            <SelectItem key={s.id} value={s.id.toString()}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={periodId?.toString() || "all"}
        onValueChange={(val) => updateParam("periodId", val)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Toutes les périodes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les périodes</SelectItem>
          {periodes.map((p) => (
            <SelectItem key={p.id} value={p.id.toString()}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
