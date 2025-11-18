
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Star, StarHalf, Pencil } from 'lucide-react';

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
    title: 'AI 프로필 생성',
    creator: 'Ubion Creator',
    description: '몇 장의 사진으로 전문가 수준의 프로필 사진을 생성합니다.',
    link: 'https://ai.studio/apps/drive/1n3Ze21z5N9cS5cTNhEZri0glX20rTvPf',
    category: 'Image Generation',
    imagePlaceholder: 'https://picsum.photos/seed/profile/400/300',
    model: 'Imagen 4.0',
    rating: 4.7,
  },
  {
    id: 'p002',
    title: 'AI 굿즈 생성',
    creator: 'Ubion Designer',
    description: '원하는 디자인으로 나만의 특별한 굿즈를 만들어보세요.',
    link: 'https://ai.studio/apps/drive/1qJTL-uVkPj5tVwy9Ys-M1zE_5DeScDHZ',
    category: 'Image Generation',
    imagePlaceholder: 'https://picsum.photos/seed/goods/400/300',
    model: 'Imagen 4.0',
    rating: 4.8,
  },
  {
    id: 'p003',
    title: 'AI 북커버 생성기',
    creator: 'Ubion Publisher',
    description: '책의 내용과 분위기에 맞는 매력적인 북커버를 디자인합니다.',
    link: 'https://ai.studio/apps/drive/19_apQDiuMCervMX3GYFkveEFsbM9MtzW',
    category: 'Image Generation',
    imagePlaceholder: 'https://picsum.photos/seed/bookcover/400/300',
    model: 'Gemini 2.5 Pro',
    rating: 4.5,
  },
  {
    id: 'p004',
    title: '이야기 생성기',
    creator: 'Ubion Storyteller',
    description: '간단한 키워드만으로 흥미로운 이야기를 만들어냅니다.',
    link: 'https://ai.studio/apps/drive/1ff4IvZSXesOlaSdPuULylTUnWXLhaEP-',
    category: 'Text Generation',
    imagePlaceholder: 'https://picsum.photos/seed/story/400/300',
    model: 'Gemini 2.5 Flash',
    rating: 4.6,
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

const ProjectCard: React.FC<{ project: Project; onEdit: (project: Project) => void; }> = ({ project, onEdit }) => {
  const handleCardClick = () => {
    window.open(project.link, '_blank', 'noopener,noreferrer');
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card's link navigation
    onEdit(project);
  };


  return (
    <div
      onClick={handleCardClick}
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
    >
      <button 
        onClick={handleEditClick}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60"
        aria-label="Edit project"
      >
        <Pencil className="h-4 w-4" />
      </button>

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

const RegistrationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onRegister: (link: string) => void;
}> = ({ isOpen, onClose, onRegister }) => {
  const [link, setLink] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (link.trim() && (link.startsWith('http://') || link.startsWith('https://'))) {
      onRegister(link.trim());
      setLink('');
      onClose();
    } else {
      alert('유효한 URL 링크를 입력해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity" onClick={onClose}>
      <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-gray-900">새로운 프로젝트 등록</h2>
        <p className="mt-1 text-sm text-gray-500">
          등록할 AI Studio 프로젝트 링크를 입력해주세요.
        </p>
        <div className="mt-4">
          <label htmlFor="project-link" className="sr-only">
            Project Link
          </label>
          <input
            type="url"
            id="project-link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://ubion-ai-studio.com/..."
            className="w-full rounded-md border-gray-300 py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

const EditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project: Project | null;
}> = ({ isOpen, onClose, onSave, project }) => {
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setRating(project.rating);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSave = () => {
    const newRating = parseFloat(rating.toString());
    if (title.trim() && !isNaN(newRating) && newRating >= 0 && newRating <= 5) {
      onSave({ ...project, title: title.trim(), rating: newRating });
      onClose();
    } else {
      alert('유효한 제목을 입력하고, 평점은 0에서 5 사이의 숫자로 입력해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-gray-900">프로젝트 정보 수정</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="project-title" className="block text-sm font-medium text-gray-700">
              프로젝트 이름
            </label>
            <input
              type="text"
              id="project-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="project-rating" className="block text-sm font-medium text-gray-700">
              평점 (0.0 ~ 5.0)
            </label>
            <input
              type="number"
              id="project-rating"
              value={rating}
              step="0.1"
              min="0"
              max="5"
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="mt-1 w-full rounded-md border-gray-300 py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            저장하기
          </button>
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const userId = 'ubion-dev';

  useEffect(() => {
    // This simulates fetching data. In a real app, this is where you'd connect to Firebase.
    setProjects(MOCK_PROJECTS);
    setLoading(false);
  }, []);

  const categories = useMemo(() => ['All', ...new Set(projects.map(p => p.category))], [projects]);

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
    } else { // 'latest' is the default sort
       result = [...result].sort((a, b) => (b.id > a.id ? 1 : -1));
    }

    return result;
  }, [projects, searchTerm, category, sortOrder]);

  const handleRegisterProject = (link: string) => {
    const newProject: Project = {
      id: `p${Date.now()}`, // Use timestamp for a more unique ID
      title: `새로운 프로젝트 ${projects.length + 1}`,
      creator: userId,
      description: '링크를 통해 새로 등록된 AI 프로젝트입니다.',
      link: link,
      category: 'Uncategorized',
      imagePlaceholder: `https://picsum.photos/seed/new${projects.length}/400/300`,
      model: 'Gemini 2.5 Flash',
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // Random rating between 3.5 and 5.0
    };
    setProjects(prevProjects => [newProject, ...prevProjects]);
  };
  
  const handleOpenEditModal = (project: Project) => {
    setProjectToEdit(project);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setProjectToEdit(null);
  };
  
  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prevProjects => 
      prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
    handleCloseEditModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-extrabold text-indigo-700">⭐ UBION HUB</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">ID: {userId}</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
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
              <ProjectCard 
                key={project.id} 
                project={project} 
                onEdit={handleOpenEditModal}
              />
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
      <RegistrationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegister={handleRegisterProject}
      />
      <EditModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleUpdateProject}
        project={projectToEdit}
      />
    </div>
  );
};


// 5. App wrapper
const App: React.FC = () => {
  return <IdeaHub />;
}

export default App;
