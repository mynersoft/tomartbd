'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Clock,
  User,
  Send,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Crown,
  Filter,
  SortDesc,
  Search,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  useQuestions,
  useAddQuestion,
  useAddAnswer,
  useMarkBestAnswer,
  useVote,
} from '@/hooks/useQuestionsQuery';
import { setFilters, setPagination } from '@/store/slices/questionsSlice';

const ProductQuestions = ({ productName, userId }) => {
  const dispatch = useDispatch();
  const { filters, pagination } = useSelector((state) => state.questions);

  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState({});
  const [newQuestion, setNewQuestion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // React Query hooks
  const {
    data: questionsData,
    isLoading,
    error,
    refetch,
  } = useQuestions(productId, {
    onError: (err) => {
      toast.error('Failed to load questions');
    },
  });

  const addQuestionMutation = useAddQuestion();
  const addAnswerMutation = useAddAnswer();
  const markBestAnswerMutation = useMarkBestAnswer();
  const voteQuestionMutation = useVote('question');
  const voteAnswerMutation = useVote('answer');

  const questions = questionsData?.questions || [];
  const paginationInfo = questionsData?.pagination || pagination;

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (!newQuestion.trim() || newQuestion.length < 10) {
      toast.error('Please enter a detailed question (min 10 characters)');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to ask a question');
      return;
    }

    addQuestionMutation.mutate(
      {
        productId,
        question: newQuestion,
      },
      {
        onSuccess: () => {
          setNewQuestion('');
          toast.success('Question submitted successfully!');
        },
      }
    );
  };

  const handleSubmitAnswer = (questionId) => {
    const answer = answerText[questionId]?.trim();

    if (!answer || answer.length < 20) {
      toast.error('Please provide a detailed answer (min 20 characters)');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to submit an answer');
      return;
    }

    addAnswerMutation.mutate(
      {
        questionId,
        answer,
      },
      {
        onSuccess: () => {
          setAnswerText((prev) => ({ ...prev, [questionId]: '' }));
          toast.success('Answer submitted successfully!');
        },
      }
    );
  };

  const handleMarkBestAnswer = (questionId, answerId) => {
    if (!isAuthenticated) {
      toast.error('Please login to mark best answer');
      return;
    }

    markBestAnswerMutation.mutate({
      questionId,
      answerId,
    });
  };

  const handleVoteQuestion = (questionId, voteType) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote');
      return;
    }

    voteQuestionMutation.mutate({
      id: questionId,
      voteType,
    });
  };

  const handleVoteAnswer = (questionId, answerId, voteType) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote');
      return;
    }

    voteAnswerMutation.mutate({
      id: questionId,
      answerId,
      voteType,
    });
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
    dispatch(setPagination({ page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= paginationInfo.totalPages) {
      dispatch(setPagination({ page: newPage }));
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      q.question.toLowerCase().includes(searchLower) ||
      q.answers?.some((a) => a.answer.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const QuestionSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-24 bg-gray-200 rounded-lg"></div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Questions & Answers
              </h3>
              <p className="text-sm text-gray-500">
                Have questions about {productName}? Get answers from our
                community.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Questions</option>
              <option value="answered">Answered</option>
              <option value="pending">Unanswered</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="votes">Most Votes</option>
            </select>
          </div>
        </div>

        {/* Question Form */}
        <form onSubmit={handleSubmitQuestion} className="space-y-4">
          <div>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder={`What would you like to know about ${productName}?`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              rows={3}
              maxLength={500}
              disabled={addQuestionMutation.isLoading}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>Be specific and detailed (min 10 characters)</span>
              <span>{newQuestion.length}/500</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={
                addQuestionMutation.isLoading ||
                newQuestion.length < 10 ||
                !isAuthenticated
              }
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addQuestionMutation.isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Ask Question
                </>
              )}
            </button>

            {!isAuthenticated && (
              <p className="text-sm text-amber-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Please login to ask a question
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Questions List */}
      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-6">
            <QuestionSkeleton />
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load questions
            </h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Loader2 className="h-4 w-4" />
              Retry
            </button>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No questions yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to ask a question about {productName}
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredQuestions.length} of {paginationInfo.total}{' '}
                questions
              </p>
            </div>

            {filteredQuestions.map((question) => (
              <div
                key={question._id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Question Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === question._id ? null : question._id
                    )
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 flex-1">
                          {question.question}
                        </h4>
                        <div className="flex items-center gap-2">
                          {question.status === 'answered' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              <CheckCircle className="h-3 w-3" />
                              Answered
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                              <Clock className="h-3 w-3" />
                              Unanswered
                            </span>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVoteQuestion(question._id, 'up');
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <ThumbsUp className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="font-medium text-gray-700 min-w-[20px] text-center">
                              {question.votes || 0}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVoteQuestion(question._id, 'down');
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <ThumbsDown className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          {question.userId?.avatar ? (
                            <img
                              src={question.userId.avatar}
                              alt={question.userId.name}
                              className="h-5 w-5 rounded-full"
                            />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                          <span>{question.userId?.name || 'Anonymous'}</span>
                        </div>
                        <span>•</span>
                        <span>{formatDate(question.createdAt)}</span>
                        <span>•</span>
                        <span>
                          {question.answers?.length || 0}{' '}
                          {question.answers?.length === 1
                            ? 'answer'
                            : 'answers'}
                        </span>
                      </div>
                    </div>

                    <div className="ml-4">
                      {expandedQuestion === question._id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Answers */}
                {expandedQuestion === question._id && (
                  <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                    {/* Answers List */}
                    {question.answers?.length > 0 ? (
                      <div className="space-y-6 mb-8">
                        {question.answers.map((answer) => (
                          <div
                            key={answer._id}
                            className={`pl-4 border-l-2 ${
                              answer.isBestAnswer
                                ? 'border-green-500 bg-green-50'
                                : 'border-blue-200'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  {answer.userId?.avatar ? (
                                    <img
                                      src={answer.userId.avatar}
                                      alt={answer.userId.name}
                                      className="h-6 w-6 rounded-full"
                                    />
                                  ) : (
                                    <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                                      <User className="h-4 w-4 text-gray-500" />
                                    </div>
                                  )}
                                  <span className="font-medium text-gray-900">
                                    {answer.userId?.name || 'Anonymous'}
                                  </span>
                                </div>

                                {answer.isBestAnswer && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    <Crown className="h-3 w-3" />
                                    Best Answer
                                  </span>
                                )}

                                <span className="text-xs text-gray-500">
                                  {formatDate(answer.createdAt)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() =>
                                      handleVoteAnswer(
                                        question._id,
                                        answer._id,
                                        'up'
                                      )
                                    }
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    <ThumbsUp className="h-3 w-3 text-gray-600" />
                                  </button>
                                  <span className="text-xs font-medium text-gray-700">
                                    {answer.votes || 0}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleVoteAnswer(
                                        question._id,
                                        answer._id,
                                        'down'
                                      )
                                    }
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    <ThumbsDown className="h-3 w-3 text-gray-600" />
                                  </button>
                                </div>

                                {isAuthenticated &&
                                  question.userId?._id === user?.id &&
                                  !answer.isBestAnswer && (
                                    <button
                                      onClick={() =>
                                        handleMarkBestAnswer(
                                          question._id,
                                          answer._id
                                        )
                                      }
                                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                      Mark as Best
                                    </button>
                                  )}
                              </div>
                            </div>

                            <p className="text-gray-700 mb-4">
                              {answer.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mb-6">
                        <p className="text-gray-600 flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-gray-400" />
                          No answers yet. Be the first to share your knowledge!
                        </p>
                      </div>
                    )}

                    {/* Answer Form */}
                    {isAuthenticated && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3">
                          {question.answers?.length > 0
                            ? 'Add your answer'
                            : 'Be the first to answer'}
                        </h5>
                        <div className="space-y-4">
                          <textarea
                            value={answerText[question._id] || ''}
                            onChange={(e) =>
                              setAnswerText((prev) => ({
                                ...prev,
                                [question._id]: e.target.value,
                              }))
                            }
                            rows={3}
                            placeholder="Share your experience, knowledge, or suggestions..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            maxLength={1000}
                            disabled={addAnswerMutation.isLoading}
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {answerText[question._id]?.length || 0}/1000
                              characters
                            </span>
                            <button
                              onClick={() => handleSubmitAnswer(question._id)}
                              disabled={
                                !answerText[question._id]?.trim() ||
                                answerText[question._id]?.length < 20 ||
                                addAnswerMutation.isLoading
                              }
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {addAnswerMutation.isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                              Post Answer
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isAuthenticated && (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-600">
                          Please{' '}
                          <button
                            onClick={() => {
                              // Add login redirect logic
                              toast.error('Please login to submit an answer');
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            login
                          </button>{' '}
                          to submit an answer
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {paginationInfo.totalPages > 1 && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Page {paginationInfo.page} of {paginationInfo.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(paginationInfo.page - 1)}
                      disabled={paginationInfo.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(paginationInfo.page + 1)}
                      disabled={
                        paginationInfo.page === paginationInfo.totalPages
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductQuestions;
