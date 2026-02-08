export const getAssetPath = (path: string) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Get the base path from environment, or default to empty string
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // Return the combined path
  // If basePath is empty (dev), it returns "/sounds/bomb.wav"
  // If basePath is "/my-app" (prod), it returns "/my-app/sounds/bomb.wav"
  return `${basePath}/${cleanPath}`;
};