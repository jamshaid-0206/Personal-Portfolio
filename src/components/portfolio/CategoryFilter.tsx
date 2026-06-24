import { cn } from '../../lib/utils';

export type FilterCategory = 'all' | 'mobile' | 'ai' | 'frontend' | 'fullstack';

interface CategoryFilterProps {
  activeCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
}

const CATEGORIES: { label: string; value: FilterCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'AI', value: 'ai' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Fullstack', value: 'fullstack' },
];

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="sticky top-20 z-30 py-4 mb-12 flex justify-center bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-1.5 rounded-full border border-border bg-card/50 max-w-full">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs md:text-sm font-light tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer select-none border",
                isActive
                  ? "bg-foreground text-background border-foreground font-medium"
                  : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:border-border"
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
