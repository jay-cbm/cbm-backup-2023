'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkEmoji from 'remark-emoji';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import Image from 'next/image';
import Link from 'next/link';
import markdownStyles from "./markdown-styles.module.css";
import { processPagesCmsMarkdown } from '../_lib/markdown-utils';
import { useEffect, useState } from 'react';

type Props = {
  content: string;
  // Optional class name for additional styling
  className?: string;
  // Content type (post, ama, press-release) for potential type-specific styling
  contentType?: 'post' | 'ama' | 'press-release';
  // Whether to allow HTML in markdown (useful for embeds and custom content)
  allowHtml?: boolean;
  // Whether to use smaller text size for certain content types
  compact?: boolean;
};

interface CustomImageProps {
  src: string;
  alt?: string;
  title?: string;
  width?: string;
  height?: string;
  className?: string;
}

export function PostBody({ 
  content, 
  className = "", 
  contentType = 'post',
  allowHtml = true,
  compact = false
}: Props) {
  // Process the content if it comes from PagesCMS
  const [processedContent, setProcessedContent] = useState(content);
  
  useEffect(() => {
    // Process the content when it changes, applying PagesCMS-specific transformations
    setProcessedContent(processPagesCmsMarkdown(content));
  }, [content]);
  // Define custom components for markdown rendering including PagesCMS-specific components
  const customComponents = {
    // Custom image rendering with Next.js Image when possible
    img: ({ node, src, alt, title, width, height, className, ...props }: CustomImageProps & any) => {
      // Support absolute and relative URLs for images
      const isExternal = src.startsWith('http');
      const imageWidth = width ? parseInt(width) : 800;
      const imageHeight = height ? parseInt(height) : 450;
      
      // Choose the appropriate image component based on URL type
      if (isExternal) {
        return (
          <span className="my-6 block relative overflow-hidden rounded-lg">
            <img
              src={src}
              alt={alt || 'Article image'}
              title={title}
              width={imageWidth}
              height={imageHeight}
              className={`w-full h-auto rounded-lg ${className || ''}`}
              {...props}
            />
            {title && <span className="text-sm text-gray-500 mt-2 block">{title}</span>}
          </span>
        );
      } else {
        // Handle internal images with Next.js Image
        return (
          <span className="my-6 block relative overflow-hidden rounded-lg">
            <Image
              src={src}
              alt={alt || 'Article image'}
              title={title}
              width={imageWidth}
              height={imageHeight}
              className={`w-full h-auto rounded-lg ${className || ''}`}
              {...props}
            />
            {title && <span className="text-sm text-gray-500 mt-2 block">{title}</span>}
          </span>
        );
      }
    },
    
    // Custom link handling
    a: ({ node, href, children, ...props }: any) => {
      // Handle internal links
      const isInternal = href && !href.startsWith('http') && !href.startsWith('#');
      
      if (isInternal) {
        return (
          <Link 
            href={href} 
            className="text-red-600 hover:underline" 
            {...props}
          >
            {children}
          </Link>
        );
      }
      
      // For external links, add appropriate security attributes
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-red-600 hover:underline"
          {...props}
        >
          {children}
        </a>
      );
    },
    
    // Custom code block handling with syntax highlighting
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline ? (
        <div className="my-6 overflow-hidden rounded-lg">
          <div className="bg-gray-800 text-xs text-gray-400 px-4 py-1 flex justify-between items-center">
            {language && <span>{language}</span>}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
              }}
              className="text-gray-400 hover:text-white"
              aria-label="Copy code"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
              </svg>
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code className="bg-gray-200 px-1 py-0.5 rounded text-red-800 text-sm" {...props}>
          {children}
        </code>
      );
    },
    
    // Custom blockquote styling
    blockquote: ({ node, children, ...props }: any) => (
      <blockquote 
        className="border-l-4 border-red-600 pl-4 italic my-6 text-gray-700" 
        {...props}
      >
        {children}
      </blockquote>
    ),
    
    // Custom table styling
    table: ({ node, children, ...props }: any) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-gray-200" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ node, children, ...props }: any) => (
      <th 
        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" 
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ node, children, ...props }: any) => (
      <td 
        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" 
        {...props}
      >
        {children}
      </td>
    ),
    tr: ({ node, children, ...props }: any) => (
      <tr 
        className="bg-white even:bg-gray-50" 
        {...props}
      >
        {children}
      </tr>
    ),
    
    // Custom heading styling with anchor links
    h2: ({ node, children, ...props }: any) => (
      <h2 
        className="text-3xl mt-12 mb-4 leading-snug font-bold scroll-mt-24" 
        {...props}
      >
        {children}
        <a href={`#${props.id}`} className="ml-2 text-gray-400 opacity-0 hover:opacity-100 text-xl">#</a>
      </h2>
    ),
    h3: ({ node, children, ...props }: any) => (
      <h3 
        className="text-2xl mt-8 mb-4 leading-snug font-bold scroll-mt-24" 
        {...props}
      >
        {children}
        <a href={`#${props.id}`} className="ml-2 text-gray-400 opacity-0 hover:opacity-100 text-lg">#</a>
      </h3>
    ),
  };

  // Add support for PagesCMS notice components
  const noticeComponents = {
    // Custom div component for notice boxes
    div: ({ node, className, children, ...props }: any) => {
      // Handle special notice classes from PagesCMS
      if (className?.includes('-notice')) {
        let bgColor = 'bg-gray-100';
        let textColor = 'text-gray-800';
        let borderColor = 'border-l-4 border-gray-300';
        let icon = null;
        
        if (className.includes('info-notice')) {
          bgColor = 'bg-blue-50';
          textColor = 'text-blue-800';
          borderColor = 'border-l-4 border-blue-300';
          icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          );
        } else if (className.includes('warning-notice')) {
          bgColor = 'bg-yellow-50';
          textColor = 'text-yellow-800';
          borderColor = 'border-l-4 border-yellow-300';
          icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          );
        } else if (className.includes('error-notice')) {
          bgColor = 'bg-red-50';
          textColor = 'text-red-800';
          borderColor = 'border-l-4 border-red-300';
          icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          );
        } else if (className.includes('success-notice')) {
          bgColor = 'bg-green-50';
          textColor = 'text-green-800';
          borderColor = 'border-l-4 border-green-300';
          icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          );
        } else if (className.includes('tip-notice')) {
          bgColor = 'bg-purple-50';
          textColor = 'text-purple-800';
          borderColor = 'border-l-4 border-purple-300';
          icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
          );
        }
        
        return (
          <div className={`p-4 my-6 rounded-md ${bgColor} ${textColor} ${borderColor}`} {...props}>
            <div className="flex">
              {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
              <div>{children}</div>
            </div>
          </div>
        );
      }
      
      // Handle embed containers for iframes
      if (className === 'embed-container') {
        return (
          <div className="relative overflow-hidden my-8 pb-[56.25%] h-0" {...props}>
            {children}
          </div>
        );
      }
      
      // Default div rendering
      return (
        <div className={className} {...props}>
          {children}
        </div>
      );
    },
    
    // Custom figure component for images with captions
    figure: ({ node, children, ...props }: any) => {
      return (
        <figure className="my-8 text-center" {...props}>
          {children}
        </figure>
      );
    },
    
    figcaption: ({ node, children, ...props }: any) => {
      return (
        <figcaption className="text-sm text-gray-600 mt-2 italic" {...props}>
          {children}
        </figcaption>
      );
    },
    
    // Custom iframe component for embeds
    iframe: ({ node, ...props }: any) => {
      return (
        <iframe 
          className="absolute top-0 left-0 w-full h-full" 
          allowFullScreen 
          loading="lazy"
          {...props} 
        />
      );
    }
  };

  // Merge the custom components with the notice components
  const allComponents = {
    ...customComponents,
    ...noticeComponents
  };
  
  // Set base content class based on content type and compact setting
  const contentClass = compact ? 'text-base' : 'text-lg';
  const containerClass = contentType === 'press-release' ? 'prose-blockquote:border-gray-300' : '';

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className={`${markdownStyles["markdown"]} ${contentClass} ${containerClass}`}>
        <ReactMarkdown
          remarkPlugins={[
            remarkGfm, // GitHub Flavored Markdown support
            remarkBreaks, // Line breaks as <br>
            [remarkEmoji, { emoticon: true }] // Emoji support
          ]}
          rehypePlugins={[
            allowHtml ? rehypeRaw : () => {}, // Allow HTML if specified
            rehypeSlug, // Add IDs to headings
            rehypeHighlight // Syntax highlighting
          ]}
          components={allComponents}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
