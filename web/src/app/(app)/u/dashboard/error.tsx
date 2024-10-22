'use client' // Ensure this is the very first line

import { useEffect } from 'react'

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className='flex flex-col justify-center items-center text-center px-16 py-16 mx-auto'>
      <h2 className='font-semibold text-center text-2xl'>Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        aria-label='Try again to recover from the error'
      >
        Try again
      </button>
    </div>
  )
}
