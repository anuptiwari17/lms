import { FC } from 'react'
import { Sparkles } from 'lucide-react'
interface LoadingSpinnerProps {
  message: string
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative w-20 h-20 mx-auto">
          {/* Base spinning border */}
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-spin"></div>

          {/* Colored spinning layer */}
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-[#4A73D1] border-r-[#DB1B28] rounded-full animate-spin"></div>

          {/* Center Sparkles Icon */}
          <div className="absolute top-0 left-0 w-20 h-20 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-[#4A73D1]" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{message}</h3>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-600">Preparing your view</span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-[#4A73D1] rounded-full animate-pulse"></div>
              <div
                className="w-1.5 h-1.5 bg-[#DB1B28] rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-[#4A73D1] rounded-full animate-pulse"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
