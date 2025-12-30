// ... keep your existing interfaces and data
import { Instagram, Twitter, Facebook, LucideIcon } from 'lucide-react';

// This is the shape of our data for the sentiment card
export interface SentimentData {
  totalMessages: number;
  changePercentage: number;
  positive: {
    count: number;
    percentage: number;
  };
  neutral: {
    count: number;
    percentage: number;
  };
  negative: {
    count: number;
    percentage: number;
  };
}

// Here is the actual data, based on your example
export const sentimentData: SentimentData = {
  totalMessages: 177496,
  changePercentage: 24,
  positive: {
    count: 11049,
    percentage: 6.22,
  },
  neutral: {
    count: 161461,
    percentage: 90.97,
  },
  negative: {
    count: 4986,
    percentage: 2.81,
  },
};

export interface SocialMediaChannel {
  name: 'Facebook' | 'Twitter' | 'Instagram';
  value: number;
  percentageChange: number;
  progress: number;
  color: string;
}

export interface SocialMediaCardData {
  totalMessages: number;
  changePercentage: number;
  channels: SocialMediaChannel[];
}

// The actual data for the card
// ... SocialMediaCardData interface is the same

export const socialMediaCardData: SocialMediaCardData = {
  totalMessages: 177496,
  changePercentage: 24,
  channels: [
    // Change the 'color' property to a hex code
    {
      name: 'Facebook',
      value: 14231,
      percentageChange: 72.08,
      progress: 70,
      color: '#3b82f6',
    }, // blue-500
    {
      name: 'Twitter',
      value: 3207,
      percentageChange: 2.13,
      progress: 15,
      color: '#38bdf8',
    }, // sky-400
    {
      name: 'Instagram',
      value: 1084,
      percentageChange: 20.08,
      progress: 15,
      color: '#ec4899',
    }, // pink-500
  ],
};

// New interface for a single platform insight
export interface PlatformInsight {
  platform: string;
  posts: string;
  positive: number;
  neutral: number;
  negative: number;
  Icon: LucideIcon;
}

// The actual data for the card
export const platformInsightsData: PlatformInsight[] = [
  {
    platform: 'Instagram',
    posts: '5,000 Posts',
    positive: 9431,
    neutral: 12314,
    negative: 2314,
    Icon: Instagram,
  },
  {
    platform: 'Twitter',
    posts: '1,000 Posts',
    positive: 2765,
    neutral: 5689,
    negative: 156,
    Icon: Twitter,
  },
  {
    platform: 'Facebook',
    posts: '6,000 Posts',
    positive: 12576,
    neutral: 72567,
    negative: 3651,
    Icon: Facebook,
  },
];

// New interfaces for this card
export interface CalendarDay {
  day: string;
  date: number;
  active?: boolean;
}

export interface TopMessage {
  time: string;
  platform: string;
  message: string;
  images: number;
  imageUrls: string[];
  PlatformIcon: LucideIcon;
}

// Data for the calendar week view
export const calendarDaysData: CalendarDay[] = [
  { day: 'Mon', date: 15 },
  { day: 'Tue', date: 16 },
  { day: 'Wed', date: 17 },
  { day: 'Thu', date: 18 },
  { day: 'Fri', date: 19, active: true },
  { day: 'Sat', date: 20 },
  { day: 'Sun', date: 21 },
];

// Data for the top messages
export const topMessagesData: TopMessage[] = [
  {
    time: '12:00',
    platform: 'Instagram',
    message: 'Receive news and announcements from the college',
    images: 5,
    imageUrls: ['/annocement1.png', '/annocement2.png'],
    PlatformIcon: Instagram,
  },
  {
    time: '12:30',
    platform: 'Facebook',
    message: 'Receive news and announcements from the college',
    images: 5,
    imageUrls: ['/annocement3.png', '/MUICbuilding.png'],
    PlatformIcon: Facebook,
  },
  {
    time: '13:30',
    platform: 'Twitter',
    message: 'Receive news and announcements from the college',
    images: 0,
    imageUrls: [],
    PlatformIcon: Twitter,
  },
  {
    time: '17:00',
    platform: 'Instagram',
    message: 'Receive news and announcements from the college',
    images: 3,
    imageUrls: ['/vza.jpg', '/MUICbuilding2.png'],
    PlatformIcon: Instagram,
  },
  {
    time: '17:00',
    platform: 'Twitter',
    message: 'Receive news and announcements from the college',
    images: 0,
    imageUrls: [],
    PlatformIcon: Twitter,
  },
];

