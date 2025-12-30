import { categories } from '@/data/mockData'; // Assuming categories are in mockData

export const modelList = [
  'geminiPro5',
  'geminiPro10',
  'geminiPro20',
  'flash5',
  'flash10',
  'flash20',
  'typhoon5',
  'typhoon10',
  'typhoon20',
];

// Define the data structure
export interface ReportRow {
  category: string;
  precision: number;
  recall: number;
  f1: number;
  support: number;
}
export interface SummaryMetrics {
  accuracy: number;
  macro: { p: number; r: number; f1: number };
  weighted: { p: number; r: number; f1: number };
}
export interface ModelEvaluationData {
  classificationReport: ReportRow[];
  confusionMatrix: number[][];
  summary: SummaryMetrics;
}

// Store all model data in one object
export const allModelsData: { [key: string]: ModelEvaluationData } = {
  // --- REAL DATA FOR GEMINI PRO 5 ---
  geminiPro5: {
    classificationReport: [
      {
        category: 'Events',
        precision: 0.95,
        recall: 0.95,
        f1: 0.95,
        support: 21,
      },
      {
        category: 'Guides',
        precision: 0.67,
        recall: 0.94,
        f1: 0.78,
        support: 17,
      },
      {
        category: 'Opportunity&Recruitment',
        precision: 1.0,
        recall: 1.0,
        f1: 1.0,
        support: 5,
      },
      {
        category: 'Promotions&Special deals',
        precision: 0.67,
        recall: 0.67,
        f1: 0.67,
        support: 6,
      },
      {
        category: 'Systemic Annoucements',
        precision: 0.76,
        recall: 0.76,
        f1: 0.76,
        support: 21,
      },
      {
        category: 'Warning annoucements',
        precision: 0.64,
        recall: 1.0,
        f1: 0.78,
        support: 7,
      },
      {
        category: 'miscellaneous',
        precision: 1.0,
        recall: 0.21,
        f1: 0.35,
        support: 14,
      },
    ],
    confusionMatrix: [
      [20, 1, 0, 0, 0, 0, 0],
      [0, 16, 0, 1, 0, 0, 0],
      [0, 0, 5, 0, 0, 0, 0],
      [0, 0, 0, 4, 1, 1, 0],
      [1, 1, 0, 0, 16, 3, 0],
      [0, 0, 0, 0, 0, 7, 0],
      [0, 6, 0, 1, 4, 0, 3],
    ],
    summary: {
      accuracy: 0.78,
      macro: { p: 0.81, r: 0.79, f1: 0.76 },
      weighted: { p: 0.82, r: 0.78, f1: 0.75 },
    },
  },

  // --- REAL DATA FOR GEMINI PRO 10 ---
  geminiPro10: {
    classificationReport: [
      {
        category: 'Events',
        precision: 0.95,
        recall: 0.95,
        f1: 0.95,
        support: 21,
      },
      {
        category: 'Guides',
        precision: 0.7,
        recall: 0.94,
        f1: 0.8,
        support: 17,
      },
      {
        category: 'Opportunity&Recruitment',
        precision: 1.0,
        recall: 1.0,
        f1: 1.0,
        support: 5,
      },
      {
        category: 'Promotions&Special deals',
        precision: 0.71,
        recall: 0.83,
        f1: 0.77,
        support: 6,
      },
      {
        category: 'Systemic Annoucements',
        precision: 0.77,
        recall: 0.81,
        f1: 0.79,
        support: 21,
      },
      {
        category: 'Warning annoucements',
        precision: 0.7,
        recall: 1.0,
        f1: 0.82,
        support: 7,
      },
      {
        category: 'miscellaneous',
        precision: 1.0,
        recall: 0.21,
        f1: 0.35,
        support: 14,
      },
    ],
    confusionMatrix: [
      [20, 1, 0, 0, 0, 0, 0],
      [0, 16, 0, 1, 0, 0, 0],
      [0, 0, 5, 0, 0, 0, 0],
      [0, 0, 0, 5, 0, 1, 0],
      [1, 1, 0, 0, 17, 2, 0],
      [0, 0, 0, 0, 0, 7, 0],
      [0, 6, 0, 1, 4, 0, 3],
    ],
    summary: {
      accuracy: 0.8,
      macro: { p: 0.83, r: 0.82, f1: 0.78 },
      weighted: { p: 0.84, r: 0.8, f1: 0.78 },
    },
  },

  // --- REAL DATA FOR GEMINI PRO 20 ---
  geminiPro20: {
    classificationReport: [
      {
        category: 'Events',
        precision: 1.0,
        recall: 0.86,
        f1: 0.92,
        support: 21,
      },
      {
        category: 'Guides',
        precision: 0.71,
        recall: 1.0,
        f1: 0.83,
        support: 17,
      },
      {
        category: 'Opportunity&Recruitment',
        precision: 1.0,
        recall: 1.0,
        f1: 1.0,
        support: 5,
      },
      {
        category: 'Promotions&Special deals',
        precision: 1.0,
        recall: 1.0,
        f1: 1.0,
        support: 6,
      },
      {
        category: 'Systemic Annoucements',
        precision: 0.77,
        recall: 0.81,
        f1: 0.79,
        support: 21,
      },
      {
        category: 'Warning annoucements',
        precision: 0.7,
        recall: 1.0,
        f1: 0.82,
        support: 7,
      },
      {
        category: 'miscellaneous',
        precision: 0.83,
        recall: 0.36,
        f1: 0.5,
        support: 14,
      },
    ],
    confusionMatrix: [
      [18, 1, 0, 0, 2, 0, 0],
      [0, 17, 0, 0, 0, 0, 0],
      [0, 0, 5, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0],
      [1, 1, 0, 0, 17, 2, 0],
      [0, 0, 0, 0, 0, 7, 0],
      [0, 4, 0, 0, 5, 0, 5],
    ],
    summary: {
      accuracy: 0.82,
      macro: { p: 0.86, r: 0.86, f1: 0.84 },
      weighted: { p: 0.84, r: 0.82, f1: 0.81 },
    },
  },

  // --- REAL DATA FOR FLASH 5 ---
  flash5: {
    classificationReport: [
      {
        category: 'Events',
        precision: 0.87,
        recall: 0.95,
        f1: 0.91,
        support: 21,
      },
      {
        category: 'Guides',
        precision: 0.65,
        recall: 1.0,
        f1: 0.79,
        support: 17,
      },
      {
        category: 'Opportunity&Recruitment',
        precision: 1.0,
        recall: 0.6,
        f1: 0.75,
        support: 5,
      },
      {
        category: 'Promotions&Special deals',
        precision: 0.8,
        recall: 0.67,
        f1: 0.73,
        support: 6,
      },
      {
        category: 'Systemic Annoucements',
        precision: 0.77,
        recall: 0.81,
        f1: 0.79,
        support: 21,
      },
      {
        category: 'Warning annoucements',
        precision: 0.7,
        recall: 1.0,
        f1: 0.82,
        support: 7,
      },
      {
        category: 'miscellaneous',
        precision: 1.0,
        recall: 0.14,
        f1: 0.25,
        support: 14,
      },
    ],
    confusionMatrix: [
      [19, 0, 0, 0, 2, 0, 0],
      [0, 17, 0, 0, 0, 0, 0],
      [0, 1, 3, 0, 1, 0, 0],
      [0, 0, 0, 4, 1, 1, 0],
      [1, 0, 0, 0, 17, 3, 0],
      [0, 0, 0, 0, 0, 7, 0],
      [0, 6, 0, 1, 5, 0, 2],
    ],
    summary: {
      accuracy: 0.77,
      macro: { p: 0.83, r: 0.74, f1: 0.72 },
      weighted: { p: 0.82, r: 0.77, f1: 0.73 },
    },
  },

  // --- REAL DATA FOR FLASH 10 ---
  flash10: {
    classificationReport: [
      {
        category: 'Events',
        precision: 0.87,
        recall: 0.95,
        f1: 0.91,
        support: 21,
      },
      {
        category: 'Guides',
        precision: 0.67,
        recall: 0.94,
        f1: 0.78,
        support: 17,
      },
      {
        category: 'Opportunity&Recruitment',
        precision: 1.0,
        recall: 0.6,
        f1: 0.75,
        support: 5,
      },
      {
        category: 'Promotions&Special deals',
        precision: 0.8,
        recall: 0.67,
        f1: 0.73,
        support: 6,
      },
      {
        category: 'Systemic Annoucements',
        precision: 0.78,
        recall: 0.86,
        f1: 0.82,
        support: 21,
      },
      {
        category: 'Warning annoucements',
        precision: 0.78,
        recall: 1.0,
        f1: 0.88,
        support: 7,
      },
      {
        category: 'miscellaneous',
        precision: 1.0,
        recall: 0.29,
        f1: 0.44,
        support: 14,
      },
    ],
    confusionMatrix: [
      [20, 0, 0, 0, 1, 0, 0],
      [0, 16, 0, 0, 1, 0, 0],
      [0, 1, 3, 0, 1, 0, 0],
      [0, 0, 0, 4, 1, 1, 0],
      [1, 0, 0, 0, 18, 2, 0],
      [0, 0, 0, 0, 0, 7, 0],
      [0, 6, 0, 1, 3, 0, 4],
    ],
    summary: {
      accuracy: 0.79,
      macro: { p: 0.84, r: 0.76, f1: 0.76 },
      weighted: { p: 0.83, r: 0.79, f1: 0.77 },
    },
  },

  // --- REAL DATA FOR FLASH 20 ---
  flash20: {
    classificationReport: [
      {
        category: 'Events',
        precision: 0.95,
        recall: 0.95,
        f1: 0.95,
        support: 21,
      },
      {
        category: 'Guides',
        precision: 0.68,
        recall: 1.0,
        f1: 0.81,
        support: 17,
      },
      {
        category: 'Opportunity&Recruitment',
        precision: 1.0,
        recall: 1.0,
        f1: 1.0,
        support: 5,
      },
      {
        category: 'Promotions&Special deals',
        precision: 0.86,
        recall: 1.0,
        f1: 0.92,
        support: 6,
      },
      {
        category: 'Systemic Annoucements',
        precision: 0.86,
        recall: 0.9,
        f1: 0.88,
        support: 21,
      },
      {
        category: 'Warning annoucements',
        precision: 0.88,
        recall: 1.0,
        f1: 0.93,
        support: 7,
      },
      {
        category: 'miscellaneous',
        precision: 1.0,
        recall: 0.21,
        f1: 0.35,
        support: 14,
      },
    ],
    confusionMatrix: [
      [20, 1, 0, 0, 0, 0, 0],
      [0, 17, 0, 0, 0, 0, 0],
      [0, 0, 5, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0],
      [1, 0, 0, 0, 19, 1, 0],
      [0, 0, 0, 0, 0, 7, 0],
      [0, 6, 0, 1, 4, 0, 3],
    ],
    summary: {
      accuracy: 0.85,
      macro: { p: 0.89, r: 0.87, f1: 0.84 },
      weighted: { p: 0.88, r: 0.85, f1: 0.82 },
    },
  },

  // --- REAL DATA FOR TYPHOON 5 ---
  typhoon5: {
    classificationReport: [
      {
        category: 'Events',
        precision: 0.9,
        recall: 0.86,
        f1: 0.88,
        support: 21,
      },
      {
        category: 'Guides',
        precision: 0.58,
        recall: 0.65,
        f1: 0.61,
        support: 17,
      },
      {
        category: 'Opportunity&Recruitment',
        precision: 0.83,
        recall: 1.0,
        f1: 0.91,
        support: 5,
      },
      {
        category: 'Promotions&Special deals',
        precision: 0.2,
        recall: 0.17,
        f1: 0.18,
        support: 6,
      },
      {
        category: 'Systemic Annoucements',
        precision: 0.62,
        recall: 0.71,
        f1: 0.67,
        support: 21,
      },
      {
        category: 'Warning annoucements',
        precision: 0.5,
        recall: 0.86,
        f1: 0.63,
        support: 7,
      },
      {
        category: 'miscellaneous',
        precision: 0.6,
        recall: 0.21,
        f1: 0.32,
        support: 14,
      },
    ],
    confusionMatrix: [
      [18, 2, 0, 0, 1, 0, 0],
      [1, 11, 0, 2, 3, 0, 0],
      [0, 0, 5, 0, 0, 0, 0],
      [0, 1, 0, 1, 3, 0, 1],
      [0, 2, 0, 0, 15, 2, 2],
      [0, 1, 0, 0, 0, 6, 0],
      [0, 2, 0, 0, 8, 1, 3],
    ],
    summary: {
      accuracy: 0.65,
      macro: { p: 0.61, r: 0.64, f1: 0.6 },
      weighted: { p: 0.65, r: 0.65, f1: 0.63 },
    },
  },

  // --- REAL DATA FOR TYPHOON 10 ---
  typhoon10: {
    classificationReport: [
      {
        category: 'Events',
        precision: 0.67,
        recall: 0.76,
        f1: 0.71,
        support: 21,
      },
      {
        category: 'Guides',
        precision: 0.57,
        recall: 0.71,
        f1: 0.63,
        support: 17,
      },
      {
        category: 'Opportunity&Recruitment',
        precision: 0.2,
        recall: 0.2,
        f1: 0.2,
        support: 5,
      },
      {
        category: 'Promotions&Special deals',
        precision: 0.33,
        recall: 0.67,
        f1: 0.44,
        support: 6,
      },
      {
        category: 'Systemic Annoucements',
        precision: 0.5,
        recall: 0.43,
        f1: 0.46,
        support: 21,
      },
      {
        category: 'Warning annoucements',
        precision: 0.67,
        recall: 0.86,
        f1: 0.75,
        support: 7,
      },
      {
        category: 'miscellaneous',
        precision: 1.0,
        recall: 0.14,
        f1: 0.25,
        support: 14,
      },
    ],
    confusionMatrix: [
      [16, 2, 1, 1, 1, 0, 0],
      [3, 12, 0, 1, 1, 0, 0],
      [1, 1, 1, 0, 2, 0, 0],
      [0, 2, 0, 4, 0, 0, 0],
      [2, 3, 0, 2, 9, 3, 2],
      [0, 1, 0, 0, 0, 6, 0],
      [0, 4, 0, 3, 4, 1, 2],
    ],
    summary: {
      accuracy: 0.55,
      macro: { p: 0.56, r: 0.54, f1: 0.49 },
      weighted: { p: 0.61, r: 0.55, f1: 0.53 },
    },
  },

  // --- REAL DATA FOR TYPHOON 20 ---
  typhoon20: {
    classificationReport: [
      {
        category: 'Events',
        precision: 0.69,
        recall: 0.52,
        f1: 0.59,
        support: 21,
      },
      {
        category: 'Guides',
        precision: 0.38,
        recall: 0.59,
        f1: 0.47,
        support: 17,
      },
      {
        category: 'Opportunity&Recruitment',
        precision: 1.0,
        recall: 0.2,
        f1: 0.33,
        support: 5,
      },
      {
        category: 'Promotions&Special deals',
        precision: 0.4,
        recall: 0.67,
        f1: 0.5,
        support: 6,
      },
      {
        category: 'Systemic Annoucements',
        precision: 0.67,
        recall: 0.38,
        f1: 0.48,
        support: 21,
      },
      {
        category: 'Warning annoucements',
        precision: 1.0,
        recall: 1.0,
        f1: 1.0,
        support: 7,
      },
      {
        category: 'miscellaneous',
        precision: 0.26,
        recall: 0.36,
        f1: 0.3,
        support: 14,
      },
    ],
    confusionMatrix: [
      [11, 4, 0, 2, 1, 0, 3],
      [1, 10, 0, 3, 3, 0, 0],
      [0, 1, 1, 0, 3, 0, 0],
      [0, 0, 0, 4, 2, 0, 0],
      [1, 4, 0, 2, 8, 1, 5],
      [0, 0, 0, 0, 0, 7, 0],
      [1, 5, 0, 2, 1, 0, 5],
    ],
    summary: {
      accuracy: 0.51,
      macro: { p: 0.63, r: 0.53, f1: 0.53 },
      weighted: { p: 0.58, r: 0.51, f1: 0.51 },
    },
  },
};

