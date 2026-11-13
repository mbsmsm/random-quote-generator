/**
 * ============================================================================
 * Lumina Quotes - Premium Black & White Editorial Quote Generator
 * ============================================================================
 * 
 * README & QUICKSTART GUIDE
 * ----------------------------------------------------------------------------
 * A refined, editorial web application crafted with a strict monochromatic
 * palette: deep charcoal background (#0d0d0d), off-white typography (#f5f5f5),
 * and soft grey (#8a8a8a) for subtle secondary text, hairlines, and dividers.
 * 
 * HOW TO RUN:
 * 1. Install dependencies:
 *      npm install
 * 2. Start development server:
 *      npm run dev
 * 3. Open in your browser:
 *      http://localhost:3000
 * 4. Production build:
 *      npm run build
 * 
 * CORE FEATURES:
 * - 54 Curated Quotes across 6 Categories (Motivation, Success, Life, Love,
 *   Perseverance, Wisdom).
 * - "New Quote" button with smooth fade-and-slide animation.
 * - Bidirectional history navigation with "Previous" button.
 * - Instant "Copy" button with visual "Copied!" feedback.
 * - "Favorite" toggle button with persistent browser storage (localStorage).
 * - Clean Favorites list section with subtle dividers and quick actions.
 * - Category filter dropdown displaying quotes exclusively from chosen topics.
 * - Elegant typography pairing: Playfair Display / Cormorant Garamond for quotes,
 *   and Inter with wide letter-spacing for UI labels and author names.
 * - Fully responsive, mobile-first design with large touch targets.
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Copy,
  Check,
  Filter,
  Trash2,
  ExternalLink,
  Volume2,
  VolumeX,
  Share2
} from 'lucide-react';

// ============================================================================
// TYPES & DATA STRUCTURES
// ============================================================================

export type Category = 'motivation' | 'success' | 'life' | 'love' | 'perseverance' | 'wisdom';

export interface Quote {
  id: string;
  text: string;
  author: string;
  authorRole: string;
  category: Category;
}

export interface CategoryOption {
  key: Category | 'all';
  label: string;
}

export const CATEGORIES: CategoryOption[] = [
  { key: 'all', label: 'All Categories' },
  { key: 'motivation', label: 'Motivation' },
  { key: 'success', label: 'Success' },
  { key: 'life', label: 'Life' },
  { key: 'love', label: 'Love' },
  { key: 'perseverance', label: 'Perseverance' },
  { key: 'wisdom', label: 'Wisdom' },
];

// 54 curated quotes across the 6 categories (9 per category)
export const QUOTES_DATABASE: Quote[] = [
  // --------------------------------------------------------------------------
  // 1. MOTIVATION
  // --------------------------------------------------------------------------
  {
    id: 'mot-1',
    text: 'The impediment to action advances action. What stands in the way becomes the way.',
    author: 'Marcus Aurelius',
    authorRole: 'Roman Emperor & Stoic Philosopher',
    category: 'motivation',
  },
  {
    id: 'mot-2',
    text: 'Believe you can and you’re halfway there.',
    author: 'Theodore Roosevelt',
    authorRole: '26th U.S. President',
    category: 'motivation',
  },
  {
    id: 'mot-3',
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    authorRole: 'Diplomat & Humanitarian',
    category: 'motivation',
  },
  {
    id: 'mot-4',
    text: 'You may encounter many defeats, but you must not be defeated.',
    author: 'Maya Angelou',
    authorRole: 'Poet & Civil Rights Activist',
    category: 'motivation',
  },
  {
    id: 'mot-5',
    text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.',
    author: 'Ralph Waldo Emerson',
    authorRole: 'Philosopher & Essayist',
    category: 'motivation',
  },
  {
    id: 'mot-6',
    text: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney',
    authorRole: 'Pioneering Animator & Visionary',
    category: 'motivation',
  },
  {
    id: 'mot-7',
    text: 'Start where you are. Use what you have. Do what you can.',
    author: 'Arthur Ashe',
    authorRole: 'Tennis Champion & Humanitarian',
    category: 'motivation',
  },
  {
    id: 'mot-8',
    text: 'Your time is limited, so don’t waste it living someone else’s life.',
    author: 'Steve Jobs',
    authorRole: 'Co-founder of Apple Inc.',
    category: 'motivation',
  },
  {
    id: 'mot-9',
    text: 'Knowing is not enough; we must apply. Willing is not enough; we must do.',
    author: 'Johann Wolfgang von Goethe',
    authorRole: 'Polymath, Statesman & Poet',
    category: 'motivation',
  },

  // --------------------------------------------------------------------------
  // 2. SUCCESS
  // --------------------------------------------------------------------------
  {
    id: 'suc-1',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    authorRole: 'Statesman & Nobel Laureate',
    category: 'success',
  },
  {
    id: 'suc-2',
    text: 'Try not to become a man of success, but rather try to become a man of value.',
    author: 'Albert Einstein',
    authorRole: 'Theoretical Physicist',
    category: 'success',
  },
  {
    id: 'suc-3',
    text: 'There are no secrets to success. It is the result of preparation, hard work, and learning from failure.',
    author: 'Colin Powell',
    authorRole: 'Diplomat & General',
    category: 'success',
  },
  {
    id: 'suc-4',
    text: 'Success is getting what you want; happiness is wanting what you get.',
    author: 'Dale Carnegie',
    authorRole: 'Author & Self-Improvement Pioneer',
    category: 'success',
  },
  {
    id: 'suc-5',
    text: 'Whether you think you can, or you think you can’t — you’re right.',
    author: 'Henry Ford',
    authorRole: 'Industrialist & Founder of Ford Motor Co.',
    category: 'success',
  },
  {
    id: 'suc-6',
    text: 'Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.',
    author: 'Thomas Edison',
    authorRole: 'Inventor & Businessman',
    category: 'success',
  },
  {
    id: 'suc-7',
    text: 'Never let the fear of striking out keep you from playing the game.',
    author: 'Babe Ruth',
    authorRole: 'Baseball Legend',
    category: 'success',
  },
  {
    id: 'suc-8',
    text: 'Success is to be measured not so much by the position reached in life as by the obstacles overcome.',
    author: 'Booker T. Washington',
    authorRole: 'Educator, Reformer & Author',
    category: 'success',
  },
  {
    id: 'suc-9',
    text: 'The only place where success comes before work is in the dictionary.',
    author: 'Vidal Sassoon',
    authorRole: 'Global Entrepreneur',
    category: 'success',
  },

  // --------------------------------------------------------------------------
  // 3. LIFE
  // --------------------------------------------------------------------------
  {
    id: 'lif-1',
    text: 'To live is the rarest thing in the world. Most people exist, that is all.',
    author: 'Oscar Wilde',
    authorRole: 'Irish Playwright, Poet & Wit',
    category: 'life',
  },
  {
    id: 'lif-2',
    text: 'Life is long if you know how to use it.',
    author: 'Seneca',
    authorRole: 'Roman Stoic Philosopher & Statesman',
    category: 'life',
  },
  {
    id: 'lif-3',
    text: 'Life is a succession of lessons which must be lived to be understood.',
    author: 'Ralph Waldo Emerson',
    authorRole: 'Philosopher & Transcendentalist',
    category: 'life',
  },
  {
    id: 'lif-4',
    text: 'Life can only be understood backwards; but it must be lived forwards.',
    author: 'Søren Kierkegaard',
    authorRole: 'Philosopher & Theologian',
    category: 'life',
  },
  {
    id: 'lif-5',
    text: 'Go confidently in the direction of your dreams. Live the life you have imagined.',
    author: 'Henry David Thoreau',
    authorRole: 'Naturalist, Essayist & Philosopher',
    category: 'life',
  },
  {
    id: 'lif-6',
    text: 'Life is what happens to you while you’re busy making other plans.',
    author: 'John Lennon',
    authorRole: 'Musician & Songwriter',
    category: 'life',
  },
  {
    id: 'lif-7',
    text: 'The privilege of a lifetime is being who you are.',
    author: 'Joseph Campbell',
    authorRole: 'Mythologist & Literature Scholar',
    category: 'life',
  },
  {
    id: 'lif-8',
    text: 'In the end, it’s not the years in your life that count. It’s the life in your years.',
    author: 'Abraham Lincoln',
    authorRole: '16th U.S. President',
    category: 'life',
  },
  {
    id: 'lif-9',
    text: 'Life is really simple, but we insist on making it complicated.',
    author: 'Confucius',
    authorRole: 'Philosopher of Ancient China',
    category: 'life',
  },

  // --------------------------------------------------------------------------
  // 4. LOVE
  // --------------------------------------------------------------------------
  {
    id: 'lov-1',
    text: 'Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.',
    author: 'Lao Tzu',
    authorRole: 'Ancient Sage & Founder of Taoism',
    category: 'love',
  },
  {
    id: 'lov-2',
    text: 'Love is the bridge between you and everything.',
    author: 'Rumi',
    authorRole: '13th-century Mystic & Poet',
    category: 'love',
  },
  {
    id: 'lov-3',
    text: 'Love does not consist in gazing at each other, but in looking outward together in the same direction.',
    author: 'Antoine de Saint-Exupéry',
    authorRole: 'French Writer & Aviator',
    category: 'love',
  },
  {
    id: 'lov-4',
    text: 'Love is composed of a single soul inhabiting two bodies.',
    author: 'Aristotle',
    authorRole: 'Ancient Greek Philosopher & Scientist',
    category: 'love',
  },
  {
    id: 'lov-5',
    text: 'Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls to arrive full of hope.',
    author: 'Maya Angelou',
    authorRole: 'Poet & Civil Rights Icon',
    category: 'love',
  },
  {
    id: 'lov-6',
    text: 'To love or have loved, that is enough. Ask nothing further. There is no other pearl in the dark folds of life.',
    author: 'Victor Hugo',
    authorRole: 'Author of Les Misérables',
    category: 'love',
  },
  {
    id: 'lov-7',
    text: 'Whatever our souls are made of, his and mine are the same.',
    author: 'Emily Brontë',
    authorRole: 'English Novelist & Poet',
    category: 'love',
  },
  {
    id: 'lov-8',
    text: 'Love is an action, never simply a feeling.',
    author: 'bell hooks',
    authorRole: 'Cultural Theorist, Author & Activist',
    category: 'love',
  },
  {
    id: 'lov-9',
    text: 'Love one another, but make not a bond of love: let it rather be a moving sea between the shores of your souls.',
    author: 'Kahlil Gibran',
    authorRole: 'Poet & Artist',
    category: 'love',
  },

  // --------------------------------------------------------------------------
  // 5. PERSEVERANCE
  // --------------------------------------------------------------------------
  {
    id: 'per-1',
    text: 'It always seems impossible until it’s done.',
    author: 'Nelson Mandela',
    authorRole: 'Anti-Apartheid Leader & President',
    category: 'perseverance',
  },
  {
    id: 'per-2',
    text: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
    authorRole: 'Philosopher & Teacher',
    category: 'perseverance',
  },
  {
    id: 'per-3',
    text: 'If you can’t fly then run, if you can’t run then walk, if you can’t walk then crawl, but whatever you do you have to keep moving forward.',
    author: 'Martin Luther King Jr.',
    authorRole: 'Nobel Peace Prize Laureate & Civil Rights Leader',
    category: 'perseverance',
  },
  {
    id: 'per-4',
    text: 'If you are going through hell, keep going.',
    author: 'Winston Churchill',
    authorRole: 'British Prime Minister',
    category: 'perseverance',
  },
  {
    id: 'per-5',
    text: 'We can do anything we want to if we stick to it long enough.',
    author: 'Helen Keller',
    authorRole: 'Author, Disability Advocate & Lecturer',
    category: 'perseverance',
  },
  {
    id: 'per-6',
    text: 'Pain is inevitable. Suffering is optional.',
    author: 'Haruki Murakami',
    authorRole: 'Contemporary Japanese Novelist',
    category: 'perseverance',
  },
  {
    id: 'per-7',
    text: 'Perseverance is failing 19 times and succeeding the 20th.',
    author: 'Julie Andrews',
    authorRole: 'Actress & Author',
    category: 'perseverance',
  },
  {
    id: 'per-8',
    text: 'The best way out is always through.',
    author: 'Robert Frost',
    authorRole: 'Pulitzer Prize-Winning Poet',
    category: 'perseverance',
  },
  {
    id: 'per-9',
    text: 'Great works are performed not by strength, but by perseverance.',
    author: 'Samuel Johnson',
    authorRole: 'Lexicographer & Literary Critic',
    category: 'perseverance',
  },

  // --------------------------------------------------------------------------
  // 6. WISDOM
  // --------------------------------------------------------------------------
  {
    id: 'wis-1',
    text: 'The only true wisdom is in knowing you know nothing.',
    author: 'Socrates',
    authorRole: 'Classical Greek Philosopher',
    category: 'wisdom',
  },
  {
    id: 'wis-2',
    text: 'No man ever steps in the same river twice, for it’s not the same river and he’s not the same man.',
    author: 'Heraclitus',
    authorRole: 'Presocratic Greek Philosopher',
    category: 'wisdom',
  },
  {
    id: 'wis-3',
    text: 'We have two ears and one mouth so that we can listen twice as much as we speak.',
    author: 'Epictetus',
    authorRole: 'Stoic Philosopher',
    category: 'wisdom',
  },
  {
    id: 'wis-4',
    text: 'Knowing others is intelligence; knowing yourself is true wisdom. Mastering others is strength; mastering yourself is true power.',
    author: 'Lao Tzu',
    authorRole: 'Ancient Chinese Philosopher',
    category: 'wisdom',
  },
  {
    id: 'wis-5',
    text: 'Who looks outside, dreams; who looks inside, awakes.',
    author: 'Carl Jung',
    authorRole: 'Psychiatrist & Founder of Analytical Psychology',
    category: 'wisdom',
  },
  {
    id: 'wis-6',
    text: 'Knowledge is power.',
    author: 'Francis Bacon',
    authorRole: 'Philosopher & Pioneer of Scientific Method',
    category: 'wisdom',
  },
  {
    id: 'wis-7',
    text: 'Empty your mind, be formless, shapeless — like water. Now you put water into a cup, it becomes the cup.',
    author: 'Bruce Lee',
    authorRole: 'Philosopher & Martial Arts Icon',
    category: 'wisdom',
  },
  {
    id: 'wis-8',
    text: 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.',
    author: 'Rumi',
    authorRole: '13th-century Mystic & Poet',
    category: 'wisdom',
  },
  {
    id: 'wis-9',
    text: 'Simplicity is the ultimate sophistication.',
    author: 'Leonardo da Vinci',
    authorRole: 'Renaissance Master & Polymath',
    category: 'wisdom',
  },
];

const STORAGE_KEY = 'lumina_quote_favorites_editorial_v2';

export default function App() {
  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  // History stack for bidirectional traversal
  const [history, setHistory] = useState<string[]>(['wis-9']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Favorites list saved in localStorage
  const [favorites, setFavorites] = useState<Quote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch {
      // LocalStorage access fallback
    }
    return [
      QUOTES_DATABASE.find(q => q.id === 'wis-9') || QUOTES_DATABASE[0],
      QUOTES_DATABASE.find(q => q.id === 'mot-1') || QUOTES_DATABASE[1]
    ];
  });

  // Inline two-step confirmation state for Clear All
  const [confirmClear, setConfirmClear] = useState<boolean>(false);
  const confirmClearTimerRef = useRef<NodeJS.Timeout | null>(null);

  // UI state
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Current quote lookup
  const currentQuoteId = history[historyIndex] || 'wis-9';
  const currentQuote = useMemo(() => {
    return QUOTES_DATABASE.find(q => q.id === currentQuoteId) || QUOTES_DATABASE[0];
  }, [currentQuoteId]);

  // Check if current quote is favorited
  const isFavorite = useMemo(() => {
    return favorites.some(f => f.id === currentQuote.id);
  }, [favorites, currentQuote.id]);

  // Filtered pool based on selected category
  const filteredPool = useMemo(() => {
    if (selectedCategory === 'all') return QUOTES_DATABASE;
    return QUOTES_DATABASE.filter(q => q.category === selectedCategory);
  }, [selectedCategory]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites to localStorage', e);
    }
  }, [favorites]);

  // --------------------------------------------------------------------------
  // NAVIGATION HANDLERS
  // --------------------------------------------------------------------------

  // Generate a new random quote from the active pool
  const handleNewQuote = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const pool = filteredPool;
    if (pool.length === 0) return;

    let candidate = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1) {
      while (candidate.id === currentQuote.id) {
        candidate = pool[Math.floor(Math.random() * pool.length)];
      }
    }

    // Append to history, discarding any future branches
    setHistory(prev => {
      const branched = prev.slice(0, historyIndex + 1);
      return [...branched, candidate.id];
    });
    setHistoryIndex(prev => prev + 1);
  }, [filteredPool, currentQuote.id, historyIndex]);

  // Step backward in history
  const handlePreviousQuote = useCallback(() => {
    if (historyIndex > 0) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex]);

  // Step forward in history if available
  const handleForwardQuote = useCallback(() => {
    if (historyIndex < history.length - 1) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex, history.length]);

  // Handle category filter dropdown
  const handleCategoryChange = (newCategory: Category | 'all') => {
    setSelectedCategory(newCategory);

    // If current quote doesn't belong to the newly selected category, load one that does
    if (newCategory !== 'all') {
      const matching = QUOTES_DATABASE.filter(q => q.category === newCategory);
      if (matching.length > 0 && currentQuote.category !== newCategory) {
        const randomMatch = matching[Math.floor(Math.random() * matching.length)];
        setHistory(prev => [...prev.slice(0, historyIndex + 1), randomMatch.id]);
        setHistoryIndex(prev => prev + 1);
      }
    }
  };

  // Jump directly to quote (e.g. from Favorites list)
  const handleSelectFavorite = (quoteId: string) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), quoteId]);
    setHistoryIndex(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --------------------------------------------------------------------------
  // ACTIONS: COPY, FAVORITE, SPEAK, SHARE
  // --------------------------------------------------------------------------

  // Copy quote to clipboard
  const handleCopyQuote = async () => {
    const formatted = `"${currentQuote.text}"\n— ${currentQuote.author}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(formatted);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = formatted;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy quote', err);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = () => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === currentQuote.id);
      if (exists) {
        return prev.filter(f => f.id !== currentQuote.id);
      } else {
        return [currentQuote, ...prev];
      }
    });
  };

  // Remove specific quote from favorites
  const handleRemoveFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  // Clear all favorites with inline two-step confirmation
  const handleClearFavorites = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!confirmClear) {
      setConfirmClear(true);
      if (confirmClearTimerRef.current) {
        clearTimeout(confirmClearTimerRef.current);
      }
      confirmClearTimerRef.current = setTimeout(() => {
        setConfirmClear(false);
      }, 3000);
      return;
    }

    // Second click within 3 seconds: proceed with clearing
    if (confirmClearTimerRef.current) {
      clearTimeout(confirmClearTimerRef.current);
    }
    setConfirmClear(false);
    setFavorites([]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (err) {
      console.warn('Failed to clear favorites from localStorage', err);
    }
  };

  // Text-to-speech reader
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${currentQuote.text}. By ${currentQuote.author}`);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Share quote
  const handleShare = () => {
    const shareText = `"${currentQuote.text}" — ${currentQuote.author}`;
    if (navigator.share) {
      navigator.share({
        title: `Quote by ${currentQuote.author}`,
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'SELECT') {
        return;
      }
      if (e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleNewQuote();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePreviousQuote();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleToggleFavorite();
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopyQuote();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewQuote, handlePreviousQuote, handleToggleFavorite, handleCopyQuote]);

  // Clean up audio and timers on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (confirmClearTimerRef.current) clearTimeout(confirmClearTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] font-ui antialiased selection:bg-[#f5f5f5] selection:text-[#0d0d0d] flex flex-col justify-between">
      
      {/* ==================================================================== */}
      {/* 1. TOP HEADER & CATEGORY FILTER                                      */}
      {/* ==================================================================== */}
      <header className="border-b border-white/[0.08] bg-[#0d0d0d]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Brand Logo & Mobile Counter */}
          <div className="flex items-center justify-between">
            {/* Logo with subtle fade-in on page load */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 220 60"
                className="h-8 sm:h-9 w-auto select-none"
                aria-label="Lumina Quotes Logo"
                role="img"
              >
                <circle cx="30" cy="30" r="26" fill="#0d0d0d" stroke="#f5f5f5" strokeWidth="1.5" />
                <text x="30" y="42" fontFamily="Georgia, serif" fontSize="32" fill="#f5f5f5" textAnchor="middle">"</text>
                <text x="70" y="28" fontFamily="Inter, Arial, sans-serif" fontSize="20" fontWeight="600" letterSpacing="4" fill="#f5f5f5">LUM</text>
                <text x="70" y="44" fontFamily="Inter, Arial, sans-serif" fontSize="9" letterSpacing="3" fill="#8a8a8a">QUOTES</text>
              </svg>
            </motion.div>

            {/* Mobile History Counter */}
            <span className="sm:hidden font-mono text-[11px] text-[#8a8a8a] border border-white/[0.08] px-2.5 py-1 rounded">
              {historyIndex + 1} / {history.length}
            </span>
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-56">
              <label htmlFor="category-select" className="sr-only">
                Filter by Category
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8a8a8a]">
                <Filter className="w-3.5 h-3.5" />
              </div>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={e => handleCategoryChange(e.target.value as Category | 'all')}
                className="w-full appearance-none bg-[#141414] text-[#f5f5f5] text-xs font-medium pl-9 pr-8 py-2.5 rounded-lg border border-white/10 hover:border-white/30 focus:outline-none focus:border-white transition-colors cursor-pointer tracking-wide"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.key} value={cat.key} className="bg-[#141414] text-[#f5f5f5]">
                    {cat.label} {cat.key === 'all' ? `(${QUOTES_DATABASE.length})` : `(9)`}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8a8a8a] text-[10px]">
                ▼
              </div>
            </div>

            {/* Desktop Counter */}
            <div className="hidden sm:flex items-center text-[11px] text-[#8a8a8a] font-mono px-3 py-2.5 rounded-lg border border-white/[0.08] bg-[#141414] whitespace-nowrap">
              <span>{historyIndex + 1} of {history.length} viewed</span>
            </div>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN CONTENT WRAPPER                                                 */}
      {/* ==================================================================== */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 flex flex-col gap-8">
        
        {/* ================================================================== */}
        {/* 2. THE QUOTE CARD (Top, Centered, Hairline borders, Soft Glow)     */}
        {/* ================================================================== */}
        <section aria-label="Quote of the moment" className="w-full relative group">
          
          {/* Subtle soft ambient glow behind the quote card */}
          <div className="absolute -inset-0.5 rounded-2xl bg-white/[0.02] blur-xl pointer-events-none" />

          <div className="relative rounded-2xl bg-[#141414] border border-white/[0.08] shadow-[0_0_60px_-15px_rgba(255,255,255,0.03)] p-8 sm:p-12 md:p-14 flex flex-col justify-between min-h-[360px] sm:min-h-[400px] overflow-hidden">
            
            {/* Editorial Faint Watermark Quotation Mark */}
            <div
              aria-hidden="true"
              className="absolute -top-6 -left-3 sm:-top-8 sm:-left-4 text-white/[0.03] pointer-events-none select-none font-quote text-[160px] sm:text-[200px] leading-none"
            >
              “
            </div>

            {/* Top Card Header: Category & Subtle Audio/Share tools */}
            <div className="flex items-center justify-between gap-4 mb-8 relative z-10">
              <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#8a8a8a]">
                {currentQuote.category}
              </span>

              <div className="flex items-center gap-1.5">
                {/* Audio Text-To-Speech */}
                <button
                  onClick={handleToggleSpeech}
                  title={isSpeaking ? 'Stop reading' : 'Listen to quote'}
                  aria-label="Listen to quote"
                  className={`p-2 rounded-lg border text-xs transition-all duration-200 ${
                    isSpeaking
                      ? 'bg-[#f5f5f5] text-[#0d0d0d] border-[#f5f5f5]'
                      : 'border-white/10 text-[#8a8a8a] hover:text-[#f5f5f5] hover:border-white/20'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  title="Share quote"
                  aria-label="Share quote"
                  className="p-2 rounded-lg border border-white/10 text-[#8a8a8a] hover:text-[#f5f5f5] hover:border-white/20 transition-all duration-200"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Animated Quote Content: Soft Fade-and-Slide */}
            <div className="my-auto py-2 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col"
                >
                  {/* Thin decorative hairline line above quote for editorial look */}
                  <div className="w-12 h-px bg-white/20 mb-8" />

                  {/* Quote text in elegant serif font with comfortable line height */}
                  <blockquote className="font-quote text-2xl sm:text-3xl md:text-[34px] text-[#f5f5f5] font-normal leading-[1.48] tracking-normal mb-8">
                    “{currentQuote.text}”
                  </blockquote>

                  {/* Author Name in small uppercase letters with wide letter spacing */}
                  <div className="flex flex-col gap-1">
                    <cite className="not-italic font-ui font-medium uppercase tracking-[0.25em] text-xs sm:text-sm text-[#f5f5f5]">
                      {currentQuote.author}
                    </cite>
                    <span className="text-xs text-[#8a8a8a] font-normal tracking-wide">
                      {currentQuote.authorRole}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Card Footer with hairline */}
            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#8a8a8a] relative z-10">
              <span className="tracking-wider uppercase text-[10px]">
                Wisdom of {currentQuote.author}
              </span>
              <span className="hidden sm:inline font-mono text-[10px]">
                [Space] for Next
              </span>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 3. CONTROLS BAR (Directly below quote card, minimal outlined)       */}
        {/* ================================================================== */}
        <section aria-label="Quote Controls" className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* 1. Previous Button */}
            <button
              onClick={handlePreviousQuote}
              disabled={historyIndex <= 0}
              className={`h-13 sm:h-14 px-4 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border transition-all duration-200 active:scale-[0.98] ${
                historyIndex <= 0
                  ? 'border-white/[0.05] text-[#8a8a8a]/30 bg-transparent cursor-not-allowed'
                  : 'border-white/20 text-[#f5f5f5] bg-transparent hover:bg-[#f5f5f5] hover:text-[#0d0d0d] hover:border-[#f5f5f5] cursor-pointer'
              }`}
              aria-label="Previous quote"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* 2. New Quote Button (Smooth hover fill with off-white, text to black) */}
            <button
              onClick={handleNewQuote}
              id="new-quote-button"
              className="h-13 sm:h-14 px-4 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border border-white/20 bg-transparent text-[#f5f5f5] hover:bg-[#f5f5f5] hover:text-[#0d0d0d] hover:border-[#f5f5f5] transition-all duration-200 active:scale-[0.98] cursor-pointer"
              aria-label="Generate new quote"
            >
              <Shuffle className="w-4 h-4" />
              <span>New Quote</span>
            </button>

            {/* 3. Copy Button with "Copied!" feedback */}
            <button
              onClick={handleCopyQuote}
              className={`h-13 sm:h-14 px-4 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                copied
                  ? 'bg-[#f5f5f5] text-[#0d0d0d] border-[#f5f5f5]'
                  : 'border-white/20 text-[#f5f5f5] bg-transparent hover:bg-[#f5f5f5] hover:text-[#0d0d0d] hover:border-[#f5f5f5]'
              }`}
              aria-label="Copy quote to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* 4. Favorite (Heart) Button */}
            <button
              onClick={handleToggleFavorite}
              className={`h-13 sm:h-14 px-4 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                isFavorite
                  ? 'bg-[#f5f5f5] text-[#0d0d0d] border-[#f5f5f5]'
                  : 'border-white/20 text-[#f5f5f5] bg-transparent hover:bg-[#f5f5f5] hover:text-[#0d0d0d] hover:border-[#f5f5f5]'
              }`}
              aria-label={isFavorite ? 'Remove quote from favorites' : 'Save quote to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
            </button>

          </div>

          {/* Forward step if user navigated backward previously */}
          {historyIndex < history.length - 1 && (
            <div className="mt-2.5 flex justify-end">
              <button
                onClick={handleForwardQuote}
                className="text-[11px] text-[#8a8a8a] hover:text-[#f5f5f5] flex items-center gap-1 py-1 px-2.5 rounded border border-white/[0.08] hover:border-white/20 transition-colors"
              >
                <span>Forward</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </section>

        {/* ================================================================== */}
        {/* 4. FAVORITES SECTION (At the bottom, clean list with dividers)     */}
        {/* ================================================================== */}
        <section aria-label="Favorite Quotes" className="w-full pt-10 border-t border-white/[0.08] flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="font-ui text-xs uppercase tracking-[0.25em] font-semibold text-[#f5f5f5]">
                Saved Favorites
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-white/[0.08] text-[#8a8a8a]">
                {favorites.length}
              </span>
            </div>

            {favorites.length > 0 && (
              <button
                type="button"
                onClick={handleClearFavorites}
                className={`relative z-10 self-start sm:self-auto text-xs font-medium px-3.5 py-1.5 rounded-lg border transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  confirmClear
                    ? 'bg-[#f5f5f5] text-[#0d0d0d] border-[#f5f5f5] font-semibold shadow-sm'
                    : 'text-[#8a8a8a] hover:text-[#f5f5f5] border-white/[0.08] hover:border-white/20 bg-transparent'
                }`}
                aria-label={confirmClear ? 'Click again to confirm clearing all favorites' : 'Clear all saved favorites'}
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>{confirmClear ? 'Click again to confirm' : 'Clear All'}</span>
              </button>
            )}
          </div>

          {/* Favorites: Clean List with Hairline Dividers */}
          {favorites.length === 0 ? (
            <div className="rounded-xl border border-white/[0.06] bg-[#141414]/50 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#8a8a8a] mb-3">
                <Heart className="w-4 h-4 stroke-1" />
              </div>
              <h3 className="text-sm font-medium text-[#f5f5f5] mb-1">
                No saved quotes yet
              </h3>
              <p className="text-xs text-[#8a8a8a] max-w-xs">
                Tap the "Favorite" button on any quote to build your curated anthology.
              </p>
            </div>
          ) : (
            <div className="border border-white/[0.08] rounded-xl bg-[#141414] overflow-hidden divide-y divide-white/[0.08]">
              {favorites.map(fav => (
                <div
                  key={fav.id}
                  className="p-5 sm:p-6 flex flex-col justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex flex-col gap-2">
                    {/* Item Category & Action Icons */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#8a8a8a]">
                        {fav.category}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSelectFavorite(fav.id)}
                          title="Display on main card"
                          className="p-1.5 rounded text-[#8a8a8a] hover:text-[#f5f5f5] hover:bg-white/[0.05] transition-colors"
                          aria-label="View on main card"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e => handleRemoveFavorite(fav.id, e)}
                          title="Remove from favorites"
                          className="p-1.5 rounded text-[#8a8a8a] hover:text-[#f5f5f5] hover:bg-white/[0.05] transition-colors"
                          aria-label="Remove favorite"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quote text in serif */}
                    <blockquote className="font-quote text-base sm:text-lg text-[#f5f5f5] font-normal leading-relaxed">
                      “{fav.text}”
                    </blockquote>
                  </div>

                  {/* Author attribution with Copy shortcut */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <div className="flex flex-col">
                      <cite className="not-italic font-ui font-medium text-xs uppercase tracking-[0.2em] text-[#f5f5f5]">
                        {fav.author}
                      </cite>
                      <span className="text-[11px] text-[#8a8a8a]">
                        {fav.authorRole}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const text = `"${fav.text}"\n— ${fav.author}`;
                        navigator.clipboard?.writeText(text);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      title="Copy quote"
                      className="text-xs text-[#8a8a8a] hover:text-[#f5f5f5] px-2.5 py-1 rounded border border-white/[0.08] hover:border-white/20 transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* ==================================================================== */}
      {/* 5. MINIMALIST FOOTER                                                 */}
      {/* ==================================================================== */}
      <footer className="border-t border-white/[0.08] py-6 text-center text-xs text-[#8a8a8a] bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Lumina Quotes</p>
          <p className="tracking-wide text-[11px]">
            Editorial Monochromatic Collection • 54 Curated Reflections
          </p>
        </div>
      </footer>

    </div>
  );
}
