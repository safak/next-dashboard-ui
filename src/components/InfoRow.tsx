import React from 'react';

type RowProps = {
  label: string;
  value: string;
  valueClass?: string;
};

const InfoRow = ({ label, value, valueClass = '' }: RowProps) => (
  <div className="flex justify-between py-2 items-center">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className={`text-sm font-semibold text-right truncate ${valueClass}`}>
      {value}
    </span>
  </div>
);

export default InfoRow;
