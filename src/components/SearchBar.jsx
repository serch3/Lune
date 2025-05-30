import { useState, useEffect, useRef, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useSettingsStore } from '@/stores/settings';
import { MAX_SUGGESTIONS } from '@/constants';

// Suggestion endpoint mappings
const SUGGEST_ENDPOINTS = {
  google: q => `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}`,
  duckduckgo: q => `https://ac.duckduckgo.com/ac/?q=${encodeURIComponent(q)}&type=list`,
  bing: q => `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(q)}`,
  yandex: q => `https://yandex.com/suggest/suggest-ya.cgi?v=4&part=${encodeURIComponent(q)}`,
};

// Search engine icon mapping
const SEARCH_ENGINE_ICONS = {
  google: '/brands/google.svg',
  duckduckgo: '/brands/duckduckgo.svg',
  bing: '/brands/bing.svg',
  yandex: '/brands/yandex.svg',
};

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const SearchBar = () => {
  const { searchEngine } = useSettingsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedTerm = useDebounce(searchTerm, 250);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (term, controller) => {
    if (!term) {
      setSuggestions([]);
      return;
    }
    const urlFn = SUGGEST_ENDPOINTS[searchEngine] || SUGGEST_ENDPOINTS.google;
    const url = urlFn(term);
    try {
      const response = await fetch(url, { signal: controller.signal });
      const data = await response.json();
      let items = [];
      if (searchEngine === 'duckduckgo') {
        items = data.map(item => item.phrase);
      } else if (searchEngine === 'yandex') {
        if (Array.isArray(data) && data.length > 1 && Array.isArray(data[1])) {
          items = data[1].map(item => typeof item === 'string' ? item : item[1]);
        }
      } else if (Array.isArray(data[1])) {
        items = data[1];
      }
      setSuggestions(items.slice(0, MAX_SUGGESTIONS));
      setShowDropdown(items.length > 0);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
      setSuggestions([]);
    }
  }, [searchEngine]);

  // Trigger suggestions on debounced term change
  useEffect(() => {
    const controller = new AbortController();
    fetchSuggestions(debouncedTerm, controller);
    return () => controller.abort();
  }, [debouncedTerm, fetchSuggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigate to selected search
  const goToSearch = term => {
    const query = term.trim();
    if (!query) return;
    const urls = {
      google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
      yandex: `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
    };
    window.location.href = urls[searchEngine] || urls.google;
    setSearchTerm('');
    setShowDropdown(false);
  };

  // Handle Enter key
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      goToSearch(searchTerm);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <div className="flex items-center relative">
        <FiSearch className="absolute left-4 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onFocus={() => debouncedTerm && suggestions.length > 0 && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search or type a URL"
          className="w-full pl-12 pr-12 py-3 text-lg bg-white border rounded-full dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow duration-200 shadow-sm hover:shadow-md focus:shadow-lg placeholder-gray-400 dark:placeholder-gray-500"
          aria-autocomplete="list"
          aria-controls="suggestion-list"
        />
        {searchEngine && SEARCH_ENGINE_ICONS[searchEngine] && (
          <img
            src={SEARCH_ENGINE_ICONS[searchEngine]}
            alt={`${searchEngine} logo`}
            className="absolute right-4 h-6 w-6"
          />
        )}
      </div>
      {showDropdown && suggestions.length > 0 && (
        <ul
          id="suggestion-list"
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden"
        >
          {suggestions.map((sugg, idx) => (
            <li
              key={idx}
              role="option"
              onMouseDown={() => goToSearch(sugg)}
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <FiSearch className="mr-3 text-gray-500 dark:text-gray-400" />
              <span className="truncate text-gray-900 dark:text-gray-100 text-base">{sugg}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
