import React, { useEffect, useState } from 'react';
import { getFeed, postMoment } from '../services/api';
import { Camera, MapPin } from 'lucide-react';

const SocialGuestbook = () => {
  const [feed, setFeed] = useState([]);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');

  const refreshFeed = async () => {
    const data = await getFeed();
    setFeed(data);
  };

  useEffect(() => { refreshFeed(); }, []);

  const handlePost = async () => {
    if(!content || !username) return;
    await postMoment({ username, content });
    setContent('');
    refreshFeed();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 grid md:grid-cols-3 gap-8">
      {/* Post Form */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-kech-gold/20 sticky top-24">
          <h3 className="font-serif text-xl font-bold text-kech-red mb-4">Share Moment</h3>
          <input 
            className="w-full mb-3 p-2 border rounded" 
            placeholder="Your Name"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <textarea 
            className="w-full mb-3 p-2 border rounded" 
            rows="4" 
            placeholder="What did you discover today?"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <button 
            onClick={handlePost}
            className="w-full bg-kech-teal text-white py-2 rounded font-bold hover:bg-teal-700"
          >
            Post to Guestbook
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="md:col-span-2 space-y-6">
        {feed.map((post, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-md flex gap-4">
            <img 
              src={post.image_url} 
              alt="User" 
              className="w-24 h-24 object-cover rounded-lg bg-gray-200"
            />
            <div>
              <div className="flex items-center gap-2 text-kech-red font-bold text-sm mb-1">
                <span>@{post.username}</span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1 text-gray-400 text-xs"><MapPin size={10}/> Marrakech</span>
              </div>
              <p className="text-gray-700">{post.content}</p>
            </div>
          </div>
        ))}
        {feed.length === 0 && <p className="text-center text-gray-500 mt-10">Be the first to share a memory!</p>}
      </div>
    </div>
  );
};

export default SocialGuestbook;
