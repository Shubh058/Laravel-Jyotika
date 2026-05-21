import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import api from '../services/api';
import { ArrowLeft, Calendar, Tag, User, Star, Send, MessageSquare, ThumbsUp, Minus, ThumbsDown } from 'lucide-react';

const categoryImages = {
  'Foreign Affairs': '/images/news_summit.png',
  'Economy': '/images/news_artisans.png',
  'Education': '/images/news_education.png',
  'Technology': '/images/news_digital.png',
};

const NewsDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [sentiment, setSentiment] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, feedbackRes] = await Promise.all([
          api.get(`/news/${id}`),
          api.get(`/feedback/news/${id}`),
        ]);
        setNews(newsRes.data);
        setFeedbacks(feedbackRes.data.data || []);
      } catch (error) {
        console.error("Error loading news detail", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (rating === 0 || !sentiment) {
      setSubmitError('Please select a rating and sentiment.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      await api.post('/feedback', {
        news_id: parseInt(id),
        rating,
        sentiment,
        comment,
      });
      setSubmitSuccess(true);
      setRating(0);
      setSentiment('');
      setComment('');
      // Refresh feedbacks
      const res = await api.get(`/feedback/news/${id}`);
      setFeedbacks(res.data.data || []);
    } catch (error) {
      setSubmitError(error.response?.data?.error || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="skeleton h-8 w-32"></div>
        <div className="skeleton h-80 rounded-2xl"></div>
        <div className="skeleton h-12 w-3/4"></div>
        <div className="skeleton h-40"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-slate-700">Story not found</h2>
        <Link to="/news" className="text-primary-600 font-medium mt-4 inline-block">← Back to News Feed</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <Link to="/news" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to News Feed
      </Link>

      {/* Hero image */}
      <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 lg:h-96">
        <img
          src={news.featured_image || categoryImages[news.category] || '/images/news_digital.png'}
          alt={news.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <span className="badge badge-blue !bg-white/90 backdrop-blur-sm !text-primary-700 mb-3">{news.category}</span>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">{news.title}</h1>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary-500" />{new Date(news.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-accent-500" />{news.source_name}</span>
        {news.author && <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-emerald-500" />{news.author.name}</span>}
      </div>

      {/* Article content */}
      <article className="card p-6 md:p-8">
        <p className="text-slate-700 leading-relaxed text-base md:text-lg whitespace-pre-line">
          {news.content}
        </p>
      </article>

      {/* Feedback Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary-500" />
          Community Feedback
          <span className="text-sm font-normal text-slate-400 ml-2">({feedbacks.length} responses)</span>
        </h2>

        {/* Feedback form */}
        <div className="card p-6 md:p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Share Your Feedback</h3>

          {submitSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-center">
              <p className="font-semibold">✓ Thank you! Your feedback has been submitted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">{submitError}</div>
              )}

              {/* Star rating */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`star ${(hoverRating || rating) >= star ? 'star-active fill-amber-400' : 'star-inactive'}`}
                      />
                    </button>
                  ))}
                  {rating > 0 && <span className="ml-2 text-sm text-slate-500 self-center">{rating}/5</span>}
                </div>
              </div>

              {/* Sentiment */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sentiment</label>
                <div className="flex gap-3">
                  {[
                    { value: 'positive', label: 'Positive', icon: ThumbsUp, color: 'emerald' },
                    { value: 'neutral', label: 'Neutral', icon: Minus, color: 'slate' },
                    { value: 'negative', label: 'Negative', icon: ThumbsDown, color: 'red' },
                  ].map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSentiment(s.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        sentiment === s.value
                          ? s.color === 'emerald'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : s.color === 'red'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-slate-500 bg-slate-50 text-slate-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <s.icon className="w-4 h-4" /> {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="3"
                  className="input resize-none"
                  placeholder="Share your thoughts on this story..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>

              {!user && <p className="text-sm text-slate-500">You need to <Link to="/login" className="text-primary-600 font-medium">sign in</Link> to submit feedback.</p>}
            </form>
          )}
        </div>

        {/* Feedback list */}
        {feedbacks.length > 0 && (
          <div className="space-y-4">
            {feedbacks.map(fb => (
              <div key={fb.id} className="card p-5 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {fb.user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-700">{fb.user?.name || 'Anonymous'}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <span className={`badge text-xs mb-2 ${
                    fb.sentiment === 'positive' ? 'badge-green' : fb.sentiment === 'negative' ? 'badge-red' : 'bg-slate-100 text-slate-600'
                  }`}>{fb.sentiment}</span>
                  {fb.comment && <p className="text-sm text-slate-600 mt-1">{fb.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetail;
