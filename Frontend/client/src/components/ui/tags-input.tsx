// components/ui/tags-input.tsx
'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function TagsInput({ value = [], onChange, options, placeholder = "Select tags...", className }: TagsInputProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [width, setWidth] = React.useState<number>(0);

  React.useEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  const selectedValues = value.map(v => options.find(o => o.value === v)).filter(Boolean);

  const handleSelect = (val: string) => {
    if (!value.includes(val)) {
      onChange([...value, val]);
    }
    setOpen(false);
    setInputValue("");
  };

  const handleRemove = (val: string) => {
    onChange(value.filter(v => v !== val));
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
    !value.includes(option.value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto min-h-10 p-2", className)}
        >
          <div className="flex flex-wrap gap-1.5 items-center">
            {selectedValues.length > 0 ? (
              selectedValues.map((option) => (
                <Badge key={option!.value} variant="secondary" className="gap-1 pr-1">
                  {option!.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(option!.value);
                    }}
                  />
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0" style={{ width: width || '100%' }}>
        <Command>
          <CommandInput
            placeholder="Search tags..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}