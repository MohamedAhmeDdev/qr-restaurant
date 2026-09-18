import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Check, Info, AlertCircle, ImagesIcon, UtensilsCrossed } from 'lucide-react';
import '../../Customer.css';
import StickyBottomBar from '../../components/StickyBottomBar';

import { useCart } from '../../contexts/CartContext';
import guestApi from '../../services/guestApi';
import { getImageUrl } from '../../utils/getImageUrl';

export default function ItemDetailPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [specialNotes, setSpecialNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const runFetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await guestApi.get(`/menu/items/${itemId}`);
        const data = res.data?.data;

        setItem(data);

        const initialOptions = {};
        if (Array.isArray(data?.modifier_groups)) {
          data.modifier_groups.forEach((mod) => {
            if (mod.is_required && mod.max_selections === 1 && mod.options?.length > 0) {
              initialOptions[mod.id] = [mod.options[0].id];
            }
          });
        }
        setSelectedOptions(initialOptions);
      } catch (err) {
        console.error('Failed to fetch item:', err);
        setError(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    runFetch();
  }, [itemId]);

  const toggleOption = (mod, optionId) => {
    setSelectedOptions((prev) => {
      const current = prev[mod.id] || [];
      if (mod.max_selections === 1) {
        return { ...prev, [mod.id]: [optionId] };
      } else {
        if (current.includes(optionId)) {
          return { ...prev, [mod.id]: current.filter((id) => id !== optionId) };
        } else {
          return { ...prev, [mod.id]: [...current, optionId] };
        }
      }
    });
  };

  const finalPrice = useMemo(() => {
    if (!item) return 0;
    let unitPrice = item.price || 0;
    (item.modifier_groups || []).forEach((mod) => {
      const selectedIds = selectedOptions[mod.id] || [];
      selectedIds.forEach((optId) => {
        const opt = mod.options?.find((o) => o.id === optId);
        if (opt) unitPrice += opt.price || 0;
      });
    });
    return unitPrice * quantity;
  }, [item, selectedOptions, quantity]);

  const isReadyToAdd = useMemo(() => {
    if (!item) return false;
    return (item.modifier_groups || []).every((mod) => {
      if (!mod.is_required) return true;
      const selected = selectedOptions[mod.id] || [];
      return selected.length >= (mod.min_selections || 1);
    });
  }, [item, selectedOptions]);

  const handleAddToCart = () => {
    if (!isReadyToAdd || isAdding || !item) return;
    setIsAdding(true);

    const modifiersPayload = [];
    (item.modifier_groups || []).forEach((mod) => {
      const selectedIds = selectedOptions[mod.id] || [];
      selectedIds.forEach((optId) => {
        const opt = mod.options?.find((o) => o.id === optId);
        if (opt) {
          modifiersPayload.push({
            modifier_group_name: mod.name,
            modifier_option_name: opt.name,
            option_id: opt.id,
            price: opt.price,
          });
        }
      });
    });

    addItem({
      menu_item_id: item.id,
      name: item.name,
      image_url: item.image_url,
      quantity,
      unitPrice: finalPrice / quantity,
      special_instructions: specialNotes,
      modifiers: modifiersPayload,
    });

    setTimeout(() => {
      setIsAdding(false);
      navigate(-1);
    }, 600);
  };

  return (
    <div className="menu-root min-h-screen pb-36 bg-paper text-ink relative">
      {/* Back Button Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-40 px-5 py-4 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-paper/80 backdrop-blur-md text-ink hover:scale-105 active:scale-95 transition-all border border-hairline"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* 1. LOADING SKELETON STATE */}
      {loading ? (
        <div className="animate-pulse">
          <div className="w-full h-[40vh] sm:h-[46vh] bg-hairline/60" />
          <div className="px-5 pt-6 max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div className="h-8 bg-hairline/60 rounded-lg w-2/3" />
              <div className="h-8 bg-hairline/60 rounded-lg w-20" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-hairline/60 rounded w-full" />
              <div className="h-4 bg-hairline/60 rounded w-4/5" />
            </div>
            <div className="h-16 rounded-2xl bg-paper/80 border border-hairline" />
            <div className="space-y-4 pt-4">
              <div className="h-6 bg-hairline/60 rounded w-1/3" />
              <div className="h-12 bg-hairline/60 rounded-2xl" />
              <div className="h-12 bg-hairline/60 rounded-2xl" />
            </div>
          </div>
        </div>
      ) : error ? (
        /* 2. ERROR STATE */
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-rust/10 text-rust flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2 text-ink">Failed to Load Item</h2>
          <p className="text-sm text-ink-soft mb-6 max-w-xs">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-full bg-forest text-paper font-semibold text-sm active:scale-95 transition-all shadow-md hover:bg-forest/90"
          >
            Go Back
          </button>
        </div>
      ) : !item ? (
        /* 3. EMPTY / UNAVAILABLE STATE */
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-hairline text-ink-soft flex items-center justify-center mb-3">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2 text-ink">Item Unavailable</h2>
          <p className="text-sm text-ink-soft mb-6 max-w-xs">
            This menu item is currently unavailable or has been removed from the menu.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-full bg-forest text-paper font-semibold text-sm active:scale-95 transition-all shadow-md hover:bg-forest/90"
          >
            Back to Menu
          </button>
        </div>
      ) : (
        /* 4. ITEM DETAILS & MODIFIERS DISPLAY STATE */
        <>
          {/* Hero Banner */}
          <div className="relative w-full h-[40vh] sm:h-[46vh] shrink-0 overflow-hidden bg-forest/5">
            {item.image_url ? (
              <img src={getImageUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-forest/40">
                <ImagesIcon className="w-10 h-10 mb-2" />
                <span className="text-xs font-medium">No image available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          </div>

          {/* Details Body */}
          <div className="px-5 pt-6 relative z-10 max-w-2xl mx-auto animate-fade-up">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold leading-tight text-ink">{item.name}</h1>
              <span className="font-serif font-bold text-2xl sm:text-3xl shrink-0 text-brass pt-0.5">
                ${(item.price || 0).toFixed(2)}
              </span>
            </div>
            {item.description && (
              <p className="text-[15px] leading-relaxed pb-6 text-ink-soft font-normal">{item.description}</p>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between py-4 px-5 mb-6 rounded-2xl bg-paper/80 border border-hairline/80 shadow-sm backdrop-blur-sm">
              <span className="font-serif font-semibold text-base text-ink">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-hairline text-ink bg-paper hover:bg-hairline/30 active:scale-90 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-serif font-bold text-lg w-6 text-center tabular-nums text-ink">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-forest text-paper active:scale-90 shadow-sm hover:bg-forest/90 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="border-t border-hairline/80 my-6" />

            {/* Modifiers List */}
            <div className="space-y-8 mt-6">
              {(item.modifier_groups || []).map((mod, idx) => (
                <div key={mod.id} className="animate-fade-up" style={{ animationDelay: `${0.1 + idx * 0.08}s` }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-xl font-semibold flex items-center gap-2 text-ink">
                      {mod.name}
                      {mod.is_required ? (
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-rust bg-rust/10 border border-rust/20">
                          Required
                        </span>
                      ) : (
                        <span className="text-xs font-normal text-sage font-sans">(Optional)</span>
                      )}
                    </h3>
                  </div>
                  <div className="space-y-2.5">
                    {(mod.options || []).map((opt) => {
                      const isSelected = (selectedOptions[mod.id] || []).includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleOption(mod, opt.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 text-left ${
                            isSelected
                              ? 'border-forest bg-forest/5 shadow-sm ring-1 ring-forest/10'
                              : 'border-hairline/80 bg-paper/60 hover:bg-paper'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                                isSelected ? 'border-forest bg-forest text-paper' : 'border-hairline/80 bg-paper'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                            </div>
                            <span className="text-sm font-medium text-ink">{opt.name}</span>
                          </div>
                          <span className={`text-xs font-semibold ${isSelected ? 'text-forest' : 'text-brass'}`}>
                            {opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Free'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Special Instructions */}
              <div className="animate-fade-up" style={{ animationDelay: '0.35s' }}>
                <h3 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2 text-ink">
                  Special Requests <Info className="w-4 h-4 text-ink-soft" />
                </h3>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Allergies, extra crispy, etc..."
                  maxLength={200}
                  className="w-full p-4 text-[15px] rounded-2xl outline-none resize-none h-28 border border-hairline/80 bg-paper/60 text-ink placeholder:text-ink-soft/60 focus:bg-paper focus:border-forest focus:ring-2 focus:ring-forest/15 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <StickyBottomBar
            type="item"
            visible={true}
            count={quantity}
            amount={finalPrice}
            isDisabled={!isReadyToAdd}
            isLoading={isAdding}
            onAction={handleAddToCart}
            actionLabel="Add to Order"
            disabledLabel="Select Required Options"
          />
        </>
      )}
    </div>
  );
}