import { Client } from '@gradio/client';

export const generate3DModel = async (imageDataUrl: string): Promise<string | null> => {
  try {
    // 1. Convert data URL to Blob for the Gradio client
    const response = await fetch(imageDataUrl);
    const imageBlob = await response.blob();

    // 2. Connect to the free TripoSR Hugging Face Space
    try {
      const client = await Client.connect('stabilityai/TripoSR');

      const result = await client.predict('/run', {
        input_image: imageBlob,
      });

      const glbData = result.data;

      // If the result is a file object with a URL:
      if (glbData && typeof glbData === 'object' && 'url' in (glbData as Record<string, unknown>)) {
        return (glbData as { url: string }).url;
      }

      // If glbData is an array of outputs
      if (Array.isArray(glbData) && glbData.length > 0) {
        const first = glbData[0];
        if (typeof first === 'string') return first;
        if (first && typeof first === 'object' && 'url' in first) return first.url;
      }

      // If the result is a direct URL string:
      if (typeof glbData === 'string') {
        return glbData;
      }
    } catch (gradioErr) {
      console.warn('TripoSR HuggingFace connection notice, checking alternative endpoint:', gradioErr);
    }

    // 3. Check server-side 3D endpoint
    try {
      const serverRes = await fetch('/api/generate-3d-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl }),
      });
      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data.modelUrl) return data.modelUrl;
      }
    } catch (serverErr) {
      console.warn('Server 3D fallback notice:', serverErr);
    }

    // 4. Return null or procedural fallback flag so interactive Three.js generator renders 3D architecture
    return 'procedural-architectural-mesh';
  } catch (error) {
    console.error('3D model generation failed:', error);
    return 'procedural-architectural-mesh';
  }
};
