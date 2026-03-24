import { z } from 'zod';
import logger from '../config/logger.js';

const generateTextSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(5000, 'Prompt too long'),
  model: z.string().optional().default('gemini-1.5-flash')
});

const generateImageSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt too long'),
  aspectRatio: z.enum(['1:1', '16:9', '9:16', '4:3', '3:4']).optional().default('1:1'),
  numberOfImages: z.number().min(1).max(4).optional().default(1),
  negativePrompt: z.string().optional(),
  model: z.string().optional().default('imagegeneration@006')
});

const generateVideoSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt too long'),
  duration: z.number().min(2).max(10).optional().default(5),
  aspectRatio: z.enum(['16:9', '9:16', '1:1']).optional().default('16:9'),
  model: z.string().optional().default('veo-001')
});

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedBody = validated;
      next();
    } catch (error) {
      logger.error('Validation error:', error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
      }

      return res.status(400).json({
        success: false,
        error: 'Invalid request'
      });
    }
  };
};

export const schemas = {
  generateText: generateTextSchema,
  generateImage: generateImageSchema,
  generateVideo: generateVideoSchema
};
