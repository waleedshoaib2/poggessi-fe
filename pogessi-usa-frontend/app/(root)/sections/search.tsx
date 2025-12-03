import React from 'react';
import { Box, TextField, InputAdornment, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const SearchComponent: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleCameraClick = () => {
    console.log('Camera icon clicked');
  };

  return (
    
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: '550px',
          mt: 10,
          padding: '32px 24px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Box sx={{ marginBottom: '24px' }}>
          <h2
            style={{
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 500,
              textAlign: 'center',
              margin: 0,
            }}
          >
            Search
          </h2>
        </Box>

        <TextField
          fullWidth
          placeholder="Search here.."
          value={searchValue}
          onChange={handleSearchChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
              borderRadius: '50px',
              paddingRight: '8px',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
              },
            },
            '& .MuiOutlinedInput-input': {
              padding: '14px 16px',
              fontSize: '15px',
              color: '#333',
              '&::placeholder': {
                color: '#999',
                opacity: 1,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#666', marginLeft: '8px' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleCameraClick}
                  sx={{
                    backgroundColor: '#5b8ec4',
                    color: '#ffffff',
                    width: '40px',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#4a7ab0',
                    },
                  }}
                >
                  <CameraAltIcon sx={{ fontSize: '20px' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
 
  );
};

export default SearchComponent;