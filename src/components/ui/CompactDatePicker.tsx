"use client";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

type Props = {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  placeholder?: string;
  minDate?: Dayjs;
};

export default function CompactDatePicker({
  value,
  onChange,
  placeholder,
  minDate,
}: Props) {
  return (
    <DatePicker
      value={value}
      onChange={onChange}
      minDate={minDate}
      format="DD/MM/YYYY"
      slotProps={{
        textField: {
          fullWidth: true,
          size: "small",
          placeholder: placeholder,
          InputLabelProps: { shrink: false },
          sx: {
            "& .MuiInputBase-root": {
              height: "32px", // ✅ matches Radix
              fontSize: "12px",
              borderRadius: "8px",
              paddingRight: "4px",
            },
            "& .MuiOutlinedInput-input": {
              padding: "6px 8px !important",
              fontSize: "10px !important",
            },
            "& input::placeholder": {
              fontSize: "11px",
              opacity: 0.7,
            },
          },
        },
        openPickerButton: {
          sx: {
            padding: "2px",
          },
        },
        openPickerIcon: {
          sx: {
            fontSize: "14px", // ✅ small icon
          },
        },
        popper: { sx: { zIndex: 999999 } },
      }}
    />
  );
}