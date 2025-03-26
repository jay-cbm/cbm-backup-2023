'use client';

import { useState, useEffect } from 'react';
import { BLOCKCHAIN_TOPICS, SUBTOPICS } from '@/lib/client-utils';

interface TopicFilterProps {
  selectedTopics: string[];
  onTopicChange: (topics: string[]) => void;
  topicCounts?: Record<string, number>;
}

export function TopicFilter({ selectedTopics, onTopicChange, topicCounts = {} }: TopicFilterProps) {
  const [blockchainExpanded, setBlockchainExpanded] = useState(true);
  const [subtopicsExpanded, setSubtopicsExpanded] = useState(true);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  // Update when selectedTopics changes from URL
  useEffect(() => {
    // This ensures the component reacts to URL changes
  }, [selectedTopics]);

  const toggleTopic = (topic: string) => {
    // Normalize the topic name to lowercase for consistent comparison
    const normalizedTopic = topic.toLowerCase().trim();
    
    // Check if the topic is already selected (case-insensitive)
    const isSelected = selectedTopics.some(
      t => t.toLowerCase().trim() === normalizedTopic
    );
    
    if (isSelected) {
      // Remove the topic if it's already selected
      const updatedTopics = selectedTopics.filter(
        t => t.toLowerCase().trim() !== normalizedTopic
      );
      onTopicChange(updatedTopics);
      console.log('Removed topic:', topic, 'Updated topics:', updatedTopics);
    } else {
      // Add the topic if it's not already selected
      const updatedTopics = [...selectedTopics, topic];
      onTopicChange(updatedTopics);
      console.log('Added topic:', topic, 'Updated topics:', updatedTopics);
    }
  };

  const clearAllTopics = () => {
    onTopicChange([]);
  };
  
  // Count how many topics are selected
  const selectedCount = selectedTopics.length;
  
  // Check if any topics are selected
  const hasSelectedTopics = selectedCount > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Filter by Topic</h3>
        {hasSelectedTopics && (
          <button 
            onClick={clearAllTopics}
            className="text-sm px-2 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          >
            Clear All ({selectedCount})
          </button>
        )}
      </div>

      {/* Blockchain Topics */}
      <div className="mb-4">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => setBlockchainExpanded(!blockchainExpanded)}
        >
          <h4 className="font-semibold">Blockchains</h4>
          <span>{blockchainExpanded ? '−' : '+'}</span>
        </div>
        
        {blockchainExpanded && (
          <div className="ml-2 space-y-2">
            {BLOCKCHAIN_TOPICS.map(topic => (
              <div key={topic} className="flex items-center">
                <input
                  type="checkbox"
                  id={`topic-${topic}`}
                  checked={selectedTopics.some(t => t.toLowerCase().trim() === topic.toLowerCase().trim())}
                  onChange={() => toggleTopic(topic)}
                  className="mr-2 cursor-pointer h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor={`topic-${topic}`} 
                  className={`capitalize cursor-pointer select-none ${selectedTopics.some(t => t.toLowerCase().trim() === topic.toLowerCase().trim()) ? 'font-semibold text-red-600' : 'hover:text-red-500'}`}
                  onMouseEnter={() => setHoveredTopic(topic)}
                  onMouseLeave={() => setHoveredTopic(null)}
                >
                  {topic}
                  {topicCounts[topic] && (
                    <span className="text-gray-500 text-sm ml-1">({topicCounts[topic]})</span>
                  )}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subtopics */}
      <div>
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => setSubtopicsExpanded(!subtopicsExpanded)}
        >
          <h4 className="font-semibold">Categories</h4>
          <span>{subtopicsExpanded ? '−' : '+'}</span>
        </div>
        
        {subtopicsExpanded && (
          <div className="ml-2 grid grid-cols-2 gap-2">
            {SUBTOPICS.map(topic => (
              <div key={topic} className="flex items-center">
                <input
                  type="checkbox"
                  id={`topic-${topic}`}
                  checked={selectedTopics.some(t => t.toLowerCase().trim() === topic.toLowerCase().trim())}
                  onChange={() => toggleTopic(topic)}
                  className="mr-2 cursor-pointer h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor={`topic-${topic}`} 
                  className={`capitalize cursor-pointer select-none text-sm ${selectedTopics.some(t => t.toLowerCase().trim() === topic.toLowerCase().trim()) ? 'font-semibold text-red-600' : 'hover:text-red-500'}`}
                  onMouseEnter={() => setHoveredTopic(topic)}
                  onMouseLeave={() => setHoveredTopic(null)}
                >
                  {topic}
                  {topicCounts[topic] && (
                    <span className="text-gray-500 text-sm ml-1">({topicCounts[topic]})</span>
                  )}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
