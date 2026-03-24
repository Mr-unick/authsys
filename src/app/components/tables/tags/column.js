import React from 'react';
import { cn } from "../../../../components/lib/utils";

const variants = {
  default: "min-w-[10rem] max-sm:min-w-[5rem] text-slate-700 max-sm:text-xs",
  badge: "min-w-[10rem] max-sm:min-w-[5rem]",
  color: "flex items-center gap-2",
  list: "w-full"
};

const badgeVariants = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-slate-50 text-slate-500 border-slate-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  draft: "bg-slate-50 text-slate-500 border-slate-200"
};

export default function TD({ 
  children, type,
  className,
  ...props 
}) {
  const renderContent = () => {
    switch (type) {
      case 'default':
        return (
          <div className={cn(variants.default, className)}>
            {children}
          </div>
        );

      case 'badge':
        return (
          <div className={cn(variants.badge, className)}>
            <span className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border",
              badgeVariants[children ? "active" : 'inactive'] || "bg-slate-50 text-slate-500 border-slate-200",
              className
            )}>
              {children ? "Active" : 'Inactive'}
            </span>
          </div>
        );

      case 'color':
        return (
          <div className={cn(variants.color, className)}>
            <div 
              className="w-5 h-5 rounded-md border border-slate-200" 
              style={{ backgroundColor: children }}
            />
          </div>
        );

      case 'list':
        return (
          <div className={cn(variants.list, className)}>
            {Array.isArray(children) ? (
              <div className="flex flex-wrap gap-1">
                {children.map((item, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-xs text-slate-600 font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : children}
          </div>
        );

      default:
        return children;
    }
  };

  return (
    <td 
      className={cn(
        "px-5 py-3.5 text-start text-sm border-b border-slate-100",
        type === 'list' && "max-w-xs",
        className
      )}
      {...props}
    >
      {renderContent()}
    </td>
  );
}