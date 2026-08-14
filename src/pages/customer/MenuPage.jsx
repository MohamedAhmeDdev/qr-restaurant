import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, ChefHat, X, ChevronRight, ArrowRight } from 'lucide-react';
import '../../Customer.css';
import { Link } from 'react-router-dom';
import StickyBottomBar from '../../components/StickyBottomBar';

const RESTAURANT_DATA = {
  name: "Cafe Bella",
  table: "Table 12",
  heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
};

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'starters', name: 'Starters' },
  { id: 'mains', name: 'Mains' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'desserts', name: 'Desserts' },
];

const MENU_ITEMS = [
  {
    id: 1,
    categoryId: 'starters',
    name: 'Bruschetta al Pomodoro',
    description: 'Toasted ciabatta, fresh tomatoes, garlic, basil, and extra virgin olive oil.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 2,
    categoryId: 'mains',
    name: 'Gourmet Chicken Burger',
    description: 'Crispy chicken breast, coleslaw, pickles, and spicy mayo on a brioche bun.',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    popular: true,
  },
  {
    id: 3,
    categoryId: 'mains',
    name: 'Truffle Mushroom Pasta',
    description: 'Fettuccine, wild mushrooms, parmesan cream sauce, and truffle oil.',
    price: 16.50,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 4,
    categoryId: 'drinks',
    name: 'Iced Caramel Latte',
    description: 'Espresso, cold milk, caramel syrup, and ice.',
    price: 5.00,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 5,
    categoryId: 'desserts',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone.',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  // Sample cart state for demonstration
  const [cartItems] = useState([
    { id: 2, quantity: 1 },
    { id: 4, quantity: 2 }
  ]);

  const filteredItems = useMemo(() => {
    const byCategory = activeCategory === 'all'
      ? MENU_ITEMS
      : MENU_ITEMS.filter(item => item.categoryId === activeCategory);
    if (!query.trim()) return byCategory;
    const q = query.trim().toLowerCase();
    return byCategory.filter(item =>
      item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    );
  }, [activeCategory, query]);

  const cartCount = useMemo(() =>
    cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]);

  const cartTotal = useMemo(() =>
    cartItems.reduce((total, cartItem) => {
      const menuItem = MENU_ITEMS.find(i => i.id === cartItem.id);
      return total + (menuItem ? menuItem.price * cartItem.quantity : 0);
    }, 0),
    [cartItems]);

  const handleSelectItem = (item) => {
    // Navigate or open modal for dish configuration
    alert(`Opening detailed order options for: ${item.name}`);
  };

  return (
    <div className="min-h-screen pb-28 bg-paper text-ink font-sans transition-colors duration-200">
      {/* HERO */}
      <div className="relative w-full h-72 sm:h-80 shrink-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full"
          style={{ backgroundImage: `url('${RESTAURANT_DATA.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#182019]/55 via-[#182019]/35 to-[#182019]/92" />

        <div className="absolute top-5 right-5 flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-paper/15 border border-paper/30 backdrop-blur-md">
          <span className="text-md font-medium tracking-wide text-paper">{RESTAURANT_DATA.table}</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 animate-fade-in-up">
          <div className="flex items-center gap-2 text-3xl font-bold uppercase tracking-[0.2em] mb-2 text-white">
            <span>{RESTAURANT_DATA.name}</span>
          </div>
          <h1 className="font-serif italic text-4xl sm:text-5xl leading-none text-paper font-medium">
            This evening's menu
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
            <button onClick={() => setQuery('')} aria-label="Clear search" className="ml-2 shrink-0 text-sage hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY NAV */}
      <div className="sticky top-0 z-20 pt-5 pb-3 bg-paper">
        <div className="flex overflow-x-auto space-x-6 px-5 no-scrollbar border-b border-hairline">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative whitespace-nowrap pb-3 text-sm font-medium tracking-wide transition-colors ${active ? 'text-ink' : 'text-ink-soft hover:text-ink'
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

      {/* MENU LIST */}
      <div className="px-5 py-4 max-w-2xl mx-auto">
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="font-serif italic text-lg text-ink-soft">Nothing matches "{query}"</p>
            <p className="text-xs mt-1 text-sage">Try another dish or clear the search.</p>
          </div>
        )}

        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            className={`py-5 flex gap-4 cursor-pointer group transition-opacity hover:opacity-90 ${idx !== 0 ? 'border-t border-hairline' : ''
              }`}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden relative bg-hairline">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              {item.popular && (
                <div className="absolute top-1 left-1 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-rust text-paper">
                  Popular
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline">
                  <h3 className="font-serif font-semibold text-lg leading-tight text-ink group-hover:text-rust transition-colors">
                    {item.name}
                  </h3>
                  <span className="leader" />
                  <span className="font-serif font-semibold text-lg shrink-0 text-ink">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-[13px] mt-1 leading-snug line-clamp-2 text-ink-soft">{item.description}</p>
              </div>
              {/* e.g      /order/cafe-bella/12/item/2  */}
              <Link to={`/item/${item.id}`}>
                <div className="flex items-center justify-end gap-1 mt-2 text-xs font-semibold text-brass">
                  <span>View Item</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>



      <StickyBottomBar
  type="menu"
  visible={cartCount > 0}
  count={cartCount}
  amount={cartTotal}
/>
    </div>
  );
}