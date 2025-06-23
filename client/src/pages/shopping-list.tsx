import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { type ShoppingItem, type InsertShoppingItem } from "@shared/schema";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { QuickAddForm } from "@/components/quick-add-form";
import { CategorySection } from "@/components/category-section";
import { StatsSection } from "@/components/stats-section";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { categories } from "@/lib/categories";

export default function ShoppingList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Fetch shopping items
  const { data: items = [], isLoading } = useQuery<ShoppingItem[]>({
    queryKey: ["/api/shopping-items"],
  });

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async (item: InsertShoppingItem) => {
      const response = await apiRequest("POST", "/api/shopping-items", item);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-items"] });
    },
  });

  // Toggle item completion
  const toggleItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/shopping-items/${id}/toggle`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-items"] });
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/shopping-items/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-items"] });
    },
  });

  // Reset list mutation
  const resetListMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PATCH", "/api/shopping-items/reset?userId=user1");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-items"] });
    },
  });

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, ShoppingItem[]> = {};
    
    filteredItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    
    return grouped;
  }, [filteredItems]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalItems = items.length;
    const completedItems = items.filter(item => item.completed).length;
    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    return {
      totalItems,
      completedItems,
      progressPercentage,
      progressText: `${progressPercentage}% Complete`,
    };
  }, [items]);

  const handleAddItem = async (item: InsertShoppingItem) => {
    await addItemMutation.mutateAsync(item);
  };

  const handleToggleItem = async (id: number) => {
    await toggleItemMutation.mutateAsync(id);
  };

  const handleDeleteItem = async (id: number) => {
    await deleteItemMutation.mutateAsync(id);
  };

  const handleResetList = async () => {
    await resetListMutation.mutateAsync();
  };

  const toggleCategoryCollapse = (categoryKey: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(categoryKey)) {
      newCollapsed.delete(categoryKey);
    } else {
      newCollapsed.add(categoryKey);
    }
    setCollapsedCategories(newCollapsed);
  };

  const scrollToQuickAdd = () => {
    const quickAddElement = document.getElementById('quick-add-section');
    if (quickAddElement) {
      quickAddElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header syncStatus="syncing" />
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent"></div>
            <span className="ml-3 text-app-text font-medium glow-text">Loading your shopping list...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header syncStatus="synced" onResetList={handleResetList} />
      
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
      />
      
      <div id="quick-add-section">
        <QuickAddForm 
          onAddItem={handleAddItem}
          isLoading={addItemMutation.isPending}
        />
      </div>

      <div className="max-w-md mx-auto px-4 pb-20">
        {/* Category Sections */}
        {categories.map(category => {
          const categoryItems = itemsByCategory[category.key] || [];
          if (categoryItems.length === 0 && !searchQuery) return null;
          
          return (
            <CategorySection
              key={category.key}
              category={category}
              items={categoryItems}
              isCollapsed={collapsedCategories.has(category.key)}
              onToggleCollapse={() => toggleCategoryCollapse(category.key)}
              onToggleItem={handleToggleItem}
              onDeleteItem={handleDeleteItem}
              isLoading={toggleItemMutation.isPending || deleteItemMutation.isPending}
            />
          );
        })}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="app-card p-8 text-center animated-sparkle">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-lg font-semibold text-app-text mb-2 glow-text">
              {searchQuery ? 'No items found' : 'Your shopping list is empty'}
            </h3>
            <p className="text-app-neutral mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Add your first item to get started'
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={scrollToQuickAdd}
                className="text-white font-medium"
                style={{
                  background: 'linear-gradient(135deg, hsl(320, 100%, 60%) 0%, hsl(0, 100%, 50%) 100%)',
                  boxShadow: '0 4px 15px rgba(255, 20, 147, 0.4)',
                  border: 'none'
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            )}
          </div>
        )}

        {/* Stats Section */}
        {items.length > 0 && (
          <StatsSection stats={stats} />
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={scrollToQuickAdd}
        className="floating-button touch-friendly"
        aria-label="Add new item"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
