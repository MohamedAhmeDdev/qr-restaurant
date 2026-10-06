import React from 'react';
import {
  Mail, ShieldCheck, Building2, Store, Clock,
  Key, ClipboardList, LayoutGrid, BookOpen,
  ArrowUpRight, Layers, Tags, SlidersHorizontal,
  Users, BarChart3, Globe, Calendar,
  Tag,
  ImageIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/getImageUrl';

function Dashboard() {
  const { user } = useAuth();
  const restaurants = user.restaurants || [];


  if (!user) return null;


  const moduleIcons = {
    organization: Globe,
    restaurant: Store,
    staff: Users,
    table: LayoutGrid,
    category: Tags,
    modifier: SlidersHorizontal,
    menu: BookOpen,
    order: ClipboardList,
    report: BarChart3,
  };


  const groupedPermissions = (user.permissions || []).reduce((acc, perm) => {
    const [mod, ...rest] = perm.split('.');
    const action = rest.join('.');
    (acc[mod] = acc[mod] || []).push(action);
    return acc;
  }, {});

  const can = (perm) => user.permissions?.includes(perm);


  const quickActions = [
    { label: 'Orders', hint: 'Track & update', icon: ClipboardList, perm: 'order.view', to: '/app/orders' },
    { label: 'Tables', hint: 'Floor overview', icon: LayoutGrid, perm: 'table.view', to: '/app/table' },
    { label: 'Categories', hint: 'Browse Categories', icon: Tag, perm: 'category.view', to: '/app/categories' },
    { label: 'Menu', hint: 'Browse items', icon: BookOpen, perm: 'menu.view', to: '/app/menu-item' },
    { label: 'Modifiers', hint: 'Browse modifiers', icon: Layers, perm: 'modifier.view', to: '/app/modifier-groups' },
    { label: 'Staff', hint: 'Manage team', icon: Users, perm: 'staff.view', to: '/app/staff' },
    { label: 'Reports', hint: 'Sales & insights', icon: BarChart3, perm: 'report.view', to: '/app/report' },
    { label: 'Restaurants', hint: 'Manage restaurants', icon: Store, perm: 'restaurant.view', to: '/restaurant' },
  ].filter((a) => a.perm === null || can(a.perm));



  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">

      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 border-b border-slate-800">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 sm:pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-orange-400">
                  Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <h1 className="mt-1 text-sm lg::text-3xl font-semibold tracking-tight text-white capitalize">
                  Welcome, {user.name}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 ring-1 ring-white/10 backdrop-blur capitalize">
                {user.role.replace(/_/g, ' ')}
              </span>


              {restaurants[0]?.pivot?.shift_type && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 ring-1 ring-white/10 backdrop-blur capitalize">
                  {restaurants[0].pivot.shift_type} shift
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ===== Content (overlaps hero) ===== */}
      <main className="relative max-w-7xl mx-auto px-3  lg:px-4 -mt-12 pb-12 space-y-6">
        {/* ----- Info cards ----- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 capitalize">
          {[
            // Organization — only for org-level roles
            ...(!['restaurant_admin'].includes(user.role)
              ? [{
                label: 'Organization',
                icon: Building2,
                title: (user.organization?.name || '—').replace(/\b\w/g, (c) => c.toUpperCase()),
                sub: user.organization ? `@${user.organization.slug}` : 'Not assigned',
                mono: true,
              }]
              : []),
            {
              label: 'Account',
              icon: Mail,
              title: user.name,
              sub: user.email,
            },
            {
              label: 'Access Level',
              icon: ShieldCheck,
              title: user.role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              sub: `${(user.permissions || []).length} permissions granted`,
            },
          ].map((c) => (
            <div key={c.label} className="bg-white dark:bg-slate-900 rounded-md border border-slate-200/80 dark:border-slate-800 px-2 py-3 flex items-start gap-2">
              <div className="p-2.5 rounded-lg shrink-0">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs lg:text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {c.label}
                </p>
                <p className="mt-1 text-xs lg:text-sm font-semibold text-slate-900 dark:text-white truncate">{c.title}</p>
                <p className={`mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate ${c.mono ? 'font-mono' : ''}`}>
                  {c.sub}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* ----- Quick actions ----- */}
        {quickActions.length > 0 && (
          <section className="bg-white dark:bg-slate-900 rounded-md border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Shortcuts based on your permissions</p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="group relative text-left rounded-md border p-4 transition-all duration-200
      border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-500/40
   hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
      block"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg">
                      <a.icon className="h-4 w-4" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <p className="mt-3  text-xs lg:text-sm  font-semibold text-slate-900 dark:text-white">{a.label}</p>
                  <p className=" text-xs lg:text-sm  text-slate-500 dark:text-slate-400">{a.hint}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ----- Permissions + Restaurants ----- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Permissions */}
          <div className={`${restaurants.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white dark:bg-slate-900 rounded-md border border-slate-200/80 dark:border-slate-800 overflow-hidden`}>
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <Key className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Your Permissions</h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full px-2.5 py-1">
                {(user.permissions || []).length} total
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {Object.entries(groupedPermissions).length === 0 ? (
                <div className="px-5 sm:px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No permissions assigned.
                </div>
              ) : (
                Object.entries(groupedPermissions).map(([mod, actions]) => {
                  const ModIcon = moduleIcons[mod] || Layers;
                  return (
                    <div
                      key={mod}
                      className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <div className="flex items-center gap-3 sm:w-44 shrink-0">
                        <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <ModIcon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {mod.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {actions.map((action) => (
                          <span
                            key={action}
                            className="inline-flex items-center rounded-md px-2 py-1 text-xs bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
                          >
                            {action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Restaurants (only if the user has any) */}
          {restaurants.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200/80 dark:border-slate-800 overflow-hidden self-start">
              <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <Store className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Assigned Restaurants</h2>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full px-2.5 py-1">
                  {restaurants.length}
                </span>
              </div>

              <div className="p-4 sm:p-5 space-y-3">
                {restaurants.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 p-4 hover:border-orange-300 dark:hover:border-orange-500/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {r.logo ? (
                        <img
                          src={getImageUrl(r.logo)}
                          alt={r.name}
                          className="w-11 h-11 rounded-md object-cover border border-gray-100 dark:border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-md bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{r.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{r.slug}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {r.pivot?.shift_type && (
                        <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20 capitalize">
                          {r.pivot.shift_type} shift
                        </span>
                      )}

                      {r.pivot?.created_at && (
                        <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          <Calendar className="h-3 w-3" />
                          Joined{' '}
                          {new Date(r.pivot.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>

                    {r.pivot?.updated_at && (
                      <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-500">
                        <Clock className="h-3 w-3" />
                        Last updated{' '}
                        {new Date(r.pivot.updated_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;