import { createTheme } from "@mui/material";
import palette from "./palette";
import components from "./components";
import typography from "./typography";

export const themeLight = createTheme({
  components,
  typography,
  palette: {
    ...palette,
    mode: "light",
    background: {
      default: "#FFFFFF",
      paper: "#F7F7F9"
    },
    text: {
      primary: "#5D6570",
      secondary: "red",
      disabled: "#81848A"
    },
    divider: "#F3EFFF"
  }      
 
});