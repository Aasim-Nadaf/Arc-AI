import puter from '@heyputer/puter.js';

export const uploadImageToPuter = async (imageDataUrl: string, filename = 'floorplan.png'): Promise<string | null> => {
  try {
    if (puter && puter.fs && typeof puter.fs.write === 'function') {
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type });

      const uploaded = await puter.fs.write(`perspective_ai/${Date.now()}_${filename}`, file);
      if (uploaded && typeof uploaded === 'object' && 'url' in uploaded) {
        return (uploaded as { url: string }).url;
      }
    }
  } catch (err) {
    console.info('Puter hosting notice (using data URL locally):', err);
  }
  return imageDataUrl;
};
