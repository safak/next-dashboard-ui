'use client';

import React, { useState } from 'react';
import { categories } from '@/data/mockData';
import type {
  ReportRow,
  SummaryMetrics,
  ModelEvaluationData,
} from '@/data/modelEvaluationData';

// --- Sub-component: Classification Report ---
const ClassificationReportTab = ({
  report,
  summary,
}: {
  report: ReportRow[];
  summary: SummaryMetrics;
}) => (
  <table className="w-full text-sm text-left">
    <thead className="bg-gray-50">
      <tr>
        <th className="p-3 font-semibold text-gray-600">Category</th>
        <th className="p-3 font-semibold text-gray-600 text-right">
          Precision
        </th>
        <th className="p-3 font-semibold text-gray-600 text-right">Recall</th>
        <th className="p-3 font-semibold text-gray-600 text-right">F1-Score</th>
        <th className="p-3 font-semibold text-gray-600 text-right">Support</th>
      </tr>
    </thead>
    <tbody>
      {report.map((row) => (
        <tr key={row.category} className="border-t">
          <td className="p-3 font-medium">{row.category}</td>
          <td className="p-3 text-right">{row.precision}</td>
          <td className="p-3 text-right">{row.recall}</td>
          <td className="p-3 text-right">{row.f1}</td>
          <td className="p-3 text-right text-gray-500">{row.support}</td>
        </tr>
      ))}
      <tr className="border-t bg-gray-50 font-semibold">
        <td className="p-3">Accuracy</td>
        <td className="p-3"></td>
        <td className="p-3"></td>
        <td className="p-3 text-right">{summary.accuracy.toFixed(2)}</td>
        <td className="p-3 text-right text-gray-500">
          {report.reduce((a, b) => a + b.support, 0)}
        </td>
      </tr>
      <tr className="border-t">
        <td className="p-3">Macro Avg</td>
        <td className="p-3 text-right">{summary.macro.p.toFixed(2)}</td>
        <td className="p-3 text-right">{summary.macro.r.toFixed(2)}</td>
        <td className="p-3 text-right">{summary.macro.f1.toFixed(2)}</td>
        <td className="p-3 text-right"></td>
      </tr>
      <tr className="border-t">
        <td className="p-3">Weighted Avg</td>
        <td className="p-3 text-right">{summary.weighted.p.toFixed(2)}</td>
        <td className="p-3 text-right">{summary.weighted.r.toFixed(2)}</td>
        <td className="p-3 text-right">{summary.weighted.f1.toFixed(2)}</td>
        <td className="p-3 text-right"></td>
      </tr>
    </tbody>
  </table>
);

// --- Sub-component: Confusion Matrix ---
const ConfusionMatrixTab = ({
  matrix,
  categories,
}: {
  matrix: number[][];
  categories: string[];
}) => {
  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full text-xs text-center border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 p-2 bg-gray-100 z-10">
              Predicted →<br />
              Actual ↓
            </th>
            {categories.map((cat) => (
              <th key={cat} className="p-2 vertical-text font-semibold">
                {cat.replace(/ /g, '\n')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i} className="border-t">
              <td className="sticky left-0 p-2 font-semibold bg-gray-50 whitespace-nowrap z-10">
                {categories[i]}
              </td>
              {row.map((val, j) => {
                const isDiagonal = i === j;
                const opacity = isDiagonal ? 0.7 : 0.2; // Simple opacity
                const bgColor = isDiagonal
                  ? 'rgba(34, 197, 94, 0.5)'
                  : `rgba(239, 68, 68, ${opacity})`; // Green for correct, Red for errors
                const textColor = 'text-gray-900';

                return (
                  <td
                    key={j}
                    className={`p-4 border ${isDiagonal ? 'font-bold' : ''}`}
                    style={{ backgroundColor: bgColor }}
                  >
                    <span
                      className={`p-1 rounded ${
                        val > 0 ? textColor : 'text-gray-400'
                      }`}
                    >
                      {val}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Main Card Component ---
type CardProps = {
  modelName: string;
  results: ModelEvaluationData;
};

const ModelResultCard = ({ modelName, results }: CardProps) => {
  const [activeTab, setActiveTab] = useState('Report');

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <h3 className="font-bold text-xl text-purple-700 p-6">{modelName}</h3>
      <div className="border-b border-gray-200 px-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('Report')}
            className={`py-2 px-1 text-sm font-semibold ${
              activeTab === 'Report'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Classification Report
          </button>
          <button
            onClick={() => setActiveTab('Matrix')}
            className={`py-2 px-1 text-sm font-semibold ${
              activeTab === 'Matrix'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Confusion Matrix
          </button>
        </nav>
      </div>
      <div>
        {activeTab === 'Report' ? (
          <ClassificationReportTab
            report={results.classificationReport}
            summary={results.summary}
          />
        ) : (
          <ConfusionMatrixTab
            matrix={results.confusionMatrix}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
};

export default ModelResultCard;
