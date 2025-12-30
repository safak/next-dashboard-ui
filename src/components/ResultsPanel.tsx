import React from 'react';
import { LoaderCircle, Tags, Info, TextSearch } from 'lucide-react';
import type { ExtractorResults } from '@/data/mockData';
import KeywordTag from './KeywordTag';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ResultsPanelProps = {
  results: ExtractorResults | null;
  isLoading: boolean;
  onOpenAddModal: (keywordName: string, keywordType: 'Main' | 'Sub') => void;
};

const ResultsPanel = ({
  results,
  isLoading,
  onOpenAddModal,
}: ResultsPanelProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-bold text-lg">Extracted Keywords</h2>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Info size={18} className="text-gray-400 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>by gemini-2.5-flash-lite</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="h-full flex flex-col justify-center items-center text-gray-500">
            <LoaderCircle className="animate-spin w-12 h-12 mb-4" />
            <p className="font-semibold">Extracting Keywords...</p>
            <p className="text-sm">Please wait a moment.</p>
          </div>
        ) : !results ? (
          <div className="h-full flex flex-col justify-center items-center text-center text-gray-500 p-4">
            <TextSearch className="w-12 h-12 mb-4" />
            <h3 className="font-semibold text-lg">Results will appear here</h3>
            <p className="text-sm max-w-xs">
              Paste your text on the left and click &quot;Extract Keywords&quot;
              to get started.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Main Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {results.mainKeywords.map((kw) => (
                  <KeywordTag
                    key={kw.text}
                    {...kw}
                    onOpenAddModal={(keywordName) =>
                      onOpenAddModal(keywordName, 'Main')
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Sub-Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {results.subKeywords.map((kw) => (
                  <KeywordTag
                    key={kw.text}
                    {...kw}
                    onOpenAddModal={(keywordName) =>
                      onOpenAddModal(keywordName, 'Sub')
                    }
                  />
                ))}
              </div>
            </div>
            <div className="pt-4 border-t">
              <h3 className="font-bold text-lg mb-3">Analysis</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Word Count</p>
                  <p className="font-bold text-xl">{results.stats.wordCount}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500">Keywords Found</p>
                  <p className="font-bold text-xl">
                    {results.stats.keywordsFound}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
