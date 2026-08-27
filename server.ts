import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser middleware
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Lazy Google GenAI initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Perspective.ai Engine',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: Date.now(),
  });
});

// 2. Render Floor Plan (2D Blueprint -> Photorealistic 2D Render)
app.post('/api/render-floorplan', async (req, res) => {
  try {
    const { sourceImage, prompt } = req.body;
    if (!sourceImage) {
      return res.status(400).json({ error: 'sourceImage is required' });
    }

    const ai = getGenAI();
    if (ai) {
      try {
        const parts = sourceImage.split(',');
        const base64Data = parts[1] || '';
        const mimeMatch = parts[0]?.match(/:(.*?);/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

        const imagePart = {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        };

        const textPart = {
          text: prompt || 'Convert 2D floor plan to photorealistic top-down 3D render. Remove all text labels.',
        };

        // Try gemini image generation/editing model
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: { parts: [imagePart, textPart] },
          config: {
            imageConfig: {
              aspectRatio: '1:1',
              imageSize: '1K',
            },
          },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData && part.inlineData.data) {
            const resultUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            return res.json({ renderedImage: resultUrl });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini 3.1 image model error, falling back:', geminiErr);
      }
    }

    return res.json({ renderedImage: null, message: 'Server fallback' });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('Server render-floorplan error:', err);
    res.status(500).json({ error: errMsg });
  }
});

// 3. Generate 3D Model Proxy
app.post('/api/generate-3d-model', async (req, res) => {
  try {
    const { image } = req.body;
    // Returns procedural 3D architectural mesh indicator
    res.json({
      modelUrl: 'procedural-architectural-mesh',
      status: 'ready',
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errMsg });
  }
});

async function startServer() {
  // Vite dev middleware vs production static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Perspective.ai server running on http://localhost:${PORT}`);
  });
}

startServer();
