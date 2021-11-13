import { extendTheme } from "@chakra-ui/react"

//https://chakra-ui.com/docs/features/color-mode
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

const theme = extendTheme({ config })

export default theme;