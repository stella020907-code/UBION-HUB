
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Star, StarHalf } from 'lucide-react';

// 1. Type Definition
type Project = {
  id: string;
  title: string;
  creator: string;
  description: string;
  link: string;
  category: string;
  imagePlaceholder: string;
  model: string;
  rating: number;
};

// 2. Mock Data Source
const MOCK_PROJECTS: Project[] = [
  {
    id: 'p001',
    title: '유비온 여행 계획 챗봇',
    creator: 'Team Member A',
    description: '예산 기반 맞춤 여행 일정을 짜주는 Gemini 기반 챗봇입니다.',
    link: 'https://ubion-ai-studio.com/travel-planner-v2',
    category: 'Chatbot',
    imagePlaceholder: 'https://picsum.photos/seed/p001/400/300',
    model: 'Gemini 2.5 Flash',
    rating: 4.5,
  },
  {
    id: 'p002',
    title: 'AI 코드 리뷰 도우미',
    creator: 'Developer B',
    description: '코드의 버그를 찾고 개선 사항을 제안하는 코드 어시스턴트.',
    link: 'https://ubion-ai-studio.com/code-reviewer',
    category: 'Code Assist',
    imagePlaceholder: 'https://picsum.photos/seed/p002/400/300',
    model: 'Gemini 2.5 Pro',
    rating: 4.8,
  },
  {
    id: 'p003',
    title: '실시간 뉴스 요약기',
    creator: 'Journalist C',
    description: '최신 뉴스를 실시간으로 수집하고 핵심 내용만 요약합니다.',
    link: 'https://ubion-ai-studio.com/news-summarizer',
    category: 'Summarization',
    imagePlaceholder: 'https://picsum.photos/seed/p003/400/300',
    model: 'Gemini 2.5 Flash',
    rating: 4.2,
  },
  {
    id: 'p004',
    title: '이미지 생성 및 편집기',
    creator: 'Designer D',
    description: '간단한 텍스트 프롬프트로 멋진 이미지를 생성하고 편집합니다.',
    link: 'https://ubion-ai-studio.com/image-generator',
    category: 'Image Generation',
    imagePlaceholder: 'https://picsum.photos/seed/p004/400/300',
    model: 'Imagen 4.0',
    rating: 4.9,
  },
  {
    id: 'p005',
    title: '고객 문의 자동 응답 챗봇',
    creator: 'Support Team E',
    description: '자주 묻는 질문(FAQ)에 24시간 자동으로 응답하는 챗봇입니다.',
    link: 'https://ubion-ai-studio.com/faq-bot',
    category: 'Chatbot',
    imagePlaceholder: 'https://picsum.photos/seed/p005/400/300',
    model: 'Gemini 2.5 Flash',
    rating: 4.4,
  },
  {
    id: 'p006',
    title: '파이썬 코드 자동 생성기',
    creator: 'Student F',
    description: '자연어 설명을 바탕으로 간단한 파이썬 코드를 작성해줍니다.',
    link: 'https://ubion-ai-studio.com/python-generator',
    category: 'Code Assist',
    imagePlaceholder: 'https://picsum.photos/seed/p006/400/300',
    model: 'Gemini 2.5 Pro',
    rating: 3.9,
  },
  {
    id: 'p007',
    title: '긴 문서 요약 서비스',
    creator: 'Researcher G',
    description: '논문이나 보고서와 같은 긴 문서를 핵심만 간추려 요약합니다.',
    link: 'https://ubion-ai-studio.com/doc-summarizer',
    category: 'Summarization',
    imagePlaceholder: 'https://picsum.photos/seed/p007/400/300',
    model: 'Gemini 2.5 Pro',
    rating: 4.6,
  },
  {
    id: 'p008',
    title: '마케팅 카피라이터',
    creator: 'Marketer H',
    description: '제품의 특징을 입력하면 매력적인 광고 문구를 생성합니다.',
    link: 'https://ubion-ai-studio.com/copywriter',
    category: 'Text Generation',
    imagePlaceholder: 'https://picsum.photos/seed/p008/400/300',
    model: 'Gemini 2.5 Flash',
    rating: 4.1,
  }
];

// 3. Helper Components
const RatingDisplay: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 fill-gray-300" />
        ))}
      </div>
      <span className="text-xs font-medium text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const handleCardClick = () => {
    window.open(project.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={project.imagePlaceholder}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex h-[30%] flex-col justify-between p-3">
        <div>
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
            {project.category}
          </span>
          <h3 className="mt-2 text-sm font-bold text-gray-800 truncate">{project.title}</h3>
          <p className="text-xs text-gray-500">{project.creator}</p>
        </div>
        <div className="mt-2">
          <RatingDisplay rating={project.rating} />
        </div>
      </div>
    </div>
  );
};


// 4. Main Application Component (as requested: IdeaHub)
const IdeaHub: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'rating'

  const userId = 'ubion-dev';

  useEffect(() => {
    // This simulates fetching data, as requested.
    // In a real app, this is where you'd connect to Firebase.
    // console.log("Fetching projects from data source...");
    setProjects(MOCK_PROJECTS);
    setLoading(false);
  }, []);

  const categories = useMemo(() => ['All', ...new Set(MOCK_PROJECTS.map(p => p.category))], []);

  const filteredAndSortedProjects = useMemo(() => {
    let result = projects;

    // Filter by category
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    // Filter by search term
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(lowercasedTerm) ||
        p.creator.toLowerCase().includes(lowercasedTerm) ||
        p.description.toLowerCase().includes(lowercasedTerm)
      );
    }

    // Sort
    if (sortOrder === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }
    // 'latest' order is the default, so no sorting needed.

    return result;
  }, [projects, searchTerm, category, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-extrabold text-indigo-700">⭐ UBION HUB</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">ID: {userId}</span>
            <button className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              프로젝트 등록
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="제목, 제작자, 설명으로 검색..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-md border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? `All (${projects.length})` : cat}
                  </option>
                ))}
              </select>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="latest">최신순</option>
                <option value="rating">평점순</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading projects...</div>
        ) : filteredAndSortedProjects.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
            {filteredAndSortedProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white py-20 text-center">
             <Search className="h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">결과 없음</h3>
            <p className="mt-1 text-sm text-gray-500">검색어 또는 필터를 변경해보세요.</p>
          </div>
        )}
      </main>
    </div>
  );
};


// 5. App wrapper
const App: React.FC = () => {
  return <IdeaHub />;
}

export default App;
