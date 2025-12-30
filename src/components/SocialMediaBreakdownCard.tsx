import { ArrowUp, Facebook, Twitter, Instagram } from 'lucide-react';
import type { SocialMediaCardData } from '@/data/mockData';

type CardProps = {
  data: SocialMediaCardData;
};

// A simple way to map names to icons
const iconMap = {
  Facebook: <Facebook className="w-5 h-5 text-blue-500" />,
  Twitter: <Twitter className="w-5 h-5 text-sky-400" />,
  Instagram: <Instagram className="w-5 h-5 text-pink-500" />,
};

const SocialMediaBreakdownCard = ({ data }: CardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
    <h3 className="font-bold text-lg">Social Media Channel Breakdown</h3>

    <div className="flex items-center mt-4 mb-6">
      <p className="text-3xl font-bold mr-2">
        {data.totalMessages.toLocaleString()}
      </p>
      <span className="flex items-center text-emerald-600 font-semibold bg-emerald-100 px-2 py-1 rounded-full text-sm">
        <ArrowUp size={14} /> {data.changePercentage}%
      </span>
    </div>

    <ul className="space-y-4">
      {data.channels.map((item) => (
        <li key={item.name}>
          {/* This is the top part with the icon, name, and stats */}
          <div className="flex items-center justify-between mb-1 text-sm">
            <div className="flex items-center">
              {iconMap[item.name]}
              <span className="ml-2 font-semibold">{item.name}</span>
            </div>
            <div>
              <span className="font-bold">{item.value.toLocaleString()}</span>
              <span
                className={`ml-2 font-bold ${
                  item.percentageChange > 0
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }`}
              >
                {item.percentageChange > 0 ? '↑' : '↓'} {item.percentageChange}%
              </span>
            </div>
          </div>

          {/* THIS IS THE PROGRESS BAR SECTION */}
          {/* Outer gray "track" */}
          <div className="w-full h-1.5 bg-gray-200 rounded-full ">
            {/* Inner colored "fill" */}
            <div
              className="h-1.5 rounded-full"
              style={{
                backgroundColor: item.color,
                width: `${item.progress}%`,
              }}
            ></div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default SocialMediaBreakdownCard;
