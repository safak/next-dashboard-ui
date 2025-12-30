import { Search } from 'lucide-react';

const SearchBox = () => {
  return (
    <div className="relative w-64">
      {' '}
      {/* Adjust width as needed */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        className="
          w-full 
          pl-10 pr-4 py-2 
          bg-gray-100 
          text-sm 
          rounded-lg
          focus:outline-none 
          focus:ring-2 
          focus:ring-purple-300 
          focus:border-transparent
        "
      />
    </div>
  );
};

export default SearchBox;
