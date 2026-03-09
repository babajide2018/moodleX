/**
 * Course color/gradient palette and category-to-icon mapping.
 * Shared across CourseOverview (dashboard) and home page.
 */

// Gradient pairs: [from, to]
const courseGradients: [string, string][] = [
  ['#4e6e9c', '#6a8fc4'],   // steel blue
  ['#57a89a', '#7cc4b8'],   // teal
  ['#7b62a8', '#9b84c4'],   // purple
  ['#ce5f5f', '#e08585'],   // coral
  ['#e8a54b', '#f0c078'],   // amber
  ['#63a563', '#88c488'],   // green
  ['#8e6e4e', '#b09070'],   // brown
  ['#5c8a8a', '#7eadad'],   // dark teal
  ['#c0607e', '#d4889e'],   // rose
  ['#5b7fbf', '#7fa0d8'],   // blue
];

// Decorative SVG patterns for card backgrounds (small repeatable shapes)
const coursePatterns = [
  'circles',
  'dots',
  'diagonal',
  'waves',
  'grid',
  'cross',
] as const;

export type CoursePattern = typeof coursePatterns[number];

function hashString(str: string): number {
  return str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function getCourseGradient(id: string): { from: string; to: string } {
  const idx = hashString(id) % courseGradients.length;
  return { from: courseGradients[idx][0], to: courseGradients[idx][1] };
}

export function getCourseColor(id: string): string {
  return getCourseGradient(id).from;
}

export function getCoursePattern(id: string): CoursePattern {
  const idx = hashString(id) % coursePatterns.length;
  return coursePatterns[idx];
}

/**
 * Returns a CSS background string with a gradient + subtle SVG pattern overlay
 */
export function getCourseBackground(id: string): string {
  const { from, to } = getCourseGradient(id);
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}

/**
 * Map category names to icon identifiers for richer visuals
 */
const categoryIcons: Record<string, string> = {
  'computer science': 'code',
  'mathematics': 'calculator',
  'english & communications': 'book',
  'art & design': 'palette',
  'biological sciences': 'dna',
  'business & management': 'briefcase',
  'miscellaneous': 'graduation',
  'science': 'flask',
  'engineering': 'cog',
  'history': 'scroll',
  'music': 'music',
  'languages': 'globe',
};

export function getCategoryIcon(category: string): string {
  const lower = category.toLowerCase();
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (lower.includes(key)) return icon;
  }
  return 'graduation';
}
