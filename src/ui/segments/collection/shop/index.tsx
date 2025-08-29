export default function Shop() {
  return (
    <div className="text-center space-y-8">
      <h1 className="text-6xl font-bold font-fuzar">Shop</h1>
      <div className="space-y-4 text-xl">
        <div className="hover:text-gray-600 cursor-pointer transition-colors duration-200">
          Small Package - $59
        </div>
        <div className="hover:text-gray-600 cursor-pointer transition-colors duration-200">
          Medium Package - $119
        </div>
        <div className="hover:text-gray-600 cursor-pointer transition-colors duration-200">
          Large Package - $199
        </div>
      </div>
    </div>
  );
}
