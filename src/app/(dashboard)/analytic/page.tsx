'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/StatCard';
import {
  Users2,
  MessageSquareText,
  MessageCircleMore,
  BarChart2,
  NotebookPen,
  FileText,
  MessagesSquare,
} from 'lucide-react';
import { ChartConfig } from '@/components/ui/chart';

// Components
import CategoryBreakdown from '@/components/CategoryBreakdown';
import TopMessagesCard from '@/components/TopMessagesCard';
import PlatformInsightsCard from '@/components/PlatformInsightsCard';
import AddKeywordModal from '@/components/AddKeywordModal';

// Data & Types
import { categoryDetails } from '@/data/mockData';
import type {
  Post as PostType,
  Keyword,
  Comment,
  Author,
} from '@prisma/client';

type PostWithRelations = PostType & {
  comments: (Comment & { author: Author | null })[];
  keywords: Keyword[];
};

// --- Helper Function ---
const processCategoryData = (posts: PostWithRelations[]) => {
  const categoryCounts: { [key: string]: number } = {};
  for (const post of posts) {
    const category = post.category || 'Uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  }

  const colorMap = new Map<string, string>();
  for (const detail of categoryDetails) {
    colorMap.set(detail.name, detail.color);
  }
  const defaultColor = '#9ca3af';

  const chartData = Object.entries(categoryCounts).map(([name, count]) => ({
    name: name,
    count: count,
    fill: colorMap.get(name) || defaultColor,
  }));

  const chartConfig: ChartConfig = {
    count: { label: 'Posts' },
    ...Object.fromEntries(
      Object.keys(categoryCounts).map((name) => [
        name.toLowerCase().replace(/ /g, '-'),
        { label: name, color: colorMap.get(name) || defaultColor },
      ])
    ),
  };
  return { chartData, chartConfig };
};

const PostAnalysisPage = () => {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryChartData, setCategoryChartData] = useState<any[]>([]);
  const [categoryChartConfig, setCategoryChartConfig] = useState<ChartConfig>(
    {}
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keywordToAdd, setKeywordToAdd] = useState<Partial<Keyword> | null>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/posts');
        const allPosts: PostWithRelations[] = await response.json();
        setPosts(allPosts);

        const { chartData, chartConfig } = processCategoryData(allPosts);
        setCategoryChartData(chartData);
        setCategoryChartConfig(chartConfig);
      } catch (error) {
        console.error('Failed to fetch post data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExtractKeywords = (post: PostType) => {
    const dataToStore = { content: post.content, postId: post.id };
    sessionStorage.setItem('textToExtract', JSON.stringify(dataToStore));
    router.push('/keyword-extractor');
  };

  const handleSaveFromModal = async (keywordData: {
    name: string;
    type: string;
  }) => {
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keywordData),
      });
      if (response.ok) {
        alert(`Added "${keywordData.name}" to your Keyword Tracker!`);
        setIsModalOpen(false);
      } else {
        alert('Failed to add keyword.');
      }
    } catch (error) {
      console.error('Error saving keyword:', error);
    }
  };

  // Calculate Stats
  const totalComments = posts.reduce(
    (acc, post) => acc + post.commentsCount,
    0
  );
  const totalReactions = posts.reduce(
    (acc, post) => acc + post.reactionsCount,
    0
  );
  const totalShares = posts.reduce((acc, post) => acc + post.sharesCount, 0);
  const mainKeywordMentions = posts.reduce((acc, post) => {
    post.keywords.forEach((kw) => {
      if (kw.type === 'Main') acc++;
    });
    return acc;
  }, 0);
  const subKeywordMentions = posts.reduce((acc, post) => {
    post.keywords.forEach((kw) => {
      if (kw.type === 'Sub') acc++;
    });
    return acc;
  }, 0);
  const totalEngagements = totalReactions + totalComments + totalShares;

  if (isLoading) return <div className="p-8">Loading Post Analysis...</div>;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {isModalOpen && (
        <AddKeywordModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleSaveFromModal}
          keywordToEdit={keywordToAdd as Keyword | null}
        />
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">Post Analysis</h1>
        <p className="text-gray-500 mt-1">Analyzing categories from posts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Posts"
          value={posts.length.toLocaleString()}
          Icon={FileText}
        />
        <StatCard
          title="Main Keyword Track"
          value={mainKeywordMentions.toLocaleString()}
          Icon={MessageSquareText}
        />
        <StatCard
          title="Sub-Keyword Track"
          value={subKeywordMentions.toLocaleString()}
          Icon={MessageCircleMore}
        />
        <StatCard
          title="Total Comments"
          value={totalComments.toLocaleString()}
          Icon={MessagesSquare}
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CategoryBreakdown
              chartData={categoryChartData}
              chartConfig={categoryChartConfig}
            />
          </div>
          <div className="lg:col-span-1">
            <PlatformInsightsCard />
          </div>
        </div>
        <div>
          <TopMessagesCard messages={posts} onExtract={handleExtractKeywords} />
        </div>
      </div>
    </div>
  );
};

export default PostAnalysisPage;
