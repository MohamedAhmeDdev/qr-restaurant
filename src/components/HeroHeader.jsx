import React, { useState, useEffect, useCallback } from 'react';
import { getImageUrl } from '../utils/getImageUrl';
import { useParams } from 'react-router-dom';
import RestaurantService from '../services/RestaurantDetails';

export default function HeroHeader() {
  const { restaurantSlug, tableSlug } = useParams();
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRestaurantData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await RestaurantService.getRestaurantDetails(restaurantSlug);
      
      setRestaurantData(res);
    } catch (err) {
      console.error('Failed to fetch hero restaurant details:', err);
    } finally {
      setLoading(false);
    }
  }, [restaurantSlug]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  if (loading) {
    return (
      <div className="w-full h-72 sm:h-80 bg-hairline relative animate-pulse">
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 space-y-3">
          <div className="h-4 bg-paper/30 rounded w-28" />
          <div className="h-10 bg-paper/40 rounded w-2/3" />
          <div className="h-3 bg-paper/20 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!restaurantData) return null;

  return (
    <div className="relative w-full h-72 sm:h-80 shrink-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center w-full h-full"
        style={{ backgroundImage: `url('${getImageUrl(restaurantData.background_image)}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#182019]/55 via-[#182019]/35 to-[#182019]/92" />

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 animate-fade-in-up">
        {/* Table Tag Badge (Rendered only if tableSlug exists) */}
        {tableSlug && (
          <span className="inline-block px-2.5 py-1 mb-2 text-xs font-semibold tracking-wider uppercase text-paper bg-paper/20 rounded-full backdrop-blur-sm border border-paper/10">
            Table {tableSlug}
          </span>
        )}

        <h1 className="font-serif italic text-4xl sm:text-5xl leading-none text-paper font-medium">
          {restaurantData.name}
        </h1>
        <p className="text-sm mt-2 text-paper/65">Tap any dish to customize and add to your table order.</p>
      </div>
    </div>
  );
}