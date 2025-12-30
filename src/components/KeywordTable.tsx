import { Edit, Trash2 } from 'lucide-react';
import type { Keyword as KeywordType, Prisma } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define our new Keyword type which includes the post count
type KeywordWithCount = KeywordType & {
  _count: { posts: number };
};

// Update the props
type KeywordTableProps = {
  keywords: KeywordWithCount[];
  setKeywords: React.Dispatch<React.SetStateAction<KeywordWithCount[]>>;
  onDelete: (id: number) => void;
  onEdit: (keyword: KeywordWithCount) => void;
  onViewPosts: (keyword: KeywordWithCount) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
};

const KeywordTable = ({
  keywords,
  setKeywords,
  onDelete,
  onEdit,
  onViewPosts,
  typeFilter,
  setTypeFilter,
}: KeywordTableProps) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-4 text-left font-semibold text-gray-600 w-2/5">
            KEYWORD
          </th>
          <th className="p-4 text-left font-semibold text-gray-600">
            {/* --- TYPE FILTER DROPDOWN --- */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px] bg-transparent border-none p-0 font-semibold text-gray-600 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Main">Main</SelectItem>
                <SelectItem value="Sub">Sub</SelectItem>
              </SelectContent>
            </Select>
          </th>
          <th className="p-4 text-left font-semibold text-gray-600">POSTS</th>
          <th className="p-4 text-left font-semibold text-gray-600">ACTION</th>
        </tr>
      </thead>
      <tbody>
        {keywords.map((kw) => (
          <tr key={kw.id} className="border-t border-gray-200">
            <td className="p-4 font-medium">{kw.name}</td>
            <td className="p-4 text-gray-600">{kw.type}</td>

            {/* --- CLICKABLE POST COUNT --- */}
            <td className="p-4 text-gray-600">
              <button
                onClick={() => onViewPosts(kw)}
                disabled={kw._count.posts === 0}
                className="font-medium text-blue-600 hover:underline disabled:text-gray-500 disabled:no-underline"
              >
                {kw._count.posts}
              </button>
            </td>

            <td className="p-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(kw)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(kw.id)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default KeywordTable;
