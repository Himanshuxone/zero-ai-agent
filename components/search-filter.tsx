'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFilter {
  region?: string;
  assetClass?: string;
  minPrice?: number;
  maxPrice?: number;
  minVolume?: number;
  searchTerm?: string;
  favorites?: boolean;
}

interface SearchFilterProps {
  onFilter: (filters: SearchFilter) => void;
  tickers?: Array<{ symbol: string; name: string }>;
}

export function AdvancedSearchFilter({ onFilter, tickers = [] }: SearchFilterProps) {
  const [filters, setFilters] = React.useState<SearchFilter>({});
  const [searchTerm, setSearchTerm] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<typeof tickers>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length > 0) {
        const filtered = tickers.filter(t =>
          t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, tickers]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const newFilters = { ...filters, searchTerm: term };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleFilterChange = (key: keyof SearchFilter, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSuggestions([]);
    onFilter({});
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center gap-2 rounded-lg bg-background/50 border border-border px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ticker or company..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchTerm && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder-muted-foreground"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch('')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-background border border-border shadow-lg z-10"
            >
              {suggestions.map((ticker) => (
                <button
                  key={ticker.symbol}
                  onClick={() => handleSearch(ticker.symbol)}
                  className="w-full text-left px-3 py-2 hover:bg-primary/10 transition-colors text-sm"
                >
                  <p className="font-semibold text-foreground">{ticker.symbol}</p>
                  <p className="text-xs text-muted-foreground">{ticker.name}</p>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <select
          value={filters.region || ''}
          onChange={(e) => handleFilterChange('region', e.target.value || undefined)}
          className="text-xs rounded-lg bg-background/50 border border-border px-2 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Regions</option>
          <option value="north-america">North America</option>
          <option value="europe">Europe</option>
          <option value="asia">Asia</option>
          <option value="global">Global</option>
        </select>

        <select
          value={filters.assetClass || ''}
          onChange={(e) => handleFilterChange('assetClass', e.target.value || undefined)}
          className="text-xs rounded-lg bg-background/50 border border-border px-2 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Assets</option>
          <option value="equity">Equity</option>
          <option value="forex">Forex</option>
          <option value="crypto">Crypto</option>
          <option value="commodity">Commodity</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice || ''}
          onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
          className="text-xs rounded-lg bg-background/50 border border-border px-2 py-2 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice || ''}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
          className="text-xs rounded-lg bg-background/50 border border-border px-2 py-2 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Active Filters Display & Clear */}
      {Object.values(filters).some(v => v !== undefined && v !== '') && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            {Object.values(filters).filter(v => v !== undefined && v !== '').length} filter(s) active
          </div>
          <button
            onClick={clearFilters}
            className="text-xs px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

export function useSearchFilters() {
  const [filters, setFilters] = React.useState<SearchFilter>({});

  return { filters, setFilters };
}
