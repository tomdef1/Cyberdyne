import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [crt, setCrt] = useState(() => localStorage.getItem('crt') !== 'off');
  useEffect(() => { localStorage.setItem('crt', crt ? 'on' : 'off');
    document.documentElement.dataset.crt = crt ? 'on' : 'off';
  }, [crt]);
  return <ThemeContext.Provider value={{ crt, toggle: () => setCrt(c => !c) }}>{children}</ThemeContext.Provider>;
}
export function useTheme(){return useContext(ThemeContext);}
