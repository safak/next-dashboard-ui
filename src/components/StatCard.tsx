import { ArrowUp, ArrowDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  Icon: LucideIcon;
  change?: number;
  changeText?: string;
};

const StatCard = ({
  title,
  value,
  change,
  changeText,
  Icon,
}: StatCardProps) => {
  const isPositive = change ? change >= 0 : undefined;

  return (
    <div className="flex-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-default group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              isPositive
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {isPositive ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
          {value}
        </h2>
      </div>

      {changeText && <p className="text-xs text-gray-400 mt-2">{changeText}</p>}
    </div>
  );
};

export default StatCard;
