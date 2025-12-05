'use client'
import React, { useState, useRef, useEffect, Suspense } from 'react'
import { Box, TextField, IconButton, Paper, Typography, Avatar, CircularProgress, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import MainLayout from '../(root)/layout'
import ProductDetailsDialog from '../(root)/components/ProductDetailsDialog'
import renderSearchResults from '../(root)/components/results'
import { useSearchParams } from 'next/navigation'

interface SearchResult {
  id: string
  score: number
  metadata: {
    product_id: string
    item_num: string
    specs: string
    dims: string
    material_finishing: string
    img_paths: string // JSON string
    [key: string]: any
  }
}

interface SearchResponse {
  status: string
  matches: SearchResult[]
}

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  image?: string
  timestamp: Date
  searchResults?: SearchResult[]
}

const SearchContent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<SearchResult | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()

  // Get individual params
  const topK = searchParams.get('top_k') // Returns string or null
  const confT = searchParams.get('conf_t')
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const clearSelectedImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const base64ToBlob = (base64: string): Blob => {
    const byteString = atob(base64.split(',')[1])
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
  }

  const searchHybrid = async (text: string, image?: string | null): Promise<SearchResult[]> => {
    try {
      const formData = new FormData()
      if (image) {
        const blob = base64ToBlob(image)
        formData.append('file', blob, 'image.jpg')
      }

      const headers: HeadersInit = {
        accept: 'application/json'
      }

      if (!image) {
        headers['Content-Type'] = 'application/json'
      }

      const response = await fetch(
        `https://534543ca1206.ngrok-free.app/api/search/hybrid?text=${text}&top_k=${topK || 3}&conf_t=${confT || 0.3}`,
        {
          method: 'POST',
          headers: headers,
          body: image ? formData : undefined
        }
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: SearchResponse = await response.json()
      return data.matches || []
    } catch (error) {
      console.error('Search failed:', error)
      return []
    }
  }

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !selectedImage) || isLoading) return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      image: selectedImage || undefined,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputValue('')
    setSelectedImage(null)
    setIsLoading(true)

    try {
      const results = await searchHybrid(newUserMessage.content, newUserMessage.image)

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content:
          results.length > 0
            ? `Found ${results.length} matches for your search.`
            : "Sorry, I couldn't find any matches.",
        timestamp: new Date(),
        searchResults: results
      }
      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, something went wrong while searching.',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedProduct(null)
  }

  return (
    <MainLayout>
      {/* Messages Area */}
      {messages.length > 0 && (
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            width: '100%',
            padding: '32px 24px',
            borderRadius: '16px',
            maxWidth: '900px',
            flexDirection: 'column',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            gap: 3,
            mb: 3,
            pr: 1,
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '4px'
            }
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                gap: 2,
                alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: message.type === 'user' ? '85%' : '100%',
                flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                width: message.searchResults ? '100%' : 'auto'
              }}
            >
              <Avatar
                sx={{
                  bgcolor: message.type === 'user' ? 'primary.main' : 'secondary.main',
                  width: 32,
                  height: 32,
                  flexShrink: 0
                }}
              >
                {message.type === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
              </Avatar>

              <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    backgroundColor: message.type === 'user' ? 'primary.light' : 'rgba(255,255,255,0.8)',
                    color: message.type === 'user' ? 'primary.contrastText' : 'text.primary',
                    maxWidth: '100%'
                  }}
                >
                  {message.image && (
                    <Box
                      component="img"
                      src={message.image}
                      alt="User upload"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        mb: message.content ? 1 : 0,
                        display: 'block'
                      }}
                    />
                  )}
                  {message.content && (
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </Typography>
                  )}
                </Paper>

                {message.searchResults && message.searchResults.length > 0 && (
                  <Box sx={{ mt: 1, width: '100%' }}>
                    {renderSearchResults(message.searchResults, setSelectedProduct, setIsDialogOpen)}
                  </Box>
                )}
              </Box>
            </Box>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', gap: 2, alignSelf: 'flex-start' }}>
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  width: 32,
                  height: 32
                }}
              >
                <SmartToyIcon fontSize="small" />
              </Avatar>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CircularProgress size={20} color="inherit" />
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
      )}
      {messages.length > 0 ? (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: '900px' }}>
          {selectedImage && (
            <Box
              sx={{
                position: 'absolute',
                top: -70,
                left: 10,
                zIndex: 10,
                bgcolor: 'rgba(255,255,255,0.9)',
                p: 0.5,
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <Box
                component="img"
                src={selectedImage}
                alt="Preview"
                sx={{
                  height: 60,
                  width: 'auto',
                  borderRadius: 1
                }}
              />
              <IconButton
                size="small"
                onClick={clearSelectedImage}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -12,
                  bgcolor: 'background.paper',
                  border: '1px solid #ddd',
                  '&:hover': { bgcolor: '#f5f5f5' },
                  width: 20,
                  height: 20
                }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          )}

          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileSelect}
            onClick={(e) => ((e.target as HTMLInputElement).value = '')}
          />

          <TextField
            fullWidth
            placeholder="Search here.."
            multiline
            maxRows={4}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                borderRadius: '30px',
                paddingRight: '4px',
                '& fieldset': {
                  border: 'none'
                },
                '&:hover fieldset': {
                  border: 'none'
                },
                '&.Mui-focused fieldset': {
                  border: 'none'
                }
              },
              '& .MuiOutlinedInput-input': {
                padding: '8px px',
                fontSize: '15px',
                color: '#333',
                '&::placeholder': {
                  color: '#999',
                  opacity: 1
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      onClick={triggerFileSelect}
                      sx={{
                        backgroundColor: '#5b8ec4',
                        color: '#ffffff',
                        width: '40px',
                        height: '40px',
                        mr: 1,
                        '&:hover': {
                          backgroundColor: '#4a7ab0'
                        }
                      }}
                    >
                      <CameraAltIcon sx={{ fontSize: '20px' }} />
                    </IconButton>
                    {inputValue.trim() && (
                      <IconButton
                        onClick={handleSendMessage}
                        sx={{
                          backgroundColor: '#5b8ec4',
                          color: '#ffffff',
                          width: '40px',
                          mr: 1,
                          height: '40px',
                          '&:hover': {
                            backgroundColor: '#4a7ab0'
                          }
                        }}
                      >
                        <SendIcon sx={{ fontSize: '20px' }} />
                      </IconButton>
                    )}
                  </Box>
                </InputAdornment>
              )
            }}
          />
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: '900px', // Removed to let Grid control width
            // mt: 5, // Managed by Grid spacing
            minHeight: '0vh',
            maxHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 24px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ marginBottom: '24px' }}>
              <Typography
                style={{
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 500,
                  textAlign: 'center',
                  margin: 0
                }}
              >
                Search
              </Typography>
            </Box>
          )}

          {/* Input Area */}
          <Box sx={{ position: 'relative' }}>
            {selectedImage && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -70,
                  left: 10,
                  zIndex: 10,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  p: 0.5,
                  borderRadius: 1,
                  boxShadow: 1
                }}
              >
                <Box
                  component="img"
                  src={selectedImage}
                  alt="Preview"
                  sx={{
                    height: 60,
                    width: 'auto',
                    borderRadius: 1
                  }}
                />
                <IconButton
                  size="small"
                  onClick={clearSelectedImage}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: 'background.paper',
                    border: '1px solid #ddd',
                    '&:hover': { bgcolor: '#f5f5f5' },
                    width: 20,
                    height: 20
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            )}

            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
              onClick={(e) => ((e.target as HTMLInputElement).value = '')}
            />

            <TextField
              fullWidth
              placeholder="Search here.."
              multiline
              maxRows={4}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  borderRadius: '30px',
                  paddingRight: '4px',
                  '& fieldset': {
                    border: 'none'
                  },
                  '&:hover fieldset': {
                    border: 'none'
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none'
                  }
                },
                '& .MuiOutlinedInput-input': {
                  padding: '8px px',
                  fontSize: '15px',
                  color: '#333',
                  '&::placeholder': {
                    color: '#999',
                    opacity: 1
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        onClick={triggerFileSelect}
                        sx={{
                          backgroundColor: '#5b8ec4',
                          color: '#ffffff',
                          width: '40px',
                          mr: 1,
                          height: '40px',
                          '&:hover': {
                            backgroundColor: '#4a7ab0'
                          }
                        }}
                      >
                        <CameraAltIcon sx={{ fontSize: '20px' }} />
                      </IconButton>
                      {inputValue.trim() && (
                        <IconButton
                          onClick={handleSendMessage}
                          sx={{
                            backgroundColor: '#5b8ec4',
                            color: '#ffffff',
                            width: '40px',
                            mr: 1,
                            height: '40px',
                            '&:hover': {
                              backgroundColor: '#4a7ab0'
                            }
                          }}
                        >
                          <SendIcon sx={{ fontSize: '20px' }} />
                        </IconButton>
                      )}
                    </Box>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Paper>
      )}

      <ProductDetailsDialog open={isDialogOpen} onClose={handleCloseDialog} product={selectedProduct} />
    </MainLayout>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
