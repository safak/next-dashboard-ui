import React from 'react';
import { Plus, Link as LinkIcon } from 'lucide-react';

type KeywordTagProps = {
  text: string;
  relevance?: number; // 1. Added '?' to make it optional
  status: 'new' | 'existing' | 'linked';
  postCount?: number;
  onOpenAddModal: (keywordName: string) => void;
};

// 2. Added default value 'relevance = 0'
const KeywordTag = ({
  text,
  relevance = 0,
  status,
  postCount = 0,
  onOpenAddModal,
}: KeywordTagProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'linked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'existing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'new':
      default:
        return relevance > 0.8
          ? 'bg-purple-100 text-purple-800 border-purple-200'
          : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const bgColor = getStatusColor();
  const isLinked = status === 'linked';
  const isExisting = status === 'existing';

  return (
    <div
      className={`inline-flex items-center rounded-full text-sm font-medium border ${bgColor} transition-all`}
    >
      <span className="pl-3 py-1">{text}</span>

      {(isExisting || isLinked) && postCount > 0 && (
        <span className="ml-1.5 px-1.5 py-0.5 bg-white/50 rounded-md text-xs font-bold">
          {postCount}
        </span>
      )}

      <div className="pr-1 pl-1.5 py-1 flex items-center">
        <button
          onClick={() => onOpenAddModal(text)}
          className={`p-1 rounded-full hover:bg-black/10 transition-colors ${
            isLinked ? 'cursor-not-allowed opacity-50' : ''
          }`}
          title={
            isLinked
              ? `Already linked to this post`
              : `Add "${text}" to tracker`
          }
          disabled={isLinked}
        >
          {isLinked ? (
            <LinkIcon className="w-3 h-3" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  );
};

export default KeywordTag;
