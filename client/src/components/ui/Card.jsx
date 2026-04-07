const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-6 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
};

export default Card;
