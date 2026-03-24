'use client';

import { useState } from 'react';
import GenerationForm, { GenerationFormData } from '@/components/GenerationForm';
import ResultDisplay from '@/components/ResultDisplay';
import HistoryList from '@/components/HistoryList';
import { api } from '@/lib/api';
import { supabase, Generation } from '@/lib/supabase';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [currentType, setCurrentType] = useState<'text' | 'image' | 'video' | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleGenerate = async (data: GenerationFormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;

      if (data.type === 'text') {
        response = await api.generateText({
          prompt: data.prompt,
          model: data.model
        });
      } else if (data.type === 'image') {
        response = await api.generateImage({
          prompt: data.prompt,
          model: data.model,
          aspectRatio: data.options.aspectRatio as any,
          numberOfImages: data.options.numberOfImages,
          negativePrompt: data.options.negativePrompt
        });
      } else if (data.type === 'video') {
        response = await api.generateVideo({
          prompt: data.prompt,
          model: data.model,
          duration: data.options.duration,
          aspectRatio: data.options.aspectRatio as any
        });
      }

      if (response.success) {
        setResult(response);
        setCurrentType(data.type);

        await supabase.from('generations').insert({
          type: data.type,
          prompt: data.prompt,
          model: data.model,
          result_data: response,
          options: data.options,
          status: 'success'
        });

        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Generation failed';
      setError(errorMessage);

      await supabase.from('generations').insert({
        type: data.type,
        prompt: data.prompt,
        model: data.model,
        result_data: {},
        options: data.options,
        status: 'failed',
        error_message: errorMessage
      });

      setRefreshTrigger((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGeneration = (generation: Generation) => {
    setCurrentType(generation.type);
    setResult(generation.result_data);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Content Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Generate text, images, and videos using Google Gemini and Vertex AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Create New</h2>
              <GenerationForm onGenerate={handleGenerate} isLoading={isLoading} />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-red-400 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-red-400 font-semibold">Error</h3>
                    <p className="text-red-300 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                  <p className="text-gray-400 text-lg">Generating your content...</p>
                  <p className="text-gray-500 text-sm">This may take a few moments</p>
                </div>
              </div>
            )}

            {!isLoading && (
              <ResultDisplay type={currentType} result={result} />
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl sticky top-8">
              <HistoryList
                onSelectGeneration={handleSelectGeneration}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
