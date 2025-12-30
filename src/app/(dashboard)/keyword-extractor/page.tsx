'use client';

// 1. Import all necessary hooks and components
import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import type { ExtractorResults } from '@/data/mockData';
import ResultsPanel from '@/components/ResultsPanel';
import AddKeywordModal from '@/components/AddKeywordModal';
import { Keyword } from '@prisma/client';

const KeywordExtractorPage = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState<ExtractorResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keywordToAdd, setKeywordToAdd] = useState<Partial<Keyword> | null>(
    null
  );
  const [sourcePostId, setSourcePostId] = useState<string | null>(null);

  // 2. Check for text from session storage when the page loads
  useEffect(() => {
    const item = sessionStorage.getItem('textToExtract');
    if (item) {
      try {
        const { content, postId } = JSON.parse(item); // Get the content AND postId
        if (content) setText(content);
        if (postId) setSourcePostId(postId); // <-- Store the postId
      } catch (e) {
        // Fallback for old simple string
        setText(item);
      }
      sessionStorage.removeItem('textToExtract');
    }
  }, []);

  // 3. This function calls your Gemini API
  const handleExtract = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 1. Send the text AND the postId
        body: JSON.stringify({ text, postId: sourcePostId }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      // 2. The data is now { mainKeywords: [{text, status}, ...], ... }
      const data = await response.json();

      const wordCount = text.trim().split(/\s+/).length;
      const keywordsFound =
        (data.mainKeywords?.length || 0) + (data.subKeywords?.length || 0);

      // 3. Set the results directly (we add dummy relevance for the tag)
      setResults({
        mainKeywords: (data.mainKeywords || []).map((kw: any) => ({
          ...kw,
          relevance: 0.9,
        })),
        subKeywords: (data.subKeywords || []).map((kw: any) => ({
          ...kw,
          relevance: 0.7,
        })),
        stats: {
          wordCount,
          keywordsFound,
        },
      });
    } catch (error) {
      console.error('Error extracting keywords:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. This function opens the modal with the pre-filled data
  const handleOpenAddModal = (
    keywordName: string,
    keywordType: 'Main' | 'Sub'
  ) => {
    setKeywordToAdd({
      name: keywordName,
      type: keywordType,
    });
    setIsModalOpen(true);
  };

  // 5. This function is passed to the modal to save the new keyword
  const handleSaveFromModal = async (
    keywordData: { name: string; type: string },
    id?: number
  ) => {
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: keywordData.name,
          type: keywordData.type,
          postId: sourcePostId, // 4. <-- Pass the stored postId to your API
        }),
      });

      if (response.status === 409) {
        alert(`Keyword "${keywordData.name}" already exists.`);
      } else if (!response.ok) {
        throw new Error('Failed to add keyword');
      } else {
        alert(`Added "${keywordData.name}" to your Keyword Tracker!`);
      }
    } catch (error) {
      console.error('Error saving keyword:', error);
      alert(`Could not save keyword "${keywordData.name}".`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 6. Conditionally render the modal */}
      {isModalOpen && (
        <AddKeywordModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleSaveFromModal}
          keywordToEdit={keywordToAdd as Keyword | null}
        />
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">Keyword Extractor</h1>
        <p className="text-gray-500 mt-1">
          Extract keywords from any block of text automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[60vh]">
        {/* Input Panel */}
        <div className="bg-white rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-bold text-lg">Input Text</h2>
            <button
              onClick={() => setText('')}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Clear
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full flex-1 p-4 resize-none focus:outline-none rounded-b-xl text-gray-700 leading-relaxed"
          ></textarea>
          <div className="p-4 border-t">
            <button
              onClick={handleExtract}
              disabled={isLoading || !text.trim()}
              className="w-full flex items-center justify-center bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              <Wand2 size={20} className="mr-2" />
              {isLoading ? 'Analyzing...' : 'Extract Keywords'}
            </button>
          </div>
        </div>

        {/* 7. Pass the new 'handleOpenAddModal' function to the Results Panel */}
        <ResultsPanel
          results={results}
          isLoading={isLoading}
          onOpenAddModal={handleOpenAddModal}
        />
      </div>
    </div>
  );
};

export default KeywordExtractorPage;
