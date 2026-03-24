import express from 'express';
import vertexAIService from '../services/vertexAI.service.js';
import { validateRequest, schemas } from '../middleware/validation.js';
import { generationLimiter } from '../middleware/rateLimiter.js';
import logger from '../config/logger.js';

const router = express.Router();

router.post('/generate-text', generationLimiter, validateRequest(schemas.generateText), async (req, res, next) => {
  try {
    const { prompt, model } = req.validatedBody;

    logger.info('Text generation request received');

    const result = await vertexAIService.generateText(prompt, model);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/generate-image', generationLimiter, validateRequest(schemas.generateImage), async (req, res, next) => {
  try {
    const { prompt, aspectRatio, numberOfImages, negativePrompt, model } = req.validatedBody;

    logger.info('Image generation request received');

    const result = await vertexAIService.generateImage(prompt, {
      aspectRatio,
      numberOfImages,
      negativePrompt,
      model
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/generate-video', generationLimiter, validateRequest(schemas.generateVideo), async (req, res, next) => {
  try {
    const { prompt, duration, aspectRatio, model } = req.validatedBody;

    logger.info('Video generation request received');

    const result = await vertexAIService.generateVideo(prompt, {
      duration,
      aspectRatio,
      model
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
