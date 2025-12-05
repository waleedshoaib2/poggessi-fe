'use client'
import React from 'react'
import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Box, Grid, Divider, Stack } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'

interface ProductDetailsDialogProps {
  open: boolean
  onClose: () => void
  product: any // Using any to match the flexible metadata structure
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({ open, onClose, product }) => {
  if (!product) return null

  const { metadata, score } = product
  const imageUrl = metadata.signed_urls && metadata.signed_urls.length > 0 ? metadata.signed_urls[0] : ''

  console.log(product)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '16px',
          maxWidth: '800px'
        }
      }}
    >
      <DialogTitle sx={{ p: 0, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {`Item No:  ${metadata.item_num}` || 'N/A'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              Price: {metadata.exw_quotes_per_pc ? `$${parseFloat(metadata.exw_quotes_per_pc).toFixed(0)}` : 'N/A'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Similarity: {(score * 100).toFixed(0)}%
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Product Image */}
        <Box
          sx={{
            width: '100%',
            height: '400px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid #2196f3', // Blue border as seen in design
            mb: 3,
            position: 'relative'
          }}
        >
          {imageUrl ? (
            <Box
              sx={{
                width: '100%',
                height: '400px',
                overflow: 'auto', // scroll instead of crop
                position: 'relative'
              }}
            >
              <Image src={imageUrl} alt={metadata.item_num} fill style={{ objectFit: 'contain' }} />
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: '#f5f5f5',
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
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Item No.
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {metadata.item_num || 'N/A'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Specifications:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {metadata.specs || 'N/A'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Dimensions:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {metadata.dims.split('1.')[0] || 'N/A'}
              </Typography>
            </Grid>

            {/* Row 2 */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Request Date:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {metadata.request_date || '2024-11-24'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Quote Date:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {metadata.quote_date || '2024-11-26'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Factory Name:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {metadata.factory_name || 'MX'}
              </Typography>
            </Grid>

            {/* Row 3 */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Sample Status:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {metadata.sample_status || 'No Sample Request'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                MOQ Loading Qty:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {metadata.moq_loading_qty || '65'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Volume:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {metadata.volume || '0.3'}
              </Typography>
            </Grid>

            {/* Material - Full Width */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Material:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {metadata.material_finishing || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDetailsDialog
