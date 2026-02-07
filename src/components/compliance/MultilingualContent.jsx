import React from 'react';

/**
 * MultilingualContent Component - WCAG 3.1.2 Compliance
 * Automatically adds lang attribute based on current language
 * Use this wrapper for any text content that changes based on language selection
 */
const MultilingualContent = ({ 
  language = 'en', 
  children, 
  as: Component = 'div',
  className = '',
  ...props 
}) => {
  return (
    <Component 
      lang={language} 
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};

export default MultilingualContent;

/**
 * Usage Example:
 * 
 * import MultilingualContent from './components/compliance/MultilingualContent';
 * 
 * function MyComponent() {
 *   const [language, setLanguage] = useState('en');
 *   
 *   return (
 *     <MultilingualContent language={language} as="section" className="my-class">
 *       <h1>{content[language].title}</h1>
 *       <p>{content[language].description}</p>
 *     </MultilingualContent>
 *   );
 * }
 */
