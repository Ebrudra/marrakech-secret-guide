import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  filters: {
    priceRange: FilterOption[];
    features: FilterOption[];
    openingHours: FilterOption[];
  };
  activeFilters: string[];
  onFilterChange: (filterId: string) => void;
  onClearAll: () => void;
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    filters: "Filtres",
    priceRange: "Gamme de prix",
    features: "Caractéristiques",
    openingHours: "Horaires",
    clearAll: "Tout effacer",
    applyFilters: "Appliquer les filtres"
  },
  en: {
    filters: "Filters",
    priceRange: "Price Range",
    features: "Features",
    openingHours: "Opening Hours",
    clearAll: "Clear All",
    applyFilters: "Apply Filters"
  }
};

export default function FilterBar({ filters, activeFilters, onFilterChange, onClearAll, language }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[language];

  const renderFilterGroup = (title: string, options: FilterOption[]) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-foreground">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <Button
            key={option.id}
            variant={activeFilters.includes(option.id) ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(option.id)}
            className="w-full justify-between text-left"
          >
            <span>{option.label}</span>
            {option.count && (
              <Badge variant="secondary" className="ml-2">
                {option.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.slice(0, 2).map((filterId) => {
            const allOptions = [...filters.priceRange, ...filters.features, ...filters.openingHours];
            const option = allOptions.find(opt => opt.id === filterId);
            return option ? (
              <Badge key={filterId} variant="secondary" className="flex items-center gap-1">
                {option.label}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilterChange(filterId)}
                  className="h-3 w-3 p-0 hover:bg-transparent"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            ) : null;
          })}
          {activeFilters.length > 2 && (
            <Badge variant="outline">+{activeFilters.length - 2}</Badge>
          )}
        </div>
      )}

      {/* Filter Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t.filters}
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              {t.filters}
              {activeFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={onClearAll}>
                  {t.clearAll}
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {renderFilterGroup(t.priceRange, filters.priceRange)}
            {renderFilterGroup(t.features, filters.features)}
            {renderFilterGroup(t.openingHours, filters.openingHours)}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}