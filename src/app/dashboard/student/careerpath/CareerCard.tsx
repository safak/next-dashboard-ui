import React from "react";

interface CareerCardProps {
  title: string;
  description: string;
  imageUrl: string;
  linkText: string;
  linkUrl: string;
}

const CareerCard: React.FC<CareerCardProps> = ({
  title,
  description,
  imageUrl,
  linkText,
  linkUrl,
}) => (
  <div className="bg-white p-6 transform transition-transform duration-500 hover:scale-105 rounded shadow-md w-full md:w-1/3 lg:w-1/4 mx-2 mb-4 flex flex-col overflow-hidden">
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-sm mb-4">{description}</p>
    <div className="relative overflow-hidden h-40">
      <img
        src={imageUrl}
        alt={title}
        className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
      />
    </div>
    <div className="mt-auto">
      <label className="block text-sm font-semibold mb-2">Learn More:</label>
      <a href={linkUrl} className="text-blue-500 hover:underline text-sm">
        {linkText}<br></br><br></br>
      </a>

    </div>
  </div>
);

export default CareerCard;
