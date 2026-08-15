// RestaurantsPage.jsx
import React, { useState, useMemo } from 'react';
import { MapPin, Search, Building2 } from 'lucide-react';
import Toolbar from '../../../components/Toolbar';
import StatusBadge from '../../../components/ui/StatusBadge';

export default function RestaurantsPage() {
  const [restaurants] = useState([
    { id: 1, name: 'Bella Italia #1', tenant: 'Foodie Group LLC', status: 'Active', cuisine: 'Italian • Pizza', address: '123 Culinary Ave, Food City', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'Taco Haven', tenant: 'Quick Eats Inc', status: 'Active', cuisine: 'Mexican • Street Food', address: '456 Salsa Blvd, Metro', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Bistro Luxe', tenant: 'Bistro Holdings', status: 'Active', cuisine: 'French • Fine Dining', address: '89 Rue de Paris, Uptown', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Sakura Sushi', tenant: 'Foodie Group LLC', status: 'Inactive', cuisine: 'Japanese • Sushi', address: '789 Blossom St, Downtown', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80' },
    { id: 5, name: 'Burger Station', tenant: 'Quick Eats Inc', status: 'Active', cuisine: 'American • Burgers', address: '101 Grill Lane, Suburbia', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80' },
    { id: 6, name: 'Green Cafe', tenant: 'Bistro Holdings', status: 'Inactive', cuisine: 'Healthy • Vegan', address: '303 Fresh Way, Eco District', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tenant.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [restaurants, searchQuery, statusFilter]);

  return (
    <div className="p-2 sm:p-4 space-y-6 bg-gray-50 dark:bg-slate-950 min-h-screen text-gray-900 dark:text-slate-100 transition-colors duration-200">      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Restaurants</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-200">Overview of all active store locations across platform tenants.</p>
      </div>

      {/* FILTER & SEARCH BAR - Using Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by name, cuisine, tenant..."
          filters={['All', 'Active', 'Inactive']}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </div>

      {/* RESTAURANTS CARDS GRID */}
      {filteredRestaurants.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-sm transition-colors duration-200">
          No restaurants match your current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                {/* Image Header */}
                <div className="h-40 bg-gray-200 dark:bg-slate-800 relative overflow-hidden transition-colors duration-200">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-200">{restaurant.name}</h3>
                    <StatusBadge
                      status={restaurant.status} 
                      size="xs"
                    />
                  </div>

                  {/* Tenant Tag */}
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-3 transition-colors duration-200">
                    <Building2 className="w-3.5 h-3.5" /> {restaurant.tenant}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1 mb-4 truncate transition-colors duration-200">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400 dark:text-slate-500 transition-colors duration-200" /> {restaurant.address}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}