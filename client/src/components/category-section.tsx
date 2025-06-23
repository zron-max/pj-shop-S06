import { type ShoppingItem } from "@shared/schema";
import { ShoppingItemComponent } from "./shopping-item";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Category {
  key: string;
  name: string;
  emoji: string;
}

interface CategorySectionProps {
  category: Category;
  items: ShoppingItem[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onToggleItem: (id: number) => void;
  onDeleteItem: (id: number) => void;
  isLoading: boolean;
}

export function CategorySection({
  category,
  items,
  isCollapsed,
  onToggleCollapse,
  onToggleItem,
  onDeleteItem,
  isLoading,
}: CategorySectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-app-text flex items-center space-x-2">
          <span className="category-emoji">{category.emoji}</span>
          <span className="glow-text">{category.name}</span>
          <Badge 
            variant="secondary" 
            className="text-white text-xs px-2 py-1"
            style={{
              background: 'linear-gradient(135deg, hsl(320, 100%, 60%) 0%, hsl(0, 100%, 50%) 100%)',
              boxShadow: '0 0 10px rgba(255, 20, 147, 0.4)'
            }}
          >
            {items.length}
          </Badge>
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="text-app-neutral hover:text-app-secondary transition-colors p-1"
          aria-label={isCollapsed ? 'Expand category' : 'Collapse category'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="space-y-2">
          {items.map((item) => (
            <ShoppingItemComponent
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(item.id)}
              onDelete={() => onDeleteItem(item.id)}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
