import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type InsertShoppingItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { categories } from "@/lib/categories";
import { useToast } from "@/hooks/use-toast";

const quickAddSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  category: z.string().min(1, "Category is required"),
});

type QuickAddFormData = z.infer<typeof quickAddSchema>;

interface QuickAddFormProps {
  onAddItem: (item: InsertShoppingItem) => Promise<void>;
  isLoading: boolean;
}

export function QuickAddForm({ onAddItem, isLoading }: QuickAddFormProps) {
  const { toast } = useToast();
  
  const form = useForm<QuickAddFormData>({
    resolver: zodResolver(quickAddSchema),
    defaultValues: {
      name: "",
      quantity: "",
      category: "",
    },
  });

  const onSubmit = async (data: QuickAddFormData) => {
    try {
      await onAddItem({
        ...data,
        userId: 'user1', // Default user for demo
        completed: false,
      });
      
      form.reset();
      toast({
        title: "Item added",
        description: `${data.name} has been added to your shopping list.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 mb-6">
      <div className="app-card p-4 animated-sparkle">
        <h2 className="text-lg font-semibold text-app-text mb-3 glow-text">Quick Add</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Item name"
                        className="bg-gray-900/50 border-pink-500/30 focus:ring-pink-500 focus:border-pink-500 text-app-text placeholder-app-neutral"
                        style={{
                          backgroundColor: 'hsl(0, 0%, 15%)',
                          boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="w-20">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Qty"
                        className="bg-gray-900/50 border-pink-500/30 focus:ring-pink-500 focus:border-pink-500 text-app-text placeholder-app-neutral"
                        style={{
                          backgroundColor: 'hsl(0, 0%, 15%)',
                          boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-900/50 border-pink-500/30 focus:ring-pink-500 focus:border-pink-500 text-app-text">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-900 border-pink-500/30">
                        {categories.map((category) => (
                          <SelectItem key={category.key} value={category.key} className="text-app-text hover:bg-pink-500/20">
                            <span className="flex items-center">
                              <span className="category-emoji mr-2">{category.emoji}</span>
                              {category.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 font-medium touch-friendly"
                style={{
                  background: 'linear-gradient(135deg, hsl(320, 100%, 60%) 0%, hsl(0, 100%, 50%) 100%)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(255, 20, 147, 0.4)',
                  border: 'none'
                }}
              >
                {isLoading ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
