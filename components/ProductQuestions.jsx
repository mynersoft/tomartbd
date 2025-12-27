// components/ProductQuestions.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  HelpCircle, 
  Search, 
  Filter,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Clock,
  User,
  Send,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Flag,
  Edit,
  Trash2,
  Loader2,
  Plus,
  AlertCircle,
  Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductQuestions = ({ productId, productName }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, answered, unanswered
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [userVotes, setUserVotes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample initial questions
  const sampleQuestions = [
    {
      id: 1,
      question: "Is this product compatible with iOS 17?",
      author: "Alex Chen",
      date: "2024-01-15",
      votes: 42,
      answers: [
        {
          id: 1,
          text: "Yes, it's fully compatible with iOS 17. I've been using it for 2 months without any issues.",
          author: "Sarah Johnson",
          date: "2024-01-16",
          isVerified: true,
          votes: 18
        },
        {
          id: 2,
          text: "Official compatibility was added in the latest firmware update. Make sure to update the device first.",
          author: "Support Team",
          date: "2024-01-17",
          isVerified: false,
          votes: 12
        }
      ],
      isAnswered: true,
      helpfulCount: 24
    },
    {
      id: 2,
      question: "What's the battery life like with continuous use?",
      author: "Marcus Rivera",
      date: "2024-01-10",
      votes: 31,
      answers: [
        {
          id: 1,
          text: "I get about 8-9 hours of continuous use on a single charge. Standby time is excellent.",
          author: "TechEnthusiast22",
          date: "2024-01-11",
          isVerified: true,
          votes: 15
        }
      ],
      isAnswered: true,
      helpfulCount: 19
    },
    {
      id: 3,
      question: "Does it come with international warranty?",
      author: "Priya Sharma",
      date: "2024-01-08",
      votes: 25,
      answers: [],
      isAnswered: false,
      helpfulCount: 8
    },
    {
      id: 4,
      question: "Can I connect this to multiple devices simultaneously?",
      author: "David Kim",
      date: "2024-01-05",
      votes: 38,
      answers: [
        {
          id: 1,
          text: "Yes, it supports multi-point connectivity. I can switch between my laptop and phone seamlessly.",
          author: "John Miller",
          date: "2024-01-06",
          isVerified: true,
          votes: 21
        }
      ],
      isAnswered: true,
      helpfulCount: 30
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setQuestions(sampleQuestions);
      setLoading(false);
    }, 800);
  }, []);

  const filteredQuestions = questions.filter(q => {
    // Search filter
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answers.some(a => a.text.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    if (filter === 'answered') return matchesSearch && q.isAnswered;
    if (filter === 'unanswered') return matchesSearch && !q.isAnswered;
    
    return matchesSearch;
  });

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || newQuestion.length < 10) {
      toast.error('Please enter a detailed question (min 10 characters)');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newQ = {
        id: Date.now(),
        question: newQuestion,
        author: "You",
        date: new Date().toISOString().split('T')[0],
        votes: 0,
        answers: [],
        isAnswered: false,
        helpfulCount: 0
      };
      
      setQuestions(prev => [newQ, ...prev]);
      setNewQuestion('');
      setShowAskForm(false);
      setIsSubmitting(false);
      
      toast.success('Question submitted successfully!');
    }, 1000);
  };

  const handleSubmitAnswer = async (questionId) => {
    if (!answerText.trim() || answerText.length < 20) {
      toast.error('Please provide a detailed answer (min 20 characters)');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          const newAnswer = {
            id: Date.now(),
            text: answerText,
            author: "You",
            date: new Date().toISOString().split('T')[0],
            isVerified: false,
            votes: 0
          };
          
          setAnswerText('');
          setExpandedQuestion(null);
          
          return {
            ...q,
            answers: [...q.answers, newAnswer],
            isAnswered: true
          };
        }
        return q;
      }));
      
      toast.success('Answer submitted successfully!');
    }, 800);
  };

  const handleVote = (questionId, type) => {
    // Check if user already voted
    if (userVotes[questionId]) {
      toast.error('You have already voted on this question');
      return;
    }

    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          votes: type === 'up' ? q.votes + 1 : q.votes - 1
        };
      }
      return q;
    }));

    setUserVotes(prev => ({ ...prev, [questionId]: type }));
    toast.success('Vote recorded!');
  };

  const handleHelpful = (questionId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return { ...q, helpfulCount: q.helpfulCount + 1 };
      }
      return q;
    }));
    toast.success('Marked as helpful!');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Questions & Answers
                </h2>
                <p className="text-gray-600">
                  Have questions about {productName}? Get answers from our community
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAskForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              Ask a Question
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {questions.length}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {questions.filter(q => q.isAnswered).length}
              </div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600">
                {questions.reduce((sum, q) => sum + q.answers.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Answers</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">
                {questions.reduce((sum, q) => sum + q.helpfulCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Helpful Votes</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions and answers..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('answered')}
                className={`px-4 py-2 rounded-lg transition-all ${filter === 'answered' ? 'bg-green-100 text-green-700 font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <CheckCircle className="inline h-4 w-4 mr-1" />
                Answered
              </button>
              <button
                onClick={() => setFilter('unanswered')}
                className={`px-4 py-2 rounded-lg transition-all ${filter === 'unanswered' ? 'bg-yellow-100 text-yellow-700 font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <HelpCircle className="inline h-4 w-4 mr-1" />
                Unanswered
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ask Question Form Modal */}
      {showAskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <HelpCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Ask a Question
                  </h3>
                </div>
                <button
                  onClick={() => setShowAskForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Your question will be visible to other customers and our support team
              </p>
            </div>

            <form onSubmit={handleSubmitQuestion} className="p-6 space-y-6">
              <div className="space-y-4">
                <label className="block font-semibold text-gray-900">
                  Your Question
                </label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows={4}
                  placeholder={`Be specific about what you want to know about ${productName}...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Minimum 10 characters</span>
                  <span>{newQuestion.length}/500</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-800 mb-1">
                      Tips for getting better answers
                    </p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Be specific about features or concerns</li>
                      <li>• Mention if you've checked the product specifications</li>
                      <li>• Keep your question clear and concise</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAskForm(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || newQuestion.length < 10}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Question
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="p-6 md:p-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No questions found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try a different search term' : 'Be the first to ask a question!'}
            </p>
            <button
              onClick={() => setShowAskForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
            >
              <Plus className="h-5 w-5" />
              Ask a Question
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQuestions.map((question) => (
              <div 
                key={question.id} 
                className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
              >
                {/* Question Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {question.question}
                        </h3>
                        {question.isAnswered && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            <CheckCircle className="h-3 w-3" />
                            Answered
                          </span>
                        )}
                        {!question.isAnswered && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                            <Clock className="h-3 w-3" />
                            Unanswered
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {question.author}
                        </span>
                        <span>{formatDate(question.date)}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {question.answers.length} answers
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {question.helpfulCount} found helpful
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(question.id, 'up');
                        }}
                        disabled={userVotes[question.id]}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                      >
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      </button>
                      <span className={`font-bold text-lg ${
                        question.votes > 0 ? 'text-green-600' : 
                        question.votes < 0 ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {question.votes}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(question.id, 'down');
                        }}
                        disabled={userVotes[question.id]}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                      >
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  {expandedQuestion === question.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 mx-auto mt-4" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 mx-auto mt-4" />
                  )}
                </div>

                {/* Expanded Content */}
                {expandedQuestion === question.id && (
                  <div className="border-t border-gray-200 p-6">
                    {/* Answers List */}
                    <div className="space-y-6 mb-8">
                      {question.answers.length > 0 ? (
                        question.answers.map((answer) => (
                          <div key={answer.id} className="pl-4 border-l-4 border-blue-200">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900">
                                    {answer.author}
                                  </span>
                                  {answer.isVerified && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                      <CheckCircle className="h-3 w-3" />
                                      Verified Buyer
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {formatDate(answer.date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleHelpful(question.id)}
                                  className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  {answer.votes}
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-4">{answer.text}</p>
                            <div className="flex gap-4">
                              <button className="text-sm text-gray-500 hover:text-gray-700">
                                Helpful
                              </button>
                              <button className="text-sm text-gray-500 hover:text-gray-700">
                                Report
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-xl">
                          <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">
                            No answers yet. Be the first to answer!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Answer Form */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Have an answer?
                      </h4>
                      <div className="space-y-4">
                        <textarea
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          rows={3}
                          placeholder="Share your knowledge or experience..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                          maxLength={1000}
                        />
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-500">
                            Minimum 20 characters
                          </div>
                          <div className="text-sm text-gray-500">
                            {answerText.length}/1000
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSubmitAnswer(question.id)}
                            disabled={!answerText.trim() || answerText.length < 20}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="h-4 w-4" />
                            Submit Answer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        {!searchQuery && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-600" />
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  question: "What is the return policy for this product?",
                  answer: "We offer a 30-day return policy for unused products in original packaging."
                },
                {
                  question: "Does it come with a warranty?",
                  answer: "Yes, all our products come with a 1-year manufacturer warranty."
                },
                {
                  question: "How long does shipping take?",
                  answer: "Standard shipping takes 3-5 business days, express shipping is 1-2 days."
                },
                {
                  question: "Is there international shipping available?",
                  answer: "Yes, we ship to most countries worldwide. Check your location during checkout."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-6 bg-gray-50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            {filteredQuestions.length} of {questions.length} questions shown
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              See All Questions
            </button>
            <button
              onClick={() => setShowAskForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              <Plus className="h-4 w-4" />
              Ask New Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuestions;