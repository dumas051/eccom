'use client'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import BackButton from '@/components/BackButton'
import Image from 'next/image'
import { useEffect } from 'react'

const OrderPlaced = () => {

  const { router } = useAppContext()

  useEffect(() => {
    setTimeout(() => {
      router.push('/my-orders')
    }, 5000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 relative">
      <div className="absolute top-8 left-8 z-20"><BackButton /></div>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="relative flex flex-col items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-28 w-28 border-4 border-t-green-200 border-gray-200"></div>
          <Image className="absolute top-0 left-0 right-0 bottom-0 m-auto p-3" src={assets.checkmark} alt='' width={80} height={80} style={{objectFit:'contain'}} />
        </div>
        <div className="text-center text-xl font-semibold">Order Placed Successfully</div>
      </div>
    </div>
  )
}

export default OrderPlaced