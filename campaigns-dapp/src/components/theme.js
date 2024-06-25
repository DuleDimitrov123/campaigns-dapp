import { extendTheme } from "@chakra-ui/react";
import "@fontsource/inter/100.css";
import "@fontsource/inter/200.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";

const theme = extendTheme({
  components: {
    Button: {
      variants: {
        clickedButton: {
          bg: "purple.200",
          color: "purple.700",
        },
        normalButton: {
          bg: "white",
          color: "black",
        },
      },
    },
  },
  fonts: {
    heading: `'Inter'`,
  },
  fontWeight: {
    400: 400,
    500: 500,
    600: 600,
    700: 700,
  },
});

export default theme;