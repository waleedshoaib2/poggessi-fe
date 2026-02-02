'use client'

import { AppBar, Box, Toolbar } from '@mui/material'
import { MAIN_GRADIENT } from '../libs/mui/theme/palette'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  const [height, setHeight] = useState(() => {
    if (typeof window !== 'undefined') return window.innerHeight
    return 0
  })
  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundImage: MAIN_GRADIENT
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Image alt="" src={'/logo.png'} width={120} height={60} />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          // height: '695px',
          height: `calc(${height}px - 95px)`,
          // Correct way to set background image
          backgroundImage: 'url(/login.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          display: 'flex',
          objectFit: 'cover',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
          p: 3,
          boxSizing: 'border-box'
        }}
      >
        {children}
      </Box>
    </>
  )
}
