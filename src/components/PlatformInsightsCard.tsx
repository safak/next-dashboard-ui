'use client'; // This component now fetches its own data

import { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, MoreVertical } from 'lucide-react';
import Link from 'next/link';

// 1. Update the type definition
type InsightStats = {
  totalPosts: number;
  totalComments: number;
  totalTrackedKeywords: number;
};

type PlatformInsight = {
  platform: string;
  stats: InsightStats;
  color: string; // This will be the hex code
};

// 2. Map platform names to just the icon
const platformIconMap: { [key: string]: React.ElementType } = {
  Facebook: Facebook,
  Twitter: Twitter,
  Instagram: Instagram,
  default: MoreVertical,
};

const PlatformInsightsCard = () => {
  const [insights, setInsights] = useState<PlatformInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the new API route
    const fetchData = async () => {
      try {
        const response = await fetch('/api/platform-insights');
        const data = await response.json();
        setInsights(data);
      } catch (error) {
        console.error('Failed to fetch platform insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // The empty array [] means this runs once on component load

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-lg mb-4">Platform Insights</h3>
        <p className="text-gray-500">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Platform Insights</h3>
      </div>
      <div className="space-y-4">
        {insights.map((p) => {
          // 3. Get the correct icon
          const Icon = platformIconMap[p.platform] || platformIconMap.default;

          return (
            <div
              key={p.platform}
              className="border border-gray-100 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  {/* --- 4. THE FIX --- */}
                  {/* Apply the color prop as an inline style */}
                  <Icon className="w-6 h-6" style={{ color: p.color }} />

                  <div className="ml-3">
                    <p className="font-bold text-sm">{p.platform}</p>
                    <p className="text-xs text-gray-500">
                      {p.stats.totalPosts.toLocaleString()} Posts
                    </p>{' '}
                  </div>
                </div>
                <Link href="/data-collection">
                  <button className="text-xs font-semibold text-purple-600 border border-purple-200 px-3 py-1 rounded-lg hover:bg-purple-50">
                    See detail
                  </button>
                </Link>
              </div>

              {/* --- NEW METRICS --- */}
              <div className="flex justify-between text-center">
                <div>
                  <p className="font-bold text-lg text-gray-800">
                    {p.stats.totalPosts.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Total Posts</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-800">
                    {p.stats.totalComments.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Total Comments</p>
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-800">
                    {p.stats.totalTrackedKeywords.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Tracked Keywords</p>
                </div>
              </div>
              {/* --- END NEW METRICS --- */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformInsightsCard;
