'use client'

import { Box, Button, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import LoginLayout from '../(root)/login-layout'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Dummy credentials
    if (email && password) {
      router.push('/search')
    } else {
      alert('Invalid Credentials')
    }
  }

  return (
    <LoginLayout>
      <Box
        sx={{
          width: 400,
          mx: 'auto',
          mt: 10,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <Typography variant="h5" color="white" mb={3}>
          Login
        </Typography>

        <TextField fullWidth label="Email" margin="normal" placeholder="" onChange={(e) => setEmail(e.target.value)} />

        <TextField
          fullWidth
          type="password"
          label="Password"
          placeholder="Enter Password"
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
          Login
        </Button>
      </Box>
    </LoginLayout>
  )
}
