"use client";

import { useRouter } from "next/navigation";
import { payFee } from "@/lib/payFee";

type PayFeeButtonProps = {
  amount: number;
  studentFeeId: number;
  parentMobile?: string | null;
  parentName?: string | null;
  parentEmail?: string | null;
};

export default function PayFeeButton({
  amount,
  studentFeeId,
  parentMobile,
  parentName,
  parentEmail,
}: PayFeeButtonProps) {
  const router = useRouter();

  const handlePay = async () => {
    await payFee(
      amount,
      studentFeeId,
      {
        name: parentName,
        email: parentEmail,
        contact: parentMobile,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };

  return (
    <button
      type="button"
      onClick={handlePay}
      className="
        rounded-lg
        bg-[#4B517D]
        px-3
        py-1.5
        text-[10px]
        font-bold
        text-white
        transition
        hover:bg-[#3F456A]
      "
    >
      Pay Now
    </button>
  );
}
