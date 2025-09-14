import { FC } from 'react'

interface LoadingSpinnerProps {
  message?: string
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative w-12 h-12 mx-auto">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-[#4A73D1] border-r-[#DB1B28] rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-gray-600">{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
