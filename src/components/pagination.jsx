import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-card px-4 py-6 border-t border-border">
      <div className="flex items-center justify-center">
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:-translate-y-0.5 ${
                page === currentPage
                  ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg scale-105'
                  : page === '...'
                  ? 'text-muted-foreground cursor-default'
                  : 'text-foreground hover:text-primary hover:bg-muted shadow-sm hover:shadow-md'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none shadow-sm hover:shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      </div>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Showing page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;