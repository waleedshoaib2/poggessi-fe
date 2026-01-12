'use client'
import { ProductResult } from '@/app/config/type'
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
const renderSearchResults = (
  results: ProductResult[],
  setSelectedProduct: (product: ProductResult) => void,
  setIsDialogOpen: (open: boolean) => void
) => {
  const handleProductClick = (product: ProductResult) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }
  return (
    <Card sx={{ mt: 2, bgcolor: 'background.paper', padding: '16px', borderRadius: 4 }}>
      <Grid container spacing={2}>
        {results.map((result) => {
          return (
            <Grid
              size={{
                xs: 12,
                sm: results.length === 1 ? 6 : 6,
                md: results.length === 1 ? 12 : results.length === 2 ? 6 : results.length === 3 ? 4 : 4
              }}
              key={result.id}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  width: { xs: '100%', sm: '250px', md: '250px' },
                  bgcolor: '#fff',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6
                  }
                }}
                onClick={() => handleProductClick(result)}
              >
                {result.metadata.signed_urls.length > 0 && (
                  <CardMedia
                    component="img"
                    height="170"
                    image={result.metadata.signed_urls[0]}
                    alt={result.metadata.item_num}
                    sx={{
                      objectFit: 'contain', // Shows complete image without cropping
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                      backgroundColor: '#f5f5f5' // Optional: add background color for empty space
                    }}
                  />
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    {`Item No: ${result.metadata.item_num}`}
                  </Typography>
                  {/* 
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {`Price: ${
                      result.metadata?.exw_quotes_per_pc ? result.metadata.exw_quotes_per_pc.toFixed(0) : '--'
                    }$ | Similarity: ${(result.score * 100).toFixed(2)}%`}
                  </Typography> */}
                  <Typography variant="body2" sx={{ mb: 1 }} align="center" textAlign="center">
                    {`Price: ${
                      result.metadata?.exw_quotes_per_pc ? result.metadata.exw_quotes_per_pc.toFixed(0) : '--'
                    }$`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Card>
  )
}

export default renderSearchResults
