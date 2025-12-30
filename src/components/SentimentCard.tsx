import { ArrowUp } from 'lucide-react';
import type { SentimentData } from '@/data/mockData'; // Import the type

type SentimentCardProps = {
  data: SentimentData;
};

const SentimentCard = ({ data }: SentimentCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-lg">Sentiment</h3>
      <span className="text-sm text-gray-500">23:06</span>
    </div>

    <div className="mt-4">
      <div className="flex items-center mb-2">
        <p className="text-3xl font-bold mr-2">
          {data.totalMessages.toLocaleString()}
        </p>
        <span className="flex items-center text-emerald-600 font-semibold bg-emerald-100 px-2 py-1 rounded-full text-sm">
          <ArrowUp size={14} /> {data.changePercentage}%
        </span>
      </div>

      <div className="flex w-full h-2.5 rounded-full overflow-hidden my-4 bg-gray-200">
        <div
          className="bg-emerald-400"
          style={{ width: `${data.positive.percentage}%` }}
        ></div>
        <div
          className="bg-amber-400"
          style={{ width: `${data.neutral.percentage}%` }}
        ></div>
        <div
          className="bg-red-400"
          style={{ width: `${data.negative.percentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm">
        <div className="text-left">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
            Positive
          </div>
          <p className="font-bold mt-1">
            {data.positive.count.toLocaleString()}
          </p>
          <p className="text-gray-500 text-xs">
            Messages ({data.positive.percentage}%)
          </p>
        </div>
        <div className="text-left">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
            Neutral
          </div>
          <p className="font-bold mt-1">
            {data.neutral.count.toLocaleString()}
          </p>
          <p className="text-gray-500 text-xs">
            Messages ({data.neutral.percentage}%)
          </p>
        </div>
        <div className="text-left">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
            Negative
          </div>
          <p className="font-bold mt-1">
            {data.negative.count.toLocaleString()}
          </p>
          <p className="text-gray-500 text-xs">
            Messages ({data.negative.percentage}%)
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default SentimentCard;
