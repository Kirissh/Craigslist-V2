import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/config.js';

// Initialize the Google Generative AI API with your API key
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

// Create a model instance with Gemini Pro
const geminiProModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Create a model instance with Gemini Pro Vision for image analysis
const geminiProVisionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

/**
 * Generate text content using Gemini Pro
 * @param prompt The text prompt to send to the model
 * @returns The generated text response
 */
export async function generateText(prompt: string): Promise<string> {
  try {
    const result = await geminiProModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw error;
  }
}

/**
 * Generate content based on text and images using Gemini Pro Vision
 * @param prompt The text prompt to send to the model
 * @param imageBase64 The base64-encoded image data
 * @returns The generated text response
 */
export async function generateFromImage(prompt: string, imageBase64: string): Promise<string> {
  try {
    // Convert base64 to the format expected by Gemini
    const imageData = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await geminiProVisionModel.generateContent([prompt, imageData]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content from image with Gemini:', error);
    throw error;
  }
}

/**
 * Generate ad content suggestions based on product title and description
 * @param title The product title
 * @param description Brief description if available
 * @param category The product category
 * @returns Suggested title, description, and keywords
 */
export async function generateAdContent(
  title: string, 
  description?: string, 
  category?: string
): Promise<{ title: string; description: string; keywords: string[] }> {
  try {
    const prompt = `Generate a compelling ad listing with the following format:
    
    Title: An attention-grabbing, detailed title for "${title}" 
    Description: A comprehensive, well-structured description with features, benefits, and condition.
    Keywords: A comma-separated list of 5-7 relevant search keywords
    
    ${description ? `Current description: ${description}` : ''}
    ${category ? `Product category: ${category}` : ''}
    
    The ad should be professional, persuasive, and highlight the most important selling points.`;

    const result = await geminiProModel.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    // Parse the response to extract title, description, and keywords
    const titleMatch = content.match(/Title: (.*?)(?=\n|$)/);
    const descriptionMatch = content.match(/Description: ([\s\S]*?)(?=\nKeywords:|$)/);
    const keywordsMatch = content.match(/Keywords: (.*?)(?=\n|$)/);

    return {
      title: titleMatch ? titleMatch[1].trim() : title,
      description: descriptionMatch ? descriptionMatch[1].trim() : '',
      keywords: keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [],
    };
  } catch (error) {
    console.error('Error generating ad content with Gemini:', error);
    throw error;
  }
}

export default {
  generateText,
  generateFromImage,
  generateAdContent
}; 