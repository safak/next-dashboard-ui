import { ArrowUp, ArrowDown } from 'lucide-react';

type CardProps = {
  title: string;
  value: string;
  change: number;
  changeText?: string;
};

const AnalyticSummaryCard = ({
  title,
  value,
  change,
  changeText,
}: CardProps) => (
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
    <div
      className={`flex items-center mt-1 text-xs ${
        change >= 0 ? 'text-emerald-600' : 'text-red-600'
      }`}
    >
      {change >= 0 ? (
        <ArrowUp size={14} className="mr-1" />
      ) : (
        <ArrowDown size={14} className="mr-1" />
      )}
      <span>
        {Math.abs(change)}% {changeText}
      </span>
    </div>
  </div>
);

export default AnalyticSummaryCard;
