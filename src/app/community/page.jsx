"use client";
import { useState, useEffect } from "react";
import { getComments, postComments, postReplies } from "@/app/actions/communityActions";
import { useSession } from "next-auth/react";


export default function Comments() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [visibleReplies, setVisibleReplies] = useState({});
  const [charCount, setCharCount] = useState(0);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, most_replies
  const [filter, setFilter] = useState("all"); // all, answered, unanswered


  const { data: session } = useSession();

  console.log("Session:", session?.user?.name);
  
  // Sample user info - normally this would come from auth context
  const currentUser = {
    id: session?.user?.id,
    name: session?.user?.name,
    avatar: null,
    isAdmin: false,
  };

  const receiveComments = async () => {
    try {
      setIsLoading(true);
      const data = await getComments();
      setComments(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    receiveComments();
  }, []);

  const sortedComments = () => {
    let filtered = [...comments];
    
    // Apply filters
    if (filter === "answered") {
      filtered = filtered.filter(comment => comment.replies && comment.replies.length > 0);
    } else if (filter === "unanswered") {
      filtered = filtered.filter(comment => !comment.replies || comment.replies.length === 0);
    }
    
    // Apply sorting
    if (sortBy === "newest") {
      return filtered.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
    } else if (sortBy === "oldest") {
      return filtered.sort((a, b) => new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now()));
    } else if (sortBy === "most_replies") {
      return filtered.sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0));
    }
    return filtered;
  };

  const showNotificationAlert = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const postComment = async () => {
    if (!text.trim() || charCount > 300) return;
    
    try {
      setIsSubmitting(true);
      await postComments(currentUser.id, text);
      setText("");
      setCharCount(0);
      await receiveComments(); // Refresh comments
      showNotificationAlert("Comment posted successfully!");
    } catch (error) {
      console.error("Error posting comment:", error);
      showNotificationAlert("Failed to post comment. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const postReply = async (commentId) => {
    if (!replyText.trim()) return;
    
    try {
      setIsSubmitting(true);
      await postReplies(commentId, currentUser.id, replyText);
      setReplyText("");
      setReplyingTo(null);
      await receiveComments(); // Refresh comments
      showNotificationAlert("Reply posted successfully!");
    } catch (error) {
      console.error("Error posting reply:", error);
      showNotificationAlert("Failed to post reply. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };
  
  const toggleReplies = (commentId) => {
    setVisibleReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };
  
  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    setCharCount(value.length);
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Get avatar placeholder for users
  const getAvatarPlaceholder = (name = "") => {
    if (!name) return "?";
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Notification */}
      {showNotification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg transition-all duration-300 transform translate-y-0 ${
          notificationType === "success" ? "bg-blue-600 text-white" : "bg-red-500 text-white"
        }`}>
          <p>{notificationMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg border-2 border-blue-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Community Discussion</h2>
          <div className="text-sm text-gray-600">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'} • {comments.reduce((acc, comment) => acc + (comment.replies?.length || 0), 0)} replies
          </div>
        </div>
        
        <div className="text-center text-gray-600 mb-6">Join the conversation! Share your thoughts, ask questions, or provide insights. Our community and experts are here to help.</div>
        
        {/* Filters and Sorting */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex space-x-2 mb-2 sm:mb-0">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-full ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("answered")}
              className={`px-3 py-1 text-sm rounded-full ${filter === "answered" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Answered
            </button>
            <button
              onClick={() => setFilter("unanswered")}
              className={`px-3 py-1 text-sm rounded-full ${filter === "unanswered" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Unanswered
            </button>
          </div>
          
          <div className="flex items-center">
            <label className="text-sm text-gray-600 mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 py-1 px-2 pr-8 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most_replies">Most Replies</option>
            </select>
          </div>
        </div>
        
        {/* Comment form */}
        <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start mb-3">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {getAvatarPlaceholder(currentUser.name)}
              </div>
            </div>
            <div className="font-medium">{currentUser.name || "You"}</div>
          </div>
          
          <div className="relative">
            <textarea 
              value={text} 
              onChange={handleTextChange} 
              onKeyDown={(e) => handleKeyDown(e, postComment)}
              placeholder="Share your thoughts or ask a question..." 
              className="w-full p-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none min-h-24 text-black transition-all duration-200 bg-white"
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${charCount > 280 ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount}/300 characters
              </span>
              <button 
                onClick={postComment}
                disabled={isSubmitting || !text.trim() || charCount > 300} 
                className="bg-blue-600 text-white rounded-md px-4 py-2 font-medium hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isSubmitting ? 
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </span> : 
                  "Post Comment"
                }
              </button>
            </div>
          </div>
        </div>

        {/* Comments list */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-md">
            <p>{error}</p>
            <button 
              onClick={receiveComments}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedComments().length === 0 ? (
              <div className="text-center py-12 bg-blue-50 rounded-lg border border-blue-200">
                <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="mt-2 text-gray-700 font-medium">No comments found</p>
                <p className="text-gray-600 text-sm mt-1">
                  {filter !== "all" ? 
                    `No ${filter === "answered" ? "answered" : "unanswered"} comments found. Try changing the filter.` : 
                    "Be the first to comment!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedComments().map((comment) => (
                  <div key={comment._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                    <div className="bg-blue-50 p-4 border-b border-blue-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-medium">
                            {getAvatarPlaceholder(comment.author?.name || "User")}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <p className="text-sm font-semibold text-gray-800">
                              {comment.author?.name || "Anonymous User"}
                              {comment.author?.isAdmin && <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Staff</span>}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            #{comment._id?.substring(0, 6) || "123456"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-black mb-3">{comment.text}</p>
                      
                      <div className="flex items-center space-x-4 mt-4">
                        <button 
                          onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                          className={`flex items-center space-x-1 text-sm font-medium ${
                            replyingTo === comment._id ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                          } transition-colors`}
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          <span>{replyingTo === comment._id ? 'Cancel Reply' : 'Reply'}</span>
                        </button>
                        
                        {comment.replies && comment.replies.length > 0 && (
                          <button 
                            onClick={() => toggleReplies(comment._id)}
                            className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <svg 
                              className={`h-5 w-5 transition-transform duration-200 ${visibleReplies[comment._id] ? 'transform rotate-180' : ''}`}
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span>{visibleReplies[comment._id] ? 'Hide Replies' : `Show Replies (${comment.replies.length})`}</span>
                          </button>
                        )}
                        
                        <div className="flex-1 text-right">
                          <div className="inline-flex rounded-md shadow-sm">
                            <button className="px-2 py-1 text-gray-500 hover:text-gray-700">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {replyingTo === comment._id && (
                      <div className="p-3 bg-gray-50 border-t border-gray-200 transition-all duration-300 animate-fadeIn">
                        <div className="flex items-start mb-2">
                          <div className="flex-shrink-0 mr-2">
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                              {getAvatarPlaceholder(currentUser.name)}
                            </div>
                          </div>
                          <div className="text-xs font-medium">{currentUser.name || "You"}</div>
                        </div>
                        
                        <div className="relative">
                          <textarea 
                            value={replyText} 
                            onChange={(e) => setReplyText(e.target.value)} 
                            onKeyDown={(e) => handleKeyDown(e, () => postReply(comment._id))}
                            placeholder="Write a reply..." 
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none min-h-20 text-black transition-all duration-200"
                            autoFocus
                          />
                          <div className="flex justify-end mt-2 space-x-2">
                            <button 
                              onClick={() => setReplyingTo(null)} 
                              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => postReply(comment._id)}
                              disabled={isSubmitting || !replyText.trim()} 
                              className="bg-blue-600 text-white rounded-md px-3 py-1 text-sm font-medium hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                            >
                              {isSubmitting ? 
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Post
                                </span> : 
                                "Post Reply"
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {comment.replies && comment.replies.length > 0 && visibleReplies[comment._id] && (
                      <div className="bg-gray-50 p-3 border-t border-gray-200 transition-all duration-300 animate-fadeIn">
                        <div className="text-xs text-gray-500 mb-2">
                          {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </div>
                        <div className="space-y-3">
                          {comment.replies.map((reply, index) => (
                            <div 
                              key={index} 
                              className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-200 transition-colors duration-200"
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mr-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs font-medium">
                                    {getAvatarPlaceholder(reply.author?.name || "User")}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between">
                                    <p className="text-xs font-medium text-gray-800">
                                      {reply.author?.name || "Anonymous User"}
                                      {reply.author?.isAdmin && <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded-full">Staff</span>}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatDate(reply.createdAt)}
                                    </p>
                                  </div>
                                  <p className="mt-1 text-sm text-black">{reply.text}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination - if needed */}
            {sortedComments().length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    1
                  </a>
                  <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    2
                  </a>
                  <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    3
                  </a>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    8
                  </a>
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Community guidelines */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Community Guidelines</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-blue-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Be respectful and considerate of other community members</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-blue-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Keep discussions on-topic and constructive</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-blue-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>No spam, harassment, or offensive content</span>
          </li>
        </ul>
      </div>
    </div>
  );
}