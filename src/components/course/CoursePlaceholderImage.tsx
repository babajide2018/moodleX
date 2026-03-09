'use client';

import {
  Code,
  Calculator,
  BookOpen,
  Palette,
  Dna,
  Briefcase,
  GraduationCap,
  FlaskConical,
  Cog,
  Scroll,
  Music,
  Globe,
} from 'lucide-react';
import { getCourseBackground, getCategoryIcon, getCoursePattern, type CoursePattern } from '@/lib/course-colors';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  code: Code,
  calculator: Calculator,
  book: BookOpen,
  palette: Palette,
  dna: Dna,
  briefcase: Briefcase,
  graduation: GraduationCap,
  flask: FlaskConical,
  cog: Cog,
  scroll: Scroll,
  music: Music,
  globe: Globe,
};

function PatternOverlay({ pattern }: { pattern: CoursePattern }) {
  const opacity = 'opacity-[0.08]';
  switch (pattern) {
    case 'circles':
      return (
        <svg className={`absolute inset-0 w-full h-full ${opacity}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="p-circles" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="8" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p-circles)" />
        </svg>
      );
    case 'dots':
      return (
        <svg className={`absolute inset-0 w-full h-full ${opacity}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="p-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p-dots)" />
        </svg>
      );
    case 'diagonal':
      return (
        <svg className={`absolute inset-0 w-full h-full ${opacity}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="p-diag" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="16" stroke="white" strokeWidth="4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p-diag)" />
        </svg>
      );
    case 'waves':
      return (
        <svg className={`absolute inset-0 w-full h-full ${opacity}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="p-waves" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M0 15 Q15 0 30 15 Q45 30 60 15" fill="none" stroke="white" strokeWidth="3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p-waves)" />
        </svg>
      );
    case 'grid':
      return (
        <svg className={`absolute inset-0 w-full h-full ${opacity}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="p-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p-grid)" />
        </svg>
      );
    case 'cross':
      return (
        <svg className={`absolute inset-0 w-full h-full ${opacity}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="p-cross" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M12 4v16M4 12h16" stroke="white" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#p-cross)" />
        </svg>
      );
  }
}

interface CoursePlaceholderImageProps {
  courseId: string;
  category?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CoursePlaceholderImage({
  courseId,
  category = '',
  className = '',
  size = 'md',
}: CoursePlaceholderImageProps) {
  const background = getCourseBackground(courseId);
  const pattern = getCoursePattern(courseId);
  const iconKey = getCategoryIcon(category);
  const Icon = iconMap[iconKey] || GraduationCap;

  const iconSize = size === 'sm' ? 24 : size === 'md' ? 36 : 48;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background }}
    >
      <PatternOverlay pattern={pattern} />
      {/* Category icon centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/15 rounded-full p-3 backdrop-blur-[1px]">
          <Icon size={iconSize} className="text-white drop-shadow-sm" />
        </div>
      </div>
      {/* Bottom fade for text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
}
