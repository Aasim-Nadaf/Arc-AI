import puter from '@heyputer/puter.js';
import { ROOMIFY_RENDER_PROMPT } from './constants';
import { fetchAsDataUrl } from './utils';

export const generate3DView = async ({ sourceImage }: { sourceImage: string }): Promise<{ renderedImage: string | null; error?: string }> => {
  try {
    const dataUrl = sourceImage.startsWith('data:')
      ? sourceImage
      : await fetchAsDataUrl(sourceImage);

    const parts = dataUrl.split(',');
    const base64Data = parts[1] || '';
    const mimeMatch = parts[0]?.match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    // 1. Try Puter.js SDK client-side if available
    try {
      if (puter && puter.ai && typeof puter.ai.txt2img === 'function') {
        const response = await puter.ai.txt2img(ROOMIFY_RENDER_PROMPT, {
          provider: 'gemini',
          model: 'gemini-2.5-flash-image-preview',
          input_image: base64Data,
          input_image_mime_type: mimeType,
          ratio: { w: 1024, h: 1024 },
        });

        const rawImageUrl = (response as HTMLImageElement)?.src ?? (typeof response === 'string' ? response : null);
        if (rawImageUrl) {
          const renderedImage = rawImageUrl.startsWith('data:')
            ? rawImageUrl
            : await fetchAsDataUrl(rawImageUrl);
          return { renderedImage };
        }
      }
    } catch (puterErr) {
      console.info('Puter txt2img note (trying backend proxy):', puterErr);
    }

    // 2. Call Full-Stack Server-side Gemini endpoint
    const serverRes = await fetch('/api/render-floorplan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceImage: dataUrl,
        prompt: ROOMIFY_RENDER_PROMPT
      }),
    });

    if (serverRes.ok) {
      const serverData = await serverRes.json();
      if (serverData.renderedImage) {
        return { renderedImage: serverData.renderedImage };
      }
    }

    return { renderedImage: null, error: 'Could not generate render. Please try again.' };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('generate3DView error:', err);
    return { renderedImage: null, error: errMsg };
  }
};
