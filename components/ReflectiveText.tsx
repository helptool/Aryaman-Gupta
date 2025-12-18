import React from 'react';

interface ReflectiveTextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType; 
  intensity?: number; // Ignored
  blur?: number; // Ignored
}

const ReflectiveText: React.FC<ReflectiveTextProps> = ({ 
  children, 
  className = "", 
  as: Component = "h2"
}) => {
  return (
    <div className={`relative group ${className}`}>
      <Component className="relative z-10 text-accent mix-blend-normal">
        {children}
      </Component>
    </div>
  );
};

export default ReflectiveText;
