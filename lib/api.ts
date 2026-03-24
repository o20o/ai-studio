import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface GenerateTextRequest {
  prompt: string;
  model?: string;
}

export interface GenerateImageRequest {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  numberOfImages?: number;
  negativePrompt?: string;
  model?: string;
}

export interface GenerateVideoRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  model?: string;
}

export const api = {
  generateText: async (data: GenerateTextRequest) => {
    const response = await axios.post(`${API_BASE_URL}/generate-text`, data);
    return response.data;
  },

  generateImage: async (data: GenerateImageRequest) => {
    const response = await axios.post(`${API_BASE_URL}/generate-image`, data);
    return response.data;
  },

  generateVideo: async (data: GenerateVideoRequest) => {
    const response = await axios.post(`${API_BASE_URL}/generate-video`, data);
    return response.data;
  }
};