// Mock data for mismatched posts
export const mismatchedPosts = [
  {
    id: 1024,
    text: "Don't forget! The MUIC Open House is this Friday!",
    human: 'Events',
  },
  {
    id: 1028,
    text: 'Warning: The main server will be down for maintenance tonight.',
    human: 'Warning annoucements',
  },
  {
    id: 1035,
    text: 'We are hiring! Looking for a new student assistant.',
    human: 'Opportunity&Recruitment',
  },
  {
    id: 1040,
    text: 'Get 20% off at the campus bookstore with your student ID!',
    human: 'Promotions&Special deals',
  },
  {
    id: 1041,
    text: 'How to register for new classes: A short guide.',
    human: 'Guides',
  },
  {
    id: 1042,
    text: 'Just a random thought about the Salaya campus...',
    human: 'miscellaneous',
  },
];

// Helper function for mismatch table
export const getModelCategory = (modelName: string, humanCategory: string) => {
  if (modelName === 'geminiPro5') {
    // Simulate real mismatch from your matrix
    if (humanCategory === 'miscellaneous') return 'Guides';
    if (humanCategory === 'Systemic Annoucements')
      return 'Warning annoucements';
    return humanCategory;
  }
  // Fallback for other models
  let seed = 0;
  for (let i = 0; i < modelName.length; i++)
    seed = (seed + modelName.charCodeAt(i)) % 10;
  return seed > 3
    ? humanCategory
    : categories[Math.floor(seed % categories.length)];
};
