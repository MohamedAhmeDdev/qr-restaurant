import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, X, ChevronRight, ImagesIcon, AlertCircle, RotateCcw, UtensilsCrossed, Images, Image } from 'lucide-react';
import '../../Customer.css';
import StickyBottomBar from '../../components/StickyBottomBar';
import { useCart } from '../../contexts/CartContext';
import guestApi from '../../services/guestApi';
import RestaurantService from '../../services/RestaurantDetails';
import { getImageUrl } from '../../utils/getImageUrl';
import { useFormatPrice } from '../../contexts/useFormatPrice';

export default function MenuPage() {
  const { restaurantSlug, tableSlug } = useParams();
  const { cartItems } = useCart();
    const {formatPrice} = useFormatPrice();

  const [restaurantData, setRestaurantData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  // Fetch Menu & Restaurant Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [restaurantRes, menuRes] = await Promise.all([
        RestaurantService.getRestaurantDetails(restaurantSlug),
        guestApi.get('/menu'),
      ]);

 const fetchedRestaurant =  restaurantRes;
      const fetchedCategories = menuRes.data?.data?.categories;

      setRestaurantData(fetchedRestaurant);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Failed to fetch menu data:', err);
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, [restaurantSlug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Flattened items list
  const flatItems = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories.flatMap((cat) =>
      (cat.menu_items || []).map((item) => ({
        ...item,
        categoryId: cat.id,
        categoryName: cat.name,
      }))
    );
  }, [categories]);

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

  return (
    <div className="min-h-screen pb-28 bg-paper text-ink font-sans transition-colors duration-200">
      
      {/* 1. LOADING SKELETON STATE */}
      {loading ? (
        <div className="animate-pulse">
          {/* Hero Skeleton */}
          <div className="w-full h-72 sm:h-80 bg-hairline relative">
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 space-y-3">
              <div className="h-4 bg-paper/30 rounded w-28" />
              <div className="h-10 bg-paper/40 rounded w-2/3" />
              <div className="h-3 bg-paper/20 rounded w-1/2" />
            </div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="px-4 -mt-5 relative z-10">
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
        /* 2. ERROR STATE */
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-paper border border-hairline rounded-2xl p-8 text-center shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-rust/10 text-rust flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-semibold text-2xl text-ink">Failed to Load Menu</h2>
            <p className="text-sm text-ink-soft leading-relaxed">{error}</p>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rust text-paper text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      ) : !restaurantData ? (
        /* 3. EMPTY STATE (RESTAURANT NOT FOUND) */
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-paper border border-hairline rounded-2xl p-8 text-center shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-full bg-hairline text-ink-soft flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-semibold text-2xl text-ink">Restaurant Unavailable</h2>
            <p className="text-sm text-ink-soft leading-relaxed">
              We couldn't locate details for this restaurant. Please check the QR code or link and try again.
            </p>
          </div>
        </div>
      ) : (
        /* 4. LIST / CONTENT DISPLAY STATE */
        <>
          {/* HERO */}
          <div className="relative w-full h-72 sm:h-80 shrink-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center w-full h-full"
              style={{ backgroundImage: `url('${getImageUrl(restaurantData.background_image)}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#182019]/55 via-[#182019]/35 to-[#182019]/92" />

            <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 animate-fade-in-up">
              <div className="flex items-center gap-2 text-3xl font-bold uppercase tracking-[0.2em] mb-2 text-white">
                <span>{restaurantData.name}</span>
              </div>
              <h1 className="font-serif italic text-4xl sm:text-5xl leading-none text-paper font-medium">
                {restaurantData.name}
              </h1>
              <p className="text-sm mt-2 text-paper/65">Tap any dish to customize and add to your table order.</p>
            </div>
          </div>

          {/* SEARCH */}
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
                <button onClick={() => setQuery('')} className="ml-2 shrink-0 text-sage hover:text-ink">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* CATEGORY NAV */}
          <div className="sticky top-0 z-20 pt-5 pb-3 bg-paper">
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
              {categories.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative whitespace-nowrap pb-3 text-sm font-medium tracking-wide transition-colors ${
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

          {/* MENU LIST & EMPTY MENU STATE */}
          <div className="px-5 py-4 max-w-2xl mx-auto">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <UtensilsCrossed className="w-8 h-8 mx-auto text-ink-soft/40" />
                <p className="font-serif italic text-lg text-ink-soft">
                  {query ? `Nothing matches "${query}"` : 'No menu items available in this category.'}
                </p>
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-xs text-rust font-semibold underline underline-offset-4 hover:opacity-80"
                  >
                    Clear search filter
                  </button>
                )}
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`py-5 flex gap-4 cursor-pointer group transition-opacity hover:opacity-90 ${
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
                      <Image className="w-6 h-6 text-ink-soft/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-serif font-semibold text-lg leading-tight text-ink group-hover:text-rust transition-colors truncate">
                          {item.name}
                        </h3>
                        <span className="font-serif font-semibold text-lg shrink-0 text-ink">
                          {formatPrice(item.price, { currency: restaurantData?.currency })}               
                      </span>
                      </div>
                      <p className="text-[13px] mt-1 leading-snug line-clamp-2 text-ink-soft">{item.description}</p>
                    </div>
                   <Link to={`/${restaurantSlug}/${tableSlug}/item/${item.id}`}>
                      <div className="flex items-center justify-end gap-1 mt-2 text-xs font-semibold text-brass">
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