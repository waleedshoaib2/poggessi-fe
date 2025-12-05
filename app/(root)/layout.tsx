"use client";

import { AppBar, Box, Toolbar, Typography, Button, useTheme, IconButton, Popover } from "@mui/material";
import Link from "next/link";
import { MAIN_GRADIENT } from "../libs/mui/theme/palette";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LeftSidebar from "./sections/leftSidebar";

import { useRouter, useSearchParams } from "next/navigation";

function MainLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [height, setHeight] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [numResults, setNumResults] = useState(3);
  const [confidence, setConfidence] = useState(0.3);
    const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    // Set initial height
    setHeight(window.innerHeight);

    // Update on resize
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  // const toolbarHeight = theme.mixins.toolbar;
   const handleNumResultsChange = (value: number) => {
    setNumResults(value);
    updateURL('top_k', value.toString());
  };

  const handleConfidenceChange = (value: number) => {
    setConfidence(value);
    updateURL('conf_t', value.toString());
  };

  const updateURL = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(param, value);
    router.push(`?${params.toString()}`);
  };


  return (
    <>
      <AppBar position="static" sx={{
        backgroundImage: MAIN_GRADIENT
      }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
          {/* Empty box for left spacing to keep logo centered */}
          <Box sx={{ width: 48 }} />
          
          {/* Centered Logo */}
          <Image alt="" src={'/logo.png'} width={120} height={60}/>
          
          {/* Settings Icon on the right */}
          <IconButton
            color="inherit" 
            aria-label="settings"
            sx={{ color: 'white' }}
           onClick={handleSettingsClick}
          >
            <SettingsOutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            mt: 1,
          }
        }}
      >
        <LeftSidebar 
         numResults={numResults}
          setNumResults={handleNumResultsChange}
          confidence={confidence}
          setConfidence={handleConfidenceChange}
          onClose={handleClose}
        />
      </Popover>

      <Box 
        sx={{ 
          // height: '695px',
          height: `calc(${height}px - 95px)`,
          // Correct way to set background image
          backgroundImage: 'url(/main.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
           justifyContent: 'center',
          overflow: 'auto',
          p: 3,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainLayoutContent>{children}</MainLayoutContent>
    </Suspense>
  );
}