//Keyword Tracker
// New interface for a keyword
export interface Keyword {
  id: number;
  name: string;
  mentions: number;
  positive: number;
  neutral: number;
  negative: number;
  type?: string; // Optional type property
}

// Data for the keyword tracker
export const initialKeywords: Keyword[] = [
  {
    id: 1,
    name: 'Mahidol University',
    mentions: 1204,
    positive: 65,
    neutral: 25,
    negative: 10,
  },
  {
    id: 2,
    name: 'MUIC',
    mentions: 987,
    positive: 72,
    neutral: 20,
    negative: 8,
  },
  {
    id: 3,
    name: 'Salaya',
    mentions: 452,
    positive: 50,
    neutral: 45,
    negative: 5,
  },
  {
    id: 4,
    name: 'Admission',
    mentions: 312,
    positive: 40,
    neutral: 50,
    negative: 10,
  },
  {
    id: 5,
    name: 'Graduation',
    mentions: 189,
    positive: 85,
    neutral: 15,
    negative: 0,
  },
];

//Sentiment Trend
// New interface for sentiment trend data points
export interface SentimentPoint {
  date: string;
  Positive: number;
  Neutral: number;
  Negative: number;
}
// Data for the line chart and table
export const sentimentTrendsData: SentimentPoint[] = [
  { date: '01 Sep', Positive: 400, Neutral: 240, Negative: 100 },
  { date: '02 Sep', Positive: 300, Neutral: 139, Negative: 80 },
  { date: '03 Sep', Positive: 200, Neutral: 980, Negative: 200 },
  { date: '04 Sep', Positive: 278, Neutral: 390, Negative: 150 },
  { date: '05 Sep', Positive: 189, Neutral: 480, Negative: 50 },
  { date: '06 Sep', Positive: 239, Neutral: 380, Negative: 120 },
  { date: '07 Sep', Positive: 349, Neutral: 430, Negative: 110 },
  { date: '08 Sep', Positive: 400, Neutral: 240, Negative: 100 },
  { date: '09 Sep', Positive: 300, Neutral: 139, Negative: 80 },
  { date: '10 Sep', Positive: 200, Neutral: 980, Negative: 200 },
  { date: '11 Sep', Positive: 278, Neutral: 390, Negative: 150 },
  { date: '12 Sep', Positive: 189, Neutral: 480, Negative: 50 },
  { date: '13 Sep', Positive: 239, Neutral: 380, Negative: 120 },
  { date: '14 Sep', Positive: 349, Neutral: 430, Negative: 110 },
];

// Data for the filter buttons
export const keywords = [
  'All Keywords',
  'Mahidol University',
  'MUIC',
  'Salaya',
  'Admission',
  'Graduation',
  'Exam',
];

interface KeywordWithStatus {
  text: string;
  status: 'new' | 'existing' | 'linked';
  relevance?: number; // Keep relevance as optional
}

interface KeywordStats {
  wordCount: number;
  keywordsFound: number;
}

// Update ExtractorResults to use the new type
export interface ExtractorResults {
  mainKeywords: KeywordWithStatus[];
  subKeywords: KeywordWithStatus[];
  stats: KeywordStats;
}

//Data-collection
export interface DataSource {
  id: number;
  platform: string;
  status: 'Active' | 'Paused';
  keywords: string[];
  lastCollected: string;
  color: string; // We will use hex codes
}

// Data for the Data Collection page
export const initialSources: DataSource[] = [
  {
    id: 1,
    platform: 'Facebook',
    status: 'Active',
    keywords: ['Mahidol', 'MUIC'],
    lastCollected: '2025-10-19 14:30',
    color: '#3b82f6',
  }, // blue-500
  {
    id: 2,
    platform: 'Twitter',
    status: 'Active',
    keywords: ['Mahidol University', 'Salaya'],
    lastCollected: '2025-10-19 16:00',
    color: '#0ea5e9',
  }, // sky-500
  {
    id: 3,
    platform: 'Instagram',
    status: 'Paused',
    keywords: ['MUIC'],
    lastCollected: '2025-10-18 12:00',
    color: '#f43f5e',
  }, // rose-500
  {
    id: 4,
    platform: 'News API',
    status: 'Active',
    keywords: ['Mahidol'],
    lastCollected: '2025-10-19 15:00',
    color: '#10b981',
  }, // emerald-500
];

