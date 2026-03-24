import { VertexAI } from '@google-cloud/vertexai';
import config from '../config/env.js';
import logger from '../config/logger.js';

class VertexAIService {
  constructor() {
    this.vertexAI = new VertexAI({
      project: config.GOOGLE_PROJECT_ID,
      location: config.GOOGLE_LOCATION
    });
  }

  async generateText(prompt, modelName = 'gemini-1.5-flash') {
    try {
      logger.info(`Generating text with model: ${modelName}`);

      const generativeModel = this.vertexAI.getGenerativeModel({
        model: modelName
      });

      const request = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      };

      const response = await generativeModel.generateContent(request);
      const textResponse = response.response.candidates[0].content.parts[0].text;

      logger.info('Text generation successful');
      return {
        success: true,
        result: textResponse,
        model: modelName
      };
    } catch (error) {
      logger.error('Error generating text:', error);
      throw new Error(`Text generation failed: ${error.message}`);
    }
  }

  async generateImage(prompt, options = {}) {
    try {
      logger.info('Generating image with Imagen');

      const {
        aspectRatio = '1:1',
        numberOfImages = 1,
        negativePrompt = '',
        model = 'imagegeneration@006'
      } = options;

      const generativeModel = this.vertexAI.preview.getGenerativeModel({
        model: model
      });

      const request = {
        contents: [{
          role: 'user',
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          aspectRatio: aspectRatio,
          numberOfImages: numberOfImages,
          ...(negativePrompt && { negativePrompt })
        }
      };

      const response = await generativeModel.generateContent(request);

      const images = [];
      if (response.response.candidates && response.response.candidates.length > 0) {
        for (const candidate of response.response.candidates) {
          if (candidate.content && candidate.content.parts) {
            for (const part of candidate.content.parts) {
              if (part.inlineData && part.inlineData.data) {
                images.push({
                  data: part.inlineData.data,
                  mimeType: part.inlineData.mimeType
                });
              }
            }
          }
        }
      }

      logger.info(`Image generation successful: ${images.length} images created`);
      return {
        success: true,
        images: images,
        model: model
      };
    } catch (error) {
      logger.error('Error generating image:', error);
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }

  async generateVideo(prompt, options = {}) {
    try {
      logger.info('Generating video with Veo');

      const {
        duration = 5,
        aspectRatio = '16:9',
        model = 'veo-001'
      } = options;

      const generativeModel = this.vertexAI.preview.getGenerativeModel({
        model: model
      });

      const request = {
        contents: [{
          role: 'user',
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          aspectRatio: aspectRatio,
          videoDuration: `${duration}s`
        }
      };

      const response = await generativeModel.generateContent(request);

      let videoData = null;
      let mimeType = null;

      if (response.response.candidates && response.response.candidates.length > 0) {
        const candidate = response.response.candidates[0];
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
              videoData = part.inlineData.data;
              mimeType = part.inlineData.mimeType;
              break;
            }
          }
        }
      }

      if (!videoData) {
        throw new Error('No video data returned from API');
      }

      logger.info('Video generation successful');
      return {
        success: true,
        video: {
          data: videoData,
          mimeType: mimeType
        },
        model: model
      };
    } catch (error) {
      logger.error('Error generating video:', error);
      throw new Error(`Video generation failed: ${error.message}`);
    }
  }
}

export default new VertexAIService();
