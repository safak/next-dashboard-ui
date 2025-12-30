'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  allModelsData,
  mismatchedPosts,
  getModelCategory,
} from '@/data/modelEvaluationData';
import { categories } from '@/data/mockData';
import ModelSelect from '@/components/ModelSelect';
import ModelResultCard from '@/components/ModelResultCard';
import ModelComparisonChart from '@/components/ModelComparisonChart';
import type { ModelEvaluationData } from '@/data/modelEvaluationData';

const ModelEvaluationPage = () => {
  const [modelA, setModelA] = useState('geminiPro5');
  const [modelB, setModelB] = useState('flash10');

  // Get the full data object for the selected model
  const [resultsA, setResultsA] = useState<ModelEvaluationData>(
    allModelsData[modelA]
  );
  const [resultsB, setResultsB] = useState<ModelEvaluationData>(
    allModelsData[modelB]
  );

  // Update results when dropdown changes
  useEffect(() => {
    setResultsA(allModelsData[modelA]);
  }, [modelA]);

  useEffect(() => {
    setResultsB(allModelsData[modelB]);
  }, [modelB]);

  return (
    <div className="flex flex-col gap-6 pb-4">
      <h1 className="text-3xl font-bold text-gray-800">Model Evaluation</h1>
      <p className="text-gray-500 -mt-4">
        Compare classification results between models.
      </p>

      {/* Model Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
        <ModelSelect selected={modelA} onChange={setModelA} />
        <ModelSelect selected={modelB} onChange={setModelB} />
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ModelResultCard modelName={modelA} results={resultsA} />
        <ModelResultCard modelName={modelB} results={resultsB} />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <ModelComparisonChart />
      </div>
    </div>
  );
};

export default ModelEvaluationPage;