// Analytic
export interface AnalyticPoint {
  date: string;
  Positive: number;
  Neutral: number;
  Negative: number;
}
export const analyticData: AnalyticPoint[] = [
  { date: 'Sep 01', Positive: 250, Neutral: 150, Negative: 50 },
  { date: 'Sep 05', Positive: 300, Neutral: 200, Negative: 75 },
  { date: 'Sep 10', Positive: 280, Neutral: 180, Negative: 60 },
  { date: 'Sep 15', Positive: 350, Neutral: 220, Negative: 80 },
  { date: 'Sep 20', Positive: 400, Neutral: 250, Negative: 90 },
  { date: 'Sep 25', Positive: 380, Neutral: 240, Negative: 85 },
  { date: 'Sep 30', Positive: 420, Neutral: 260, Negative: 95 },
];

export interface PlatformPoint {
  name: string;
  mentions: number;
}
export const platformData: PlatformPoint[] = [
  { name: 'Facebook', mentions: 4320 },
  { name: 'Twitter', mentions: 3207 },
  { name: 'Instagram', mentions: 1084 },
  { name: 'News API', mentions: 890 },
];

export interface TopKeyword {
  name: string;
  mentions: number;
  sentiment: number;
}
export const topKeywordsData: TopKeyword[] = [
  { name: 'MUIC', mentions: 987, sentiment: 72 },
  { name: 'Admission', mentions: 312, sentiment: 40 },
  { name: 'Salaya', mentions: 452, sentiment: 50 },
  { name: 'Graduation', mentions: 189, sentiment: 85 },
];

//Profile Page
export interface UserProfile {
  fullName: string;
  thaiName: string;
  studyInfo: {
    id: string;
    status: string;
    major: string;
    intake: string;
  };
  accounts: {
    muic: string;
    email: string;
  };
  personalInfo: {
    thaiId: string;
    birthDate: string;
    gender: string;
    phone: string;
    address: string;
  };
}

export const userProfileData: UserProfile = {
  fullName: 'Mr. VZA',
  thaiName: 'วีซ่าาาาาา',
  studyInfo: {
    id: '6481161',
    status: 'Studying',
    major: '[ ICCI ], Computer Engineering',
    intake: 'Y2021T3',
  },
  accounts: {
    muic: '6481161',
    email: 'jinaphat.gun@student.mahidol.ac.th',
  },
  personalInfo: {
    thaiId: '123456789',
    birthDate: '01/01/2001',
    gender: 'Male',
    phone: '061234567',
    address:
      '999 Phutthamonthon Sai 4 Rd, Tambon Salaya, Amphoe Phutthamonthon, Chang Wat Nakhon Pathom 73170',
  },
};

// Data for the Category Breakdown chart
export const categoryDetails = [
  { name: 'Systemic Annoucements', color: 'oklch(62.7% 0.265 303.9)' }, // purple-500
  { name: 'Events', color: 'oklch(62.3% 0.214 259.815)' }, // blue-500
  { name: 'Promotions&Special deals', color: 'oklch(72.3% 0.219 149.579)' }, // green-500
  { name: 'Opportunity&Recruitment', color: '#eab308' }, // yellow-500
  { name: 'Guides', color: '#0ea5e9' }, // sky-500
  { name: 'miscellaneous', color: '#9ca3af' }, // gray-400
  { name: 'Warning annoucements', color: '#ef4444' }, // red-500
  { name: 'Uncategorized', color: '#9ca3af' }, // gray-400 (for any unmatched posts)
];

// Data for the recharts component
export const categoryChartData = [
  {
    name: 'Categories',
    Events: 13,
    Guides: 25,
    miscellaneous: 12,
    Opportunities: 5,
    Promotion: 20,
    'Systemic Announcements': 10,
    'Warning annoucements': 15,
  },
];

export const categories = categoryDetails.map((c) => c.name);
