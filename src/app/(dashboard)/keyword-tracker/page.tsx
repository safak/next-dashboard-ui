'use client';

import { useState, useEffect } from 'react';
import { Plus, ExternalLink } from 'lucide-react';
import { Keyword, Post } from '@prisma/client'; // Import Post
import KeywordTable from '@/components/KeywordTable';
import AddKeywordModal from '@/components/AddKeywordModal';
import HighlightText from '@/components/HighlightText'; // Import our new component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Define the type for the keyword with its post count
export type KeywordWithCount = Keyword & {
  _count: { posts: number };
};

const KeywordTrackerPage = () => {
  // State for all keywords from DB
  const [allKeywords, setAllKeywords] = useState<KeywordWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for the "Add/Edit" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);

  // --- 1. STATE FOR THE "TYPE" FILTER ---
  const [typeFilter, setTypeFilter] = useState('All');

  // --- 2. STATE FOR THE "VIEW POSTS" MODAL ---
  const [isPostsModalOpen, setIsPostsModalOpen] = useState(false);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  // --- END ---

  // Fetch keywords (now with post count)
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await fetch('/api/keywords');
        const data = await response.json();
        setAllKeywords(data); // Save to the 'allKeywords' list
      } catch (error) {
        console.error('Failed to load keywords:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKeywords();
  }, []);

  // --- 3. FILTERED KEYWORDS LOGIC ---
  // Create the list that will actually be shown in the table
  const filteredKeywords = allKeywords.filter((keyword) => {
    if (typeFilter === 'All') {
      return true; // Show all keywords
    }
    return keyword.type === typeFilter; // Show only matching type
  });
  // --- END ---

  // This function handles BOTH Add and Edit
  const handleSave = async (
    keywordData: { name: string; type: string },
    id?: number
  ) => {
    if (id) {
      // UPDATE (EDIT) LOGIC
      try {
        const response = await fetch(`/api/keywords/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(keywordData),
        });
        if (!response.ok) throw new Error('Failed to update');
        const updatedKeyword = await response.json();

        // Update the main list
        setAllKeywords((prev) =>
          prev.map((kw) => (kw.id === id ? { ...kw, ...updatedKeyword } : kw))
        );
      } catch (error) {
        console.error('Error updating keyword:', error);
      }
    } else {
      // CREATE (ADD) LOGIC
      try {
        const response = await fetch('/api/keywords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(keywordData),
        });
        if (!response.ok) throw new Error('Failed to add');
        const newKeywordFromDB = await response.json();

        // Add to the main list
        setAllKeywords((prev) => [newKeywordFromDB, ...prev]);
      } catch (error) {
        console.error('Error adding keyword:', error);
      }
    }
  };

  const handleDeleteKeyword = async (id: number) => {
    // Update the main list
    setAllKeywords((prev) => prev.filter((kw) => kw.id !== id));
    try {
      await fetch(`/api/keywords/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting keyword:', error);
    }
  };

  const openAddModal = () => {
    setEditingKeyword(null);
    setIsModalOpen(true);
  };

  const openEditModal = (keyword: Keyword) => {
    setEditingKeyword(keyword);
    setIsModalOpen(true);
  };

  // This function opens the "View Posts" modal
  const handleViewPosts = async (keyword: Keyword) => {
    setSelectedKeyword(keyword);
    setIsPostsModalOpen(true);
    setIsPostsLoading(true);

    try {
      const response = await fetch(`/api/keywords/${keyword.id}/posts`);
      const postsData = await response.json();
      setSelectedPosts(postsData);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsPostsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* This is the Add/Edit Modal */}
      {isModalOpen && (
        <AddKeywordModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleSave}
          keywordToEdit={editingKeyword}
        />
      )}

      {/* This is the "View Posts" Modal */}
      <Dialog open={isPostsModalOpen} onOpenChange={setIsPostsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Posts containing Posts containing &quot;{selectedKeyword?.name}
              &quot;
            </DialogTitle>
            <DialogDescription>
              Showing all posts linked to this keyword.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-4 p-1">
            {isPostsLoading ? (
              <p>Loading posts...</p>
            ) : selectedPosts.length === 0 ? (
              <p>No posts are linked to this keyword yet.</p>
            ) : (
              selectedPosts.map((post) => (
                <div key={post.id} className="p-3 bg-gray-50 rounded-lg border">
                  <p className="text-gray-700 text-sm">
                    <HighlightText
                      text={post.content}
                      highlight={selectedKeyword?.name || ''}
                    />
                  </p>
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-xs text-blue-500 hover:underline mt-2"
                  >
                    <ExternalLink size={14} className="mr-1" /> View Original
                    Post
                  </a>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Keyword Tracker</h1>
          <p className="text-gray-500 mt-1">Manage and track your keywords</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700"
        >
          <Plus size={20} className="mr-2" />
          Add Keyword
        </button>
      </div>

      {/* Keyword Table */}
      <div className="mt-8">
        {isLoading ? (
          <p>Loading keywords...</p>
        ) : (
          <KeywordTable
            keywords={filteredKeywords} // <-- Pass the filtered list
            setKeywords={setAllKeywords as any} // The main list for updates
            onDelete={handleDeleteKeyword}
            onEdit={openEditModal}
            onViewPosts={handleViewPosts}
            typeFilter={typeFilter} // Pass the filter value
            setTypeFilter={setTypeFilter} // Pass the filter setter
          />
        )}
      </div>
    </div>
  );
};

export default KeywordTrackerPage;
