"use client";

import { AppBar, Box, Toolbar, Typography, Button, useTheme } from "@mui/material";
import Link from "next/link";
import { MAIN_GRADIENT } from "../libs/mui/theme/palette";
import Image from "next/image";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const toolbarHeight = theme.mixins.toolbar;
  
  return (
    <>
      <AppBar position="static" sx={{
        backgroundImage: MAIN_GRADIENT
      }}>
        <Toolbar sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Image alt="" src={'/logo.png'} width={120} height={60}/>
        </Toolbar>
      </AppBar>

      <Box 
        sx={{ 
          height: `calc(100vh - ${toolbarHeight.minHeight}px)`,
          // Correct way to set background image
          backgroundImage: 'url(/main.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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