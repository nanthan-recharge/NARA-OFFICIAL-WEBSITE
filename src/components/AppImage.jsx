import React from 'react';

/**
 * App image wrapper.
 * - Lazy-loads + async-decodes by default — big win on mobile and long pages.
 * - Pass `priority` for above-the-fold images (hero, header logo) so they load
 *   eagerly with high fetch priority instead of being lazy-loaded.
 */
function Image({
  src,
  alt = "Image Name",
  className = "",
  priority = false,
  loading,
  decoding,
  fetchPriority,
  ...props
}) {

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding={decoding ?? "async"}
      fetchPriority={fetchPriority ?? (priority ? "high" : "auto")}
      onError={(e) => {
        e.target.src = "/assets/images/no_image.png"
      }}
      {...props}
    />
  );
}

export default Image;
