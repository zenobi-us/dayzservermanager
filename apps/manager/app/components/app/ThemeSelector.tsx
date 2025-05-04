import { ComputerIcon, Moon, Sun } from 'lucide-react';

import { Button } from '../ui/button';

import { Theme } from './ThemeSystem';

export function ThemeSelector() {
  const theme = Theme.useTheme();
  const handleToggle = () => {
    const themeName = theme.theme || 'system';
    const currentIndex = theme.themes.indexOf(themeName);
    const nextTheme =
      currentIndex >= theme.themes.length - 1
        ? theme.themes[0]
        : theme.themes[currentIndex + 1];

    theme.setTheme(nextTheme);
  };
  console.log('ThemeSelector', theme.theme);
  return (
    <Button
      variant="ghost"
      inverted
      size="icon"
      onClick={handleToggle}
      className="cursor-pointer"
    >
      {theme.theme !== 'system' && (
        <>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-white" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-black" />
        </>
      )}
      {theme.theme === 'system' && (
        <ComputerIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-white dark:text-black " />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
