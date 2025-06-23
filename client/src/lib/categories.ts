export interface Category {
  key: string;
  name: string;
  emoji: string;
}

export const categories: Category[] = [
  { key: 'fruits', name: 'Fruits', emoji: '🍎' },
  { key: 'dairy', name: 'Dairy', emoji: '🥛' },
  { key: 'meat', name: 'Meat', emoji: '🥩' },
  { key: 'vegetables', name: 'Vegetables', emoji: '🥕' },
  { key: 'pantry', name: 'Pantry', emoji: '🥫' },
  { key: 'frozen', name: 'Frozen', emoji: '🧊' },
  { key: 'bakery', name: 'Bakery', emoji: '🍞' },
  { key: 'household', name: 'Household', emoji: '🧽' },
];

export const getCategoryByKey = (key: string): Category | undefined => {
  return categories.find(category => category.key === key);
};

export const getCategoryEmoji = (key: string): string => {
  const category = getCategoryByKey(key);
  return category?.emoji || '📦';
};
