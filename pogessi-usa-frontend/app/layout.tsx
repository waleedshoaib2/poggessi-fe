
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Metadata } from "next";
import { themeLight } from "./libs/mui/theme/themes";
import { ThemeContextProvider } from "./libs/mui/theme/context";
// export const metadata: Metadata = {
//   title: {
//     template: "%s | Smooth Pay",
//     default: "Smooth Pay"
//   },
//   description: "Smooth Pay - Dubai's exclusive loyalty program.",
//   icons: {
//     icon: "/img/favicon.ico",
//     shortcut: "/img/favicon.ico",
//     apple: "/img/favicon.ico"
//   }
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
       <ThemeContextProvider>
          <CssBaseline />
          {children}
        </ThemeContextProvider>
      </body>
    </html>

  );
}
