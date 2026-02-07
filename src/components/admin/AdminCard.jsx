import React from 'react';

const AdminCard = ({ title, subtitle, icon: Icon, children, actions, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-9 h-9 rounded-lg bg-[#003366]/5 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#003366]" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-slate-800">{title}</h3>
              {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  );
};

export default AdminCard;
