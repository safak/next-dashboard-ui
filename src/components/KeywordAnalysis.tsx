import React from 'react';

// 1. Define the type locally (or import a compatible one)
// We removed 'sentiment' because your API doesn't provide it, and this chart doesn't use it.
type KeywordData = {
  name: string;
  mentions: number;
};

type ListProps = {
  data: KeywordData[];
};

const KeywordAnalysis = ({ data }: ListProps) => {
  // 2. Calculate the maximum value dynamically
  const maxMentions = Math.max(...data.map((d) => d.mentions), 1);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full">
      <h3 className="text-lg font-bold">Top Keywords</h3>
      <div className="space-y-4 mt-4">
        {data
          .sort((a, b) => b.mentions - a.mentions)
          .map((kw) => (
            <div key={kw.name}>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-semibold">{kw.name}</span>
                <span className="text-gray-500">{kw.mentions} mentions</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                  // Calculate width relative to the maximum value
                  style={{ width: `${(kw.mentions / maxMentions) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default KeywordAnalysis;
