import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Skip Link Component - WCAG 2.2 AA Requirement
 * Allows keyboard users to skip navigation and jump directly to main content
 */
const SkipLink = ({ targetId = 'main-content' }) => {
  const { t } = useTranslation('accessibility');

  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
      style={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 999999,
        padding: '1rem 1.5rem',
        backgroundColor: '#0ea5e9',
        color: '#ffffff',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
        borderRadius: '0 0 0.5rem 0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        outline: 'none',
        transition: 'all 0.2s ease'
      }}
      onFocus={(e) => {
        e.target.style.left = '0';
        e.target.style.top = '0';
      }}
      onBlur={(e) => {
        e.target.style.left = '-9999px';
      }}
    >
      {t('skipToMain')}
    </a>
  );
};

/**
 * Main Content Wrapper - Must be used with SkipLink
 * Provides the target anchor for skip link
 */
export const MainContent = ({ children, id = 'main-content' }) => {
  return (
    <main id={id} tabIndex={-1} role="main" aria-label="Main content">
      {children}
    </main>
  );
};

// Export both as named and default
export { SkipLink };
export default SkipLink;
