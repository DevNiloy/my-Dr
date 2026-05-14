import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-sky-500 hover:border-sky-300 disabled:opacity-50 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all shadow-sm active:scale-90"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-black text-sm transition-all active:scale-90 shadow-sm ${
              currentPage === page
                ? 'bg-[#0EA5E9] text-white shadow-sky-100'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-sky-300 hover:text-sky-500'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-sky-500 hover:border-sky-300 disabled:opacity-50 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all shadow-sm active:scale-90"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
