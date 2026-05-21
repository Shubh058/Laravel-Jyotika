import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Tag, ChevronRight, MessageSquare, Newspaper, Search, Filter } from 'lucide-react';

// Fallback images mapped by category
const categoryImages = {
  'Foreign Affairs': '/images/news_summit.png',
  'Economy': '/images/news_artisans.png',
  'Education': '/images/news_education.png',
  'Technology': '/images/news_digital.png',
  'Government Scheme': '/images/news_artisans.png',
  'Defence': '/images/news_summit.png',
  'Health': '/images/news_education.png',
  'Science': '/images/news_digital.png',
  'General': '/images/news_digital.png'
};

const getFallbackImage = (category) => categoryImages[category] || categoryImages['General'] || '/images/news_digital.png';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Education', 'Technology', 'Government Scheme', 'Foreign Affairs', 'Defence', 'Economy', 'Health', 'Science', 'Sports'];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== 'All') params.category = activeCategory;
        if (searchTerm.trim()) params.search = searchTerm.trim();

        const response = await api.get('/news', { params });
        setNews(response.data.data || []);
      } catch (error) {
        console.error("Error fetching news", error);
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(fetchNews, searchTerm.trim() ? 450 : 0);
    return () => clearTimeout(timeout);
  }, [activeCategory, searchTerm]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="skeleton h-10 w-64"></div>
        <div className="skeleton h-12 w-full max-w-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton h-[420px]"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero header */}
      <div className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
        <div className="relative z-10">
          <div className="badge badge-orange mb-4 !text-white !bg-accent-500/30">Government of India</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">360° Media Feedback Platform</h1>
          <p className="text-primary-200 text-lg max-w-2xl">Empowering citizens to share feedback on government news stories from regional media across India.</p>
          
          {/* Search bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search news stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-primary-300 focus:bg-white/20 focus:border-white/40 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News grid */}
      {news.length === 0 ? (
        <div className="card p-16 text-center">
          <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No stories found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(item => (
            <Link
              to={`/news/${item.id}`}
              key={item.id}
              className="card overflow-hidden flex flex-col group cursor-pointer"
            >
              {/* Image */}
              <div className="h-52 relative overflow-hidden">
                <img
                  src={item.featured_image || getFallbackImage(item.category)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="badge badge-blue !bg-white/90 backdrop-blur-sm !text-primary-700 shadow-sm">
                    {item.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="badge !bg-black/50 backdrop-blur-sm !text-white text-xs">
                    {item.analytics_logs && item.analytics_logs.length > 0 ? item.analytics_logs[0].total_feedback : 0} reviews
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {item.source_name}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                  {item.summary || item.content?.substring(0, 150) + '...'}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Feedback
                  </span>
                  <span className="text-primary-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
