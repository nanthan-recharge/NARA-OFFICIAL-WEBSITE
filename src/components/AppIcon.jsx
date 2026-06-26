import React from 'react';
import { HelpCircle } from 'lucide-react';
import { ICON_REGISTRY } from './iconRegistry';

function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {
    // Look up from the curated registry (tree-shaken) instead of the full lucide
    // library. Unknown names fall back to HelpCircle, same as before.
    const IconComponent = ICON_REGISTRY?.[name];

    if (!IconComponent) {
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}
export default Icon;