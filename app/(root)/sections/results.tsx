"use client";
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
interface SearchResult {
  id: string;
  score: number;
  metadata: {
    product_id: string;
    item_num: string;
    specs: string;
    dims: string;
    material_finishing: string;
    img_paths: string; // JSON string
    [key: string]: any;
  };
}
const renderSearchResults = (results: SearchResult[], setSelectedProduct: (product: SearchResult) => void, setIsDialogOpen: (open: boolean) => void) => {
    const handleProductClick = (product: SearchResult) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };
  return (
    <Card  sx={{ mt: 2 , bgcolor: '#F0F1F3', padding: '16px', borderRadius: 4}}>

    <Grid container spacing={2} >
        {results.map((result, index) => {
          return (
            <Grid size={{ xs: 12, sm: results.length === 1 ? 6 : 6, md: results.length === 1 ? 12 :  results.length === 2 ? 6 : results.length === 3 ? 4 : 4 }} key={result.id}>
              <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 4,
              bgcolor: "#E4EBF5",
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: 6,
              },
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
        objectFit: "cover",  // fills area like your example
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
      
      }}
    />
  )}

  <CardContent sx={{ flexGrow: 1 }}>
    <Typography gutterBottom variant="h6"
      sx={{ fontSize: "1rem", fontWeight: "bold" }}>
      {result.metadata?.item_name ?? `Item No: ${result.metadata.item_num}`}
    </Typography>

    <Typography variant="body2" sx={{ mb: 1 }}>
      {`Price: ${
        result.metadata?.exw_quotes_per_pc
          ? parseFloat(result.metadata.exw_quotes_per_pc).toFixed(0)
          : "--"
      }$ | Similarity: ${(result.score * 100).toFixed(2)}%`}
    </Typography>
  </CardContent>
</Card>

            </Grid>
          );
        })}
      </Grid>
    </Card>
    );
}

export default renderSearchResults