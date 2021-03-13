import { gruvboxThemeSet } from "./gruvbox";

const themePalettes = {
    dark: {
        red: "#f44336",
        green: "#5a9614",
        yellow: "#bdbd19",
        orange: "#ff890d",
    },
    light: {
        red: "#f44336",
        green: "#8BC34A",
        yellow: "#bdbd19",
        orange: "#eb8519",
    },
    material: {
        red: "#f44336",
        green: "#8BC34A",
        yellow: "#bdbd19",
        orange: "#eb8519",
    },
};

const themes = {
    dark: {
        primaryColor: "#5a9614",
        // accentColor: "#009688",
        primaryTextColor: "white",
        secondaryTextColor: "#252525",
        backgroundColor: "#303030", // #121212
        backgroundAccent: "#202020",
        windowFrame: "#202020",
        blockquoteColor: "rgba(255,255,255,0.20)",
        dividerColor: "#656565",
        ...themePalettes.dark,
    },
    light: {
        primaryColor: "#8BC34A",
        // accentColor: "#809688",
        primaryTextColor: "black",
        secondaryTextColor: "#959595",
        backgroundColor: "white",
        backgroundAccent: "#e4e4e4",
        windowFrame: "#e4e4e4",
        blockquoteColor: "rgba(0,0,0,0.80)",
        dividerColor: "#BDBDBD",
        ...themePalettes.light,
    },
    material: {
        darkPrimaryColor: "#689F38",
        primaryColor: "#8BC34A",
        // accentColor: "#795548",
        backgroundColor: "#DCEDC8", // lightPrimaryColor
        backgroundAccent: "#BCD0A8", // lightPrimaryColor
        windowFrame: "#BCD0A8",
        primaryTextColor: "#212121",
        secondaryTextColor: "#959595",
        dividerColor: "#BDBDBD",
        ...themePalettes.material,
    },
    ...gruvboxThemeSet,
};

export default themes;
