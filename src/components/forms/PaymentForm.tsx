"use client";

import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { PaymentSchema } from "@/lib/formValidationSchemas";
import { createPayment } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, User, Pencil } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
interface Fee {
  id: number;
  label: string;
  amount: number;
  period?: {
    label: string;
  };
}
// Exemple d’un paiement
interface Payment {
  id: string;
  studentId: string;
  feeId: number;
  amount: number;
}

const PaymentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const { fees = [], classs = [], payments = [] } = relatedData || {};

  // Supprimer les doublons de frais par année scolaire (fee.period.label)
  const uniqueFeesByYear = fees.reduce((acc: any[], fee: any) => {
    const yearLabel = fee?.period?.label;
    if (!yearLabel) return acc;
    const alreadyExists = acc.some((f) => f?.period?.label === yearLabel);
    if (!alreadyExists) acc.push(fee);
    return acc;
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PaymentSchema>({
    defaultValues: {
      id: data?.id ?? "",
      studentId: data?.id ?? "",
      name: data?.name ?? "",
      surname: data?.surname ?? "",
      username: data?.username ?? "",
      classId: data?.classId ?? 0,
      feeId: data?.feeId ?? 0,
      amount: data?.amount ?? 0,
      amount_: data?.amount ?? 0,
      label: data?.label ?? "",
    },
  });

  const [date, setDate] = useState<Date | undefined>(new Date());
  const currentClass = classs.find((c: any) => c.id === watch("classId"));
  const [state, setState] = useState({ success: false, error: false, message: "" });
  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const result =
        type === "create"
          ? await createPayment(state, { ...formData })
          : await createPayment(state, { ...formData });

      setState({ success: result.success, error: result.error, message: result.message });

      if (result.success) {
        toast(`Payment has been ${type === "create" ? "created" : "updated"}!`);
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      setState({ success: false, error: true });
    }
  });
  useEffect(() => {
    if (state.success) {
      toast(`Payment has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state.success, router, type, setOpen]);
  const amount = watch("amount");

  // Total payé par cet élève pour ce frais
  const selectedFeeId = Number(watch("feeId"));
  const studentId = watch("id");
  const feeId = Number(watch("feeId")); // <- cette ligne est cruciale
  const [alreadyPaid, setAlreadyPaid] = useState(0);
  useEffect(() => {
    if (studentId && feeId) {
      const totalPaid = payments
        .filter(
          (p: Payment) =>
            String(p.studentId) === String(studentId) &&
            Number(p.feeId) === Number(feeId)
        )
        .reduce((total: number, p: Payment) => total + p.amount, 0);

      //console.log("Total déjà payé:", totalPaid);
      setAlreadyPaid(totalPaid);
    } else {
      setAlreadyPaid(0);
    }
  }, [studentId, feeId, payments]);

  return (
    <form onSubmit={onSubmit}>
      <div className="max-w-xl mx-auto border p-6 rounded-lg shadow-sm space-y-6 bg-white">
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Create a new payment" : "Update the payment"}
        </h1>

        {/* Category & Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-center">Categories Frais</Label>
            <Select
              onValueChange={(value) => {
                const feeId = Number(value); // <- conversion ici
                const selectedFee = fees.find((fee: any) => fee.id === feeId);
                setValue("feeId", feeId); // <- set as number
                if (selectedFee) setValue("amount", selectedFee.amount);
              }}
              defaultValue={data?.feeId?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un frais" />
              </SelectTrigger>
              <SelectContent>
                {fees.map((f: Fee) => (
                  <SelectItem key={f.id} value={f.id.toString()}>
                    {f.label} - {f.period?.label ?? "Période inconnue"} ($
                    {f.amount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.feeId && (
              <p className="text-sm text-red-500">{errors.feeId.message}</p>
            )}
          </div>

          <div>
            <Label className="text-center">Montant USD | CDF</Label>
            <div className="flex max-w-sm items-center gap-2">
              <Input
                type="number"
                placeholder="$0.00"
                {...register("amount_")}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
              <Input type="number" placeholder="CDF0.00" />
            </div>
          </div>
        </div>

        {/* Refund Switch & Total */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="is-refund">
              {watch("name")} {watch("surname")}{" "}
              {watch("username") || "No name provided"} -{" "}
              <strong>{currentClass?.name ?? "No class"}</strong>
            </Label>
          </div>
          <div className="text-muted-foreground">
            Total: ${Number(amount || 0).toFixed(2)}
            {selectedFeeId !== 0 && (
              <>
                {" "}
                | Déjà payé:{" "}
                <span className="text-green-600">
                  ${alreadyPaid.toFixed(2)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Account & Années scolaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Account</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Espèce" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wallet">Espèce</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="emoney">E-money</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Années scolaires</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="2024-2025" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2024-2025</SelectItem>
                <SelectItem value="2026">2025-2026</SelectItem>
                <SelectItem value="2027">2026-2027</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MM/dd/yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Time</Label>
            <Input type="time" defaultValue="15:32" />
          </div>
        </div>

        {/* From */}
        <div>
          <Label>From (Optional)</Label>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <Input />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label>Notes (Optional)</Label>
          <div className="flex items-start space-x-2">
            <Pencil className="w-4 h-4 text-muted-foreground mt-2" />
            <Textarea rows={3} />
          </div>
        </div>
        {state?.error && 
        <p className="text-red-600 text-sm">{state.error}</p>}
        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button className="btn-sm btn btn-warning" type="reset">
            Cancel
          </button>
          <button className="btn-sm btn btn-success">
            {type === "create" ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PaymentForm;
