// components/Button.js
const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
    >
      {children}
    </button>
  );
};

export default Button;