'use client'

import { Paper, Box, Typography, Slider, Stack } from '@mui/material'

export type NumResults = number | 'all'

interface ConfigurationProps {
  numResults: NumResults
  setNumResults: (numResults: NumResults) => void
  confidence: number
  setConfidence: (confidence: number) => void
  onClose?: () => void
}

const Configuration = ({ numResults, setNumResults, confidence, setConfidence }: ConfigurationProps) => {
  // Convert "all" → 10 for slider
  const sliderNumResults = numResults === 'all' ? 10 : numResults

  const handleNumResultsChange = (_: Event, newValue: number | number[]) => {
    const value = newValue as number
    setNumResults(value === 10 ? 'all' : value)
  }

  const handleConfidenceChange = (_: Event, newValue: number | number[]) => {
    setConfidence(newValue as number)
  }

  return (
    <Paper
      elevation={3}
      sx={{
        minHeight: '0vh',
        maxHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white'
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="medium">
          Configuration
        </Typography>
      </Stack>

      {/* No. of Results */}
      <Box mb={3}>
        <Typography variant="body2" gutterBottom sx={{ opacity: 0.9 }}>
          No. of Results
        </Typography>

        <Slider
          value={sliderNumResults}
          onChange={handleNumResultsChange}
          min={1}
          max={10}
          step={1}
          marks={[
            { value: 1, label: '1' },
            { value: 10, label: 'All' }
          ]}
          valueLabelDisplay="on"
          valueLabelFormat={(value) => (value === 10 ? 'All' : value)}
          sx={{
            color: '#90caf9',
            height: 8,
            '& .MuiSlider-track': {
              border: 'none'
            },
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit'
              },
              '&:before': {
                display: 'none'
              }
            },
            '& .MuiSlider-valueLabel': {
              lineHeight: 1.2,
              fontSize: 12,
              background: 'unset',
              padding: 0,
              width: 32,
              height: 32,
              borderRadius: '50% 50% 50% 0',
              backgroundColor: '#fff',
              color: '#000',
              transformOrigin: 'bottom left',
              transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
              '&:before': { display: 'none' },
              '&.MuiSlider-valueLabelOpen': {
                transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
              },
              '& > *': {
                transform: 'rotate(45deg)'
              }
            }
          }}
        />
      </Box>

      {/* Confidence Threshold */}
      <Box>
        <Typography variant="body2" gutterBottom sx={{ opacity: 0.9 }}>
          Confidence Threshold
        </Typography>

        <Slider
          value={confidence}
          onChange={handleConfidenceChange}
          min={0}
          max={1}
          step={0.1}
          valueLabelDisplay="on"
          sx={{
            color: '#90caf9',
            height: 8,
            '& .MuiSlider-track': {
              border: 'none'
            },
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit'
              },
              '&:before': {
                display: 'none'
              }
            },
            '& .MuiSlider-valueLabel': {
              lineHeight: 1.2,
              fontSize: 12,
              background: 'unset',
              padding: 0,
              width: 32,
              height: 32,
              borderRadius: '50% 50% 50% 0',
              backgroundColor: '#fff',
              color: '#000',
              transformOrigin: 'bottom left',
              transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
              '&:before': { display: 'none' },
              '&.MuiSlider-valueLabelOpen': {
                transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
              },
              '& > *': {
                transform: 'rotate(45deg)'
              }
            }
          }}
        />
      </Box>
    </Paper>
  )
}

export default Configuration
