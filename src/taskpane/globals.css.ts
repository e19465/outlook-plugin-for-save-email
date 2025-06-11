import { makeStyles, tokens } from "@fluentui/react-components";

export const useGeneralStyles = makeStyles({
  textCenter: {
    textAlign: "center",
  },
  textJustify: {
    textAlign: "justify",
  },
  textLeft: {
    textAlign: "left",
  },
  widthFull: {
    width: "100%",
  },
  textSmall: {
    fontSize: tokens.fontSizeBase100,
  },
  textMedium: {
    fontSize: tokens.fontSizeBase200,
  },
  textLarge: {
    fontSize: tokens.fontSizeBase300,
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
  },
});
