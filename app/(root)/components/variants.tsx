'use client'
import React, { useCallback, useState } from 'react'

import {
  Box,
  DialogContent,
  Typography,
  CardMedia,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip
} from '@mui/material'
import { ProductResult } from '@/app/config/type'
import ProductDetailsDialog from './ProductDetailsDialog'
import { RemoveRedEye } from '@mui/icons-material'

interface Variant {
  result: ProductResult
  imageUrl: string
}
const Variants = ({ result, imageUrl }: Variant) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductResult | undefined>(undefined)
  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false)
    setSelectedProduct(undefined)
  }, [])

  const handleClickVariant = useCallback(
    (id: string) => {
      let filteredResult: ProductResult | undefined
      if (result.fullData) {
        filteredResult = result.fullData.find((v) => v.id === id)
      }
      setSelectedProduct(filteredResult)
      setIsDialogOpen(true)
    },
    [result]
  )

  return (
    <DialogContent sx={{ p: 0, bgcolor: 'white' }}>
      {/* Product Image */}
      <Box
        sx={{
          width: '100%',
          height: '290px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid #e0e0e0',
          mb: 3,
          backgroundColor: '#f5f5f5' // Background for empty space
        }}
      >
        {imageUrl ? (
          <CardMedia
            component="img"
            height="290px"
            image={imageUrl}
            alt={result.metadata.item_num}
            sx={{
              objectFit: 'contain',
              width: '100%',
              height: '100%'
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography color="text.secondary">No Image Available</Typography>
          </Box>
        )}
      </Box>

      {/* Details Grid */}
      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          p: 3
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Below are variations of the image:
        </Typography>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Dimensions</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Item No.</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Volume</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              '& tr': {
                // Applies border to the top of every row
                borderTop: '1px solid #e0e0e0'
              },
              '& tr:first-of-type': {
                // Optional: Remove border from the first row if you want it
                // to sit flush against the TableHead
                borderTop: 'none'
              }
            }}
          >
            {result.hasVariation &&
              result.variations &&
              result.variations.length > 0 &&
              result.variations.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    // cursor: 'pointer',
                    '&:hover': { bgcolor: '#f9f9f9' } // Optional: adds a hover effect
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.dims?.split('1.')[0] || 'N/A'}
                  </TableCell>
                  <TableCell>{row.exw_quotes_per_pc ? row.exw_quotes_per_pc.toFixed(0) : 'N/A'}</TableCell>
                  <TableCell>{row.item_num}</TableCell>
                  <TableCell>{row.u_vol}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details" color="primary" placement="top">
                      <IconButton onClick={() => handleClickVariant(row.id)}>
                        <RemoveRedEye color="primary" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>

      {selectedProduct && (
        <ProductDetailsDialog open={isDialogOpen} onClose={handleCloseDialog} product={selectedProduct} back={true} />
      )}
    </DialogContent>
  )
}

export default Variants
