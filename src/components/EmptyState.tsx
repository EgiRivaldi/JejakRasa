import React from "react";
import * as Icons from "lucide-react";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  id?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  id = "empty-state"
}) => {
  const IconComponent = (Icons as any)[icon] || Icons.Inbox;

  return (
    <div id={id} className="flex flex-col items-center justify-center text-center p-8 my-10 max-w-sm mx-auto">
      <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
        <IconComponent className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold transition-all shadow-sm shadow-indigo-100 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
