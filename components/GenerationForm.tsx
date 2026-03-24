'use client';

import { useState } from 'react';

interface GenerationFormProps {
  onGenerate: (data: GenerationFormData) => void;
  isLoading: boolean;
}

export interface GenerationFormData {
  type: 'text' | 'image' | 'video';
  prompt: string;
  model: string;
  options: {
    aspectRatio?: string;
    duration?: number;
    numberOfImages?: number;
    negativePrompt?: string;
  };
}

const modelOptions = {
  text: [
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-1.0-pro', label: 'Gemini 1.0 Pro' }
  ],
  image: [
    { value: 'imagegeneration@006', label: 'Imagen 3' },
    { value: 'imagegeneration@005', label: 'Imagen 2' }
  ],
  video: [
    { value: 'veo-001', label: 'Veo 1' }
  ]
};

export default function GenerationForm({ onGenerate, isLoading }: GenerationFormProps) {
  const [type, setType] = useState<'text' | 'image' | 'video'>('text');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState(modelOptions.text[0].value);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [duration, setDuration] = useState(5);
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [negativePrompt, setNegativePrompt] = useState('');

  const handleTypeChange = (newType: 'text' | 'image' | 'video') => {
    setType(newType);
    setModel(modelOptions[newType][0].value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: GenerationFormData = {
      type,
      prompt,
      model,
      options: {}
    };

    if (type === 'image') {
      data.options.aspectRatio = aspectRatio;
      data.options.numberOfImages = numberOfImages;
      if (negativePrompt) {
        data.options.negativePrompt = negativePrompt;
      }
    } else if (type === 'video') {
      data.options.aspectRatio = aspectRatio;
      data.options.duration = duration;
    }

    onGenerate(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Generation Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['text', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                type === t
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
          Model
        </label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {modelOptions[type].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Enter your ${type} generation prompt...`}
          required
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {type === 'image' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-2">
                Aspect Ratio
              </label>
              <select
                id="aspectRatio"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1:1">1:1 (Square)</option>
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Portrait)</option>
                <option value="4:3">4:3</option>
                <option value="3:4">3:4</option>
              </select>
            </div>

            <div>
              <label htmlFor="numberOfImages" className="block text-sm font-medium text-gray-300 mb-2">
                Number of Images
              </label>
              <select
                id="numberOfImages"
                value={numberOfImages}
                onChange={(e) => setNumberOfImages(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-300 mb-2">
              Negative Prompt (Optional)
            </label>
            <input
              type="text"
              id="negativePrompt"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="What to avoid in the image..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </>
      )}

      {type === 'video' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="videoAspectRatio" className="block text-sm font-medium text-gray-300 mb-2">
              Aspect Ratio
            </label>
            <select
              id="videoAspectRatio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="16:9">16:9 (Landscape)</option>
              <option value="9:16">9:16 (Portrait)</option>
              <option value="1:1">1:1 (Square)</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
              Duration (seconds)
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={2}>2s</option>
              <option value={5}>5s</option>
              <option value={8}>8s</option>
              <option value={10}>10s</option>
            </select>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : (
          `Generate ${type.charAt(0).toUpperCase() + type.slice(1)}`
        )}
      </button>
    </form>
  );
}
