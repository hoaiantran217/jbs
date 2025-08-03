import React from 'react'

import video from '../../assets/video/jbs.mp4'

export default function VideoSection() {
  return (
    <div className='max-w-[350px] w-full h-[150px] absolute -bottom-28 left-1/2 -translate-x-1/2 z-20'>
        <video src={video} autoPlaymuted loop className='w-full h-full object-cover' />
        <div className='absolute top-0 left-0 w-full h-full bg-black/10' />
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center text-center text-white'>
            {/* <h1 className='text-white text-sm font-bold'>Toàn cảnh hệ thống JBS</h1> */}
        </div>
    </div>
  )
}