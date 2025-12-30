'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  SlidersHorizontal,
  Frown,
  Facebook,
  FileText,
} from 'lucide-react';
// Import the redesigned StatCard (make sure you updated the component file!)
import StatCard from '@/components/StatCard';
import SentimentAreaChart from '@/components/SentimentAreaChart';
import PlatformPerformance from '@/components/PlatformPerformance';
import KeywordAnalysis from '@/components/KeywordAnalysis';
// Import icons for the StatCards
import {
  Users2,
  MessageSquareText,
  BarChart2,
  ThumbsUp,
  NotebookPen,
} from 'lucide-react';
import SentimentOverview from '@/components/SentimentOverview';

// --- 1. Define Types ---
interface AnalyticData {
  date: string;
  [key: string]: any;
}
interface PlatformData {
  name: string;
  mentions: number;
}
interface TopKeywordData {
  name: string;
  mentions: number;
}

// --- 2. Define the API Response Type ---
interface AnalyticsResponse {
  analyticData: AnalyticData[];
  platformPerformance: PlatformData[];
  topKeywords: TopKeywordData[];
  sentimentOverview: any[];
  summary: {
    totalMentions: number;
  };
}

const Overviewpage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [analyticData, setAnalyticData] = useState<AnalyticData[]>([]);
  const [platformData, setPlatformData] = useState<PlatformData[]>([]);
  const [topKeywordsData, setTopKeywordsData] = useState<TopKeywordData[]>([]);
  const [totalMentions, setTotalMentions] = useState(0);
  const [sentimentOverview, setSentimentOverview] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics');

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const data: AnalyticsResponse = await response.json();

        setAnalyticData(data.analyticData);
        setPlatformData(data.platformPerformance);
        setTopKeywordsData(data.topKeywords);
        setTotalMentions(data.summary.totalMentions);
        setSentimentOverview(data.sentimentOverview);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading Overview...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* --- NEW HEADER SECTION --- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white shadow-lg">
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Overview</h1>
            <p className="mt-2 text-purple-100">
              High-level insights for the last 30 days.
            </p>
          </div>

          {/* Header Buttons */}
          {/* <div className="flex items-center space-x-2">
            <button className="flex items-center text-sm bg-white/10 text-white border border-white/20 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm">
              <SlidersHorizontal size={16} className="mr-2" />
              Filters
            </button>
            <button className="flex items-center text-sm bg-white text-purple-600 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md">
              <Download size={16} className="mr-2" />
              Export Report
            </button>
          </div> */}
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
      </div>
      {/* --- END NEW HEADER --- */}

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Posts"
          changeText="vs last month"
          value={totalMentions.toLocaleString()}
          Icon={FileText} // Pass the icon component
        />
        <StatCard
          title="Negative Sentiment"
          value="5"
          changeText="Comments"
          Icon={Frown}
        />
        <StatCard title="Top Platform" value="Facebook" Icon={Facebook} />
        <StatCard
          title="Top Keyword"
          value={topKeywordsData.length > 0 ? topKeywordsData[0].name : 'N/A'}
          Icon={MessageSquareText}
        />
      </div>

      {/* --- MAIN CHARTS --- */}
      <div className="lg:col-span-1"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformPerformance data={platformData} />
        <KeywordAnalysis data={topKeywordsData} />
      </div>
    </div>
  );
};

export default Overviewpage;
