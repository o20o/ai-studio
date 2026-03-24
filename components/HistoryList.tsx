'use client';

import { useEffect, useState } from 'react';
import { supabase, Generation } from '@/lib/supabase';

interface HistoryListProps {
  onSelectGeneration: (generation: Generation) => void;
  refreshTrigger?: number;
}

export default function HistoryList({ onSelectGeneration, refreshTrigger }: HistoryListProps) {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGenerations();
  }, [refreshTrigger]);

  const fetchGenerations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('generations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setGenerations(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching generations:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteGeneration = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this generation?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('generations')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setGenerations(generations.filter((g) => g.id !== id));
    } catch (err: any) {
      console.error('Error deleting generation:', err);
      alert('Failed to delete generation');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
        <p className="text-red-400 text-sm">Error loading history: {error}</p>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No generations yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Generations</h3>
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
        {generations.map((generation) => (
          <div
            key={generation.id}
            onClick={() => onSelectGeneration(generation)}
            className="bg-gray-800 hover:bg-gray-750 rounded-lg p-4 cursor-pointer transition-all border border-gray-700 hover:border-gray-600 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <div className={`mt-1 ${
                  generation.type === 'text' ? 'text-green-400' :
                  generation.type === 'image' ? 'text-blue-400' :
                  'text-purple-400'
                }`}>
                  {getTypeIcon(generation.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">
                    {generation.prompt}
                  </p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-xs text-gray-500">
                      {generation.model}
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(generation.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      generation.status === 'success'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {generation.status}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => deleteGeneration(generation.id, e)}
                className="ml-2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
