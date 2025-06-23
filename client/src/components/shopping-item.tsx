import { useState, useEffect } from "react";
import { type ShoppingItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShoppingItemProps {
  item: ShoppingItem;
  onToggle: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

export function ShoppingItemComponent({ item, onToggle, onDelete, isLoading }: ShoppingItemProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    onToggle();
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div className={cn(
      "app-card p-4 flex items-center space-x-3 transition-all duration-300",
      item.completed && "item-completed",
      isAnimating && (item.completed ? "item-reset" : "item-completed")
    )}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          "checkbox-button touch-friendly p-0",
          item.completed ? "checked" : "unchecked"
        )}
        aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {item.completed && <Check className="w-3 h-3 text-white" />}
      </Button>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 
            className={cn(
              "font-medium transition-all duration-300",
              item.completed
                ? "text-app-neutral line-through opacity-60"
                : "text-app-text"
            )}
          >
            {item.name}
          </h4>
          <span className={cn(
            "text-sm ml-2 transition-all duration-300",
            item.completed ? "text-app-neutral opacity-60" : "text-app-secondary"
          )}>
            {item.quantity}
          </span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        disabled={isLoading}
        className="text-app-neutral hover:text-red-500 hover:glow-red transition-all duration-300 p-2 touch-friendly"
        aria-label="Delete item"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
