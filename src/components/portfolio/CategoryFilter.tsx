import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

export type FilterCategory = 'all' | 'mobile' | 'ai' | 'frontend' | 'fullstack' | 'wordpress';

interface CategoryFilterProps {
  activeCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
  counts?: Partial<Record<FilterCategory, number>>;
}

const CATEGORIES: { label: string; value: FilterCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'AI', value: 'ai' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Full-stack', value: 'fullstack' },
  { label: 'WordPress', value: 'wordpress' },
];

export function CategoryFilter({ activeCategory, onCategoryChange, counts }: CategoryFilterProps) {
  const reduce = useReducedMotion();
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter projects">
      {CATEGORIES.map((cat) => {
        const active = activeCategory === cat.value;
        return (
          <button
            key={cat.value}
            role="tab"
            aria-selected={active}
            onClick={() => onCategoryChange(cat.value)}
            className={cn(
              'relative isolate shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors',
              active ? 'border-foreground text-background' : 'border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground'
            )}
          >
            {active && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-foreground"
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            {cat.label}
            {counts?.[cat.value] !== undefined && <sup className="ml-1 text-[10px] opacity-60">{counts[cat.value]}</sup>}
          </button>
        );
      })}
    </div>
  );
}
