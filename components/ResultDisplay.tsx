'use client';

interface ResultDisplayProps {
  type: 'text' | 'image' | 'video' | null;
  result: any;
}

export default function ResultDisplay({ type, result }: ResultDisplayProps) {
  if (!result || !type) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-4 text-gray-500 text-sm">
            Your generated content will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        Generated {type.charAt(0).toUpperCase() + type.slice(1)}
      </h3>

      {type === 'text' && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-100 whitespace-pre-wrap leading-relaxed">
            {result.result}
          </p>
        </div>
      )}

      {type === 'image' && result.images && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.images.map((image: any, index: number) => (
            <div key={index} className="relative group">
              <img
                src={`data:${image.mimeType};base64,${image.data}`}
                alt={`Generated image ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <a
                href={`data:${image.mimeType};base64,${image.data}`}
                download={`generated-image-${index + 1}.png`}
                className="absolute top-2 right-2 bg-gray-900/90 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}

      {type === 'video' && result.video && (
        <div className="relative">
          <video
            controls
            className="w-full rounded-lg shadow-lg"
            src={`data:${result.video.mimeType};base64,${result.video.data}`}
          >
            Your browser does not support the video tag.
          </video>
          <a
            href={`data:${result.video.mimeType};base64,${result.video.data}`}
            download="generated-video.mp4"
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Video
          </a>
        </div>
      )}

      {result.model && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Model: <span className="text-gray-400">{result.model}</span>
          </p>
        </div>
      )}
    </div>
  );
}
