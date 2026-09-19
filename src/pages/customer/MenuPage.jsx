import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, X, ChevronRight, RotateCcw, UtensilsCrossed, Image as ImageIcon } from 'lucide-react';
import '../../Customer.css';
import StickyBottomBar from '../../components/StickyBottomBar';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../contexts/CartContext';
import guestApi from '../../services/guestApi';
import { getImageUrl } from '../../utils/getImageUrl';
import { useFormatPrice } from '../../contexts/useFormatPrice';
import HeroHeader from '../../components/HeroHeader';
import ActiveOrderBanner from '../../components/ActiveOrderBanner';
import Invalid_or_missing_table_scan_token from '../../assets/images/Invalid_or_missing_table_scan_token.png';
import restaurant_not_found from '../../assets/images/restaurant_not_found.png';
import restaurant_unavailable_for_ordering from '../../assets/images/restaurant_unavailable_for_ordering.png';
import Table_is_currently_unavailable from '../../assets/images/Table_is_currently_unavailable.png';
import table_not_found from '../../assets/images/table_not_found.png';

export default function MenuPage() {
  const { restaurantSlug, tableSlug } = useParams();
  const { cartItems } = useCart();
  const { formatPrice } = useFormatPrice();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  // Fetch Menu Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const menuRes = await guestApi.get('/menu');
      const fetchedCategories = menuRes.data?.data?.categories;

      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Failed to fetch menu data:', err);
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Categories containing at least 1 menu item
  const nonEmptyCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories.filter((cat) => Array.isArray(cat.menu_items) && cat.menu_items.length > 0);
  }, [categories]);

  // Flattened items list from populated categories only
  const flatItems = useMemo(() => {
    return nonEmptyCategories.flatMap((cat) =>
      cat.menu_items.map((item) => ({
        ...item,
        categoryId: cat.id,
        categoryName: cat.name,
      }))
    );
  }, [nonEmptyCategories]);

  // Filtered items based on Category tab and Search query
  const filteredItems = useMemo(() => {
    let items = activeCategory === 'all' ? flatItems : flatItems.filter((item) => item.categoryId === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (item) => item.name?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)
      );
    }
    return items;
  }, [activeCategory, query, flatItems]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const totalItemCount = flatItems.length;

  const getErrorDetails = (message) => {
    const msg = message?.toLowerCase() || '';

    if (msg.includes('restaurant') && msg.includes('unavailable')) {
      return {
        title: 'Restaurant Unavailable',
        type: 'restaurant_unavailable',
      };
    }
    if (msg.includes('table not found')) {
      return {
        title: 'Table Not Found',
        type: 'table_not_found',
      };
    }
    if (msg.includes('table is currently unavailable')) {
      return {
        title: 'Table Unavailable',
        type: 'table_unavailable',
      };
    }
    if (msg.includes('token') || msg.includes('scan token')) {
      return {
        title: 'Invalid QR Session',
        type: 'invalid_token',
      };
    }
    if (msg.includes('missing')) {
      return {
        title: 'Missing Context',
        type: 'missing_context',
      };
    }

    // Default fallback error
    return {
      title: 'Failed to Load Menu',
      type: 'generic_error',
    };
  };

  // Helper to render imported images based on error type
  const renderErrorIllustration = (type) => {
    const baseClass = "w-40 h-40 sm:w-48 sm:h-48 mb-6 object-cover";
    
    switch (type) {
      case 'restaurant_unavailable':
        return (
          <img 
            src={restaurant_unavailable_for_ordering} 
            alt="Restaurant Unavailable" 
            className={baseClass} 
          />
        );
      case 'table_not_found':
        return (
          <img 
            src={table_not_found} 
            alt="Table Not Found" 
            className={baseClass} 
          />
        );
      case 'table_unavailable':
        return (
          <img 
            src={Table_is_currently_unavailable} 
            alt="Table Unavailable" 
            className={baseClass} 
          />
        );
      case 'invalid_token':
        return (
          <img 
            src={Invalid_or_missing_table_scan_token} 
            alt="Invalid QR Session" 
            className={baseClass} 
          />
        );
      case 'missing_context':
        return (
          <img 
            src={restaurant_not_found} 
            alt="Missing Context" 
            className={baseClass} 
          />
        );
      default:
        return (
          <img 
            src={restaurant_not_found} 
            alt="Failed to Load Menu" 
            className={baseClass} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen pb-28 bg-paper text-ink font-sans transition-colors duration-200">
      {/* 1. HERO HEADER */}
      <HeroHeader />


      
      {/* 3. LOADING SKELETON STATE */}
      {loading ? (
        <div className="animate-pulse">
          {/* Search Bar Skeleton */}
          <div className="px-4 pt-3 max-w-2xl mx-auto relative z-10">
            <div className="h-12 rounded-xl bg-paper border border-hairline shadow-sm" />
          </div>

          {/* Category Nav Skeleton */}
          <div className="pt-5 pb-3 px-5 flex space-x-6 border-b border-hairline overflow-x-hidden">
            <div className="h-5 bg-hairline rounded w-12 shrink-0" />
            <div className="h-5 bg-hairline rounded w-20 shrink-0" />
            <div className="h-5 bg-hairline rounded w-16 shrink-0" />
            <div className="h-5 bg-hairline rounded w-24 shrink-0" />
          </div>

          {/* Items List Skeleton */}
          <div className="px-5 py-4 max-w-2xl mx-auto space-y-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex gap-4 py-4 border-b border-hairline">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-hairline shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-5 bg-hairline rounded w-1/2" />
                    <div className="h-5 bg-hairline rounded w-12" />
                  </div>
                  <div className="h-3 bg-hairline rounded w-3/4" />
                  <div className="h-3 bg-hairline rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        /* 4. DYNAMIC ERROR STATE WITH CUSTOM IMAGES */
      (() => {
  const { title, type } = getErrorDetails(error);
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-20 my-auto w-full min-h-[calc(100vh-150px)]">
      {renderErrorIllustration(type)}
      
      <p className="text-sm font-semibold text-ink mb-2">{error}</p>
      <p className="text-sm text-ink-soft max-w-xs mb-4">
        {title}
      </p>
      
      <button
        onClick={fetchData}
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rust hover:opacity-80 transition-opacity"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Try Again
      </button>
    </div>
  );
})()
      ) : totalItemCount === 0 ? (
        /* 5. GLOBAL EMPTY MENU STATE (0 Items Across All Categories) */
        <div className="py-16 px-6 max-w-2xl mx-auto flex flex-col items-center text-center">
          <img
            src={restaurant_not_found}
            alt="Menu Currently Unavailable"
            className="w-40 h-40 sm:w-48 sm:h-48 mb-6 object-cover rounded-xl shadow-sm"
          />
          
          <h3 className="text-xl font-semibold text-ink mb-2">Menu Currently Unavailable</h3>
          <p className="text-sm text-ink-soft max-w-xs mb-6">
            There are no items currently available on the menu. Please check back shortly or speak with your server.
          </p>
          
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rust hover:opacity-80 transition-opacity"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Refresh Menu
          </button>
        </div>
      ) : (
        /* 6. LIST / CONTENT DISPLAY STATE */
        <>
    {/* 2. SEARCH BAR */}
          <div className="px-4 -mt-5 relative z-10">
            <div className="flex items-center px-4 py-3 rounded-xl shadow-sm bg-paper border border-hairline">
              <Search className="w-4 h-4 mr-3 shrink-0 text-sage" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the menu..."
                className="w-full bg-transparent outline-none text-sm text-ink placeholder:text-ink-soft"
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear search" className="ml-2 shrink-0 text-sage hover:text-ink">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 3. CATEGORY NAV (Displays Non-Empty Categories Only) */}
          <div className="sticky top-0 z-20 pt-5 bg-paper">
            <div className="flex overflow-x-auto space-x-6 px-5 no-scrollbar border-b border-hairline">
              <button
                key="all"
                onClick={() => setActiveCategory('all')}
                className={`relative whitespace-nowrap pb-3 text-sm font-medium tracking-wide transition-colors ${
                  activeCategory === 'all' ? 'text-ink' : 'text-ink-soft hover:text-ink'
                }`}
              >
                All
                <span
                  className="absolute left-0 right-0 -bottom-px h-[2px] bg-rust transition-transform origin-left"
                  style={{ transform: activeCategory === 'all' ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </button>
              {nonEmptyCategories.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative whitespace-nowrap pb-3 text-xs tracking-wide transition-colors ${
                      active ? 'text-ink' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {cat.name}
                    <span
                      className="absolute left-0 right-0 -bottom-px h-[2px] bg-rust transition-transform origin-left"
                      style={{ transform: active ? 'scaleX(1)' : 'scaleX(0)' }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

      {/* 4. ACTIVE ORDER BANNER - Now positioned right after the category navigation */}
      {!loading && !error && totalItemCount > 0 && (
        <div className="max-w-2xl mx-auto px-5 pt-3">
          <ActiveOrderBanner />
        </div>
      )}

          {/* MENU LIST & FILTER/SEARCH EMPTY STATE */}
          <div className="px-5 py-4 max-w-2xl mx-auto">
            {filteredItems.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  icon={query ? Search : UtensilsCrossed}
                  title={query ? `Nothing matches "${query}"` : 'No items found'}
                  description={
                    query
                      ? 'Try adjusting your search query or switching category filters.'
                      : 'No items match your selected filter.'
                  }
                  action={
                    query ? (
                      <button
                        onClick={() => setQuery('')}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rust hover:opacity-80 transition-opacity"
                      >
                        Clear search filter
                      </button>
                    ) : null
                  }
                />
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`py-5 flex gap-2 cursor-pointer group transition-opacity hover:opacity-90 ${
                    idx !== 0 ? 'border-t border-hairline' : ''
                  }`}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden relative bg-hairline flex items-center justify-center">
                    {item.image_url ? (
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-ink-soft/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-serif text-md leading-tight text-ink group-hover:text-rust transition-colors truncate">
                          {item.name}
                        </h3>
                        <span className="text-sm shrink-0 text-ink font-medium">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p className="text-[13px] mt-1 leading-snug line-clamp-2 text-ink-soft">
                        {item.description}
                      </p>
                    </div>
                    <Link to={`/${restaurantSlug}/${tableSlug}/item/${item.id}`}>
                      <div className="flex items-center justify-end gap-1 mt-2 text-sm font-semibold text-brass">
                        <span>View Item</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          <StickyBottomBar type="menu" visible={cartCount > 0} count={cartCount} amount={cartTotal} />
        </>
      )}
    </div>
  );
}