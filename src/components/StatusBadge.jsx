import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Ban, 
  Palmtree, 
  Slash,
  HelpCircle,
  Asterisk,
  MinusCircle
} from 'lucide-react';

// Status configurations
const STATUS_CONFIGS = {
  // Staff & User Statuses
  active: {
    label: 'Active',
    color: 'emerald',
    icon: CheckCircle2,
  },
  on_leave: {
    label: 'On Leave',
    color: 'amber',
    icon: Palmtree,
  },
  deactivated: {
    label: 'Deactivated',
    color: 'gray',
    icon: Ban,
  },

  // Availability / Item Statuses
  available: {
    label: 'Available',
    color: 'emerald',
    icon: CheckCircle2,
  },
  unavailable: {
    label: 'Unavailable',
    color: 'gray',
    icon: Slash,
  },
  sold_out: {
    label: 'Sold Out',
    color: 'rose',
    icon: XCircle,
  },

  // Modifier / Selection Requirement Statuses
  required: {
    label: 'Required',
    color: 'amber',
    icon: Asterisk,
  },
  optional: {
    label: 'Optional',
    color: 'gray',
    icon: MinusCircle,
  },

  // Operational / Order Statuses
  pending: {
    label: 'Pending',
    color: 'amber',
    icon: Clock,
  },
  suspended: {
    label: 'Suspended',
    color: 'rose',
    icon: AlertCircle,
  },
  inactive: {
    label: 'Deactivated',
    color: 'rose',
    icon: XCircle,
  },
};

// Tailwind Theme Mapping
const COLOR_MAP = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200/80 dark:border-emerald-800/50',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/50',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200/80 dark:border-green-800/50',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200/80 dark:border-rose-800/50',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200/80 dark:border-amber-800/50',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200/80 dark:border-blue-800/50',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200/80 dark:border-purple-800/50',
  },
  gray: {
    bg: 'bg-gray-100 dark:bg-gray-800/60',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
  },
};

const SIZE_CLASSES = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

const ICON_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export default function StatusBadge({
  status,
  label,
  color,
  icon: CustomIcon,
  showIcon = true,
  size = 'sm',
  className = '',
}) {
  // Normalize string status input or boolean checks
  const normalizedKey = typeof status === 'boolean' 
    ? (status ? 'active' : 'inactive') 
    : String(status || '').toLowerCase().trim();

  // Retrieve configuration or fallback to unknown defaults
  const defaultConfig = STATUS_CONFIGS[normalizedKey] || {
    label: status ? String(status).replace(/_/g, ' ') : 'Unknown',
    color: 'gray',
    icon: HelpCircle,
  };

  const finalLabel = label || defaultConfig.label;
  const finalColorKey = color || defaultConfig.color;
  const Icon = CustomIcon || defaultConfig.icon;
  const theme = COLOR_MAP[finalColorKey] || COLOR_MAP.gray;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border capitalize transition-colors duration-150 ${theme.bg} ${theme.text} ${theme.border} ${SIZE_CLASSES[size]} ${className}`}
    >
      {showIcon && Icon && <Icon className={ICON_SIZES[size]} />}
      <span>{finalLabel}</span>
    </span>
  );
}