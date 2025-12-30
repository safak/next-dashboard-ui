import React from 'react';

type HighlightTextProps = {
  text: string;
  highlight: string;
};

const HighlightText = ({ text, highlight }: HighlightTextProps) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark
            key={index}
            className="bg-purple-200 text-purple-800 rounded px-1"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default HighlightText;
