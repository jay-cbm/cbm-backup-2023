import { CMS_NAME } from '@/lib/constants';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-md overflow-hidden mr-2">
        <span className="text-xl font-bold">C</span>
        <div className="absolute w-3 h-3 bg-white rounded-full bottom-1 right-1"></div>
      </div>
      {showText && (
        <span className="text-2xl font-bold text-red-600">
          {CMS_NAME}
        </span>
      )}
    </div>
  );
}

export default Logo;
