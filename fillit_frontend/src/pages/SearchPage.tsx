import Header from '@/components/common/Header';
import { useState } from 'react';

interface Post {
  id: number;
  user_id: string;
  contents: string;
}

const mockPost: Post[] = [
  {
    id: 1,
    user_id: 'john_doe',
    contents: 'Beautiful weather today! Going for a walk.',
  },
  {
    id: 2,
    user_id: 'alice_smith',
    contents: 'Just finished reading an amazing book!',
  },
  {
    id: 3,
    user_id: 'tech_guru',
    contents: 'Learning React and TypeScript is fun.',
  },
];

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState(mockPost);

  const handleSearch = (term: string) => {
    const serachTerm = term.toLowerCase();
    const filteredPosts = mockPost.filter(
      (post) =>
        post.contents.toLowerCase().includes(serachTerm) ||
        post.user_id.toLowerCase().includes(serachTerm)
    );
    setSearchResults(filteredPosts);
  };
  return (
    <div className="container-header-nav">
      <Header center="search" onSearch={handleSearch} />

      <div className="space-y-4 p-5">
        {searchResults.map((post) => (
          <div key={post.id} className="p-4 bg-white rounded-lg shadow">
            <p className="text-sm font-bold text-gray-600">{post.user_id}</p>
            <p className="mt-2">{post.contents}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
