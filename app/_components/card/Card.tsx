import React, { FC, ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const Card: FC<CardProps> = ({ title, children, className }) => {
  return (
    <div
      className={`w-full h-auto bg-white p-4 my-4 mx-3 rounded-lg shadow-lg ${className}`}
    >
      <p className="text-lg font-workSans text-center uppercase font-semibold mb-4 truncate">
        {title}
      </p>
      {children}
    </div>
  );
};

export default Card;
