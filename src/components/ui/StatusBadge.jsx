// components/StatusBadge.jsx
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function StatusBadge({ 
  status, 
  activeLabel = 'Active', 
  inactiveLabel = 'Inactive',
  activeColor = 'emerald',
  inactiveColor = 'rose',
  showIcon = true,
  size = 'sm'
}) {
  const isActive = status === 'Active' || status === 'active';
  
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-900'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-900'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-900'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-900'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-900'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-900'
    },
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-950',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-900'
    }
  };

  const colors = isActive ? colorMap[activeColor] : colorMap[inactiveColor];
  
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const Icon = isActive ? CheckCircle : XCircle;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border transition-colors duration-200 ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]}`}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
}