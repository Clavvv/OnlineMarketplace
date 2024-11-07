
export default function ProductLoadingCard(){
    return (
        <div className="animate-pulse">
          <div className="w-64 h-56 p-4 bg-gray-200 rounded-md"></div>
          <div className="space-y-3 mt-4">
            <div className="h-4 bg-gray-400 rounded w-3/4"></div>
            <div className="h-4 bg-gray-400 rounded w-1/2"></div>
            <div className="h-4 bg-gray-400 rounded w-1/3"></div>
          </div>
        </div>
    );
}