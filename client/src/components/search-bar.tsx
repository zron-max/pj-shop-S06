import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-app-secondary" />
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-pink-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-app-text placeholder-app-neutral neon-border"
          placeholder="Search items..."
          style={{
            backgroundColor: 'hsl(0, 0%, 15%)',
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
        />
      </div>
    </div>
  );
}
