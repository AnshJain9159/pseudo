"use client";
import Link from 'next/link'
import { Button } from 'components/ui/button';
 
export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center align-middle space-y-8'>
      <h2 className='text-4xl font-bold text-red-600'>Not Found</h2>
      <p className='text-2xl font-semibold text-black'>Could not find requested resource</p>
      <Link href="/">
        <Button variant={'outline'}>
            <span className='mr-2 text-2xl font-semibold'>Go Back</span>
        </Button>
      </Link>
    </div>
  )
}