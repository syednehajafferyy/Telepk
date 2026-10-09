import React, { useState } from 'react';
import { Package } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  stageClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  stageClassName = '',
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  // Default clean SVG fallback stage if image fails
  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 flex flex-col items-center justify-center p-4 rounded-xl select-none ${stageClassName}`}
        title={alt}
      >
        <Package className="w-8 h-8 text-slate-400 mb-1 animate-pulse" />
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight text-center">
          TeleX Verified Hardware
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={(e) => {
        setHasError(true);
        if (onError) onError(e);
      }}
      className={`object-contain p-3 w-full h-full transition-all duration-300 ${className}`}
      {...props}
    />
  );
};

export default SafeImage;
