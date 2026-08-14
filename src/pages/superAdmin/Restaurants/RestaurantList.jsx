import React from 'react';
import { MapPin, Star, Utensils, Plus, Search, Filter } from 'lucide-react';

export default function RestaurantList() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurants</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
          <Plus className="w-4 h-4" /> Add Restaurant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div className="h-40 bg-gray-200 dark:bg-slate-800 relative overflow-hidden">
              <img 
                src={`https://placehold.co/600x400/e2e8f0/94a3b8?text=Restaurant+${i}`} 
                alt="Restaurant" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.8
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Bella Italia #{i}</h3>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Open</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1 mb-4">
                <MapPin className="w-3.5 h-3.5" /> 123 Culinary Ave, Food City
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5" /> Italian • Pizza
                </span>
                <button className="text-orange-600 text-sm font-medium hover:underline">Manage</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}