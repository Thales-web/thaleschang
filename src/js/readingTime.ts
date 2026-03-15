/**
 * Calculate estimated reading time for content
 * @param content - Raw text content (stripped of HTML/MDX)
 * @returns Reading time in minutes
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
