"use client";

import { Typography, Button, Box, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import SearchComponent from "./sections/search";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

// useEffect(() => {
//  router.push()
// }, [])


  return (
    <>
     <SearchComponent />
    </>
      
  );
}
