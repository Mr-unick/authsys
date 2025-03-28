import React from 'react';
import { cn } from "../../../../components/lib/utils";

const variants = {
  default: "min-w-[10rem] text-gray-700",
  badge: "min-w-[10rem]",
  color: "flex items-center gap-2",
  list: "w-full"
};

const badgeVariants = {
  active: "bg-green-500",
  inactive: "bg-red-500",
  pending: "bg-yellow-500",
  draft: "bg-gray-500"
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
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white",
              badgeVariants[children ? "active" : 'inactive'] || "bg-gray-500",
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
              className="w-6 h-6 rounded-full border border-gray-200" 
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
                    className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700"
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
        "px-4 py-3 text-start border-y border-gray-200",
        type === 'list' && "max-w-xs",
        className
      )}
      {...props}
    >
      {renderContent()}
    </td>
  );
}