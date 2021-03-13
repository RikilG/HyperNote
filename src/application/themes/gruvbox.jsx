// gruvbox color palette: https://github.com/gruvbox-community/gruvbox
const palette = {
    core: {
        red: "#CC241D",
        green: "#98971A",
        blue: "#458588",
        yellow: "#D79921",
        purple: "#B16286",
        orange: "#D65D0E",
    },
    dark: {
        redSecondary: "#FB4934",
        greenSecondary: "#B8BB26",
        blueSecondary: "#83A598",
        yellowSecondary: "#FABD2F",
        purpleSecondary: "#D3869B",
        orangeSecondary: "#FE8019",
        backgroundColor: "#282828",
        backgroundAccent: "#1D2021",
        primaryTextColor: "#EBDBB2",
        secondaryTextColor: "#252525",
    },
    light: {
        redSecondary: "#9D0006",
        greenSecondary: "#79740E",
        blueSecondary: "#076678",
        yellowSecondary: "#B57614",
        purpleSecondary: "#8F3F71",
        orangeSecondary: "#AF3A03",
        backgroundColor: "#FBF1C7",
        backgroundAccent: "#F9F5D7",
        primaryTextColor: "#3C3836",
        secondaryTextColor: "#BBBBBB",
    },
};

export const gruvboxThemeSet = {
    gruvbox_purple_dark: {
        primaryColor: palette.core.purple,
        dividerColor: "#504945",
        windowFrame: palette.core.purple,
        ...palette.core,
        ...palette.dark,
    },
    gruvbox_orange_dark: {
        primaryColor: palette.core.orange,
        dividerColor: "#504945",
        windowFrame: palette.core.orange,
        ...palette.core,
        ...palette.dark,
    },
    gruvbox_blue_dark: {
        primaryColor: palette.core.blue,
        dividerColor: "#504945",
        windowFrame: palette.core.blue,
        ...palette.core,
        ...palette.dark,
    },
    gruvbox_green_light: {
        primaryColor: palette.core.green,
        dividerColor: "#D5C4A1",
        windowFrame: palette.core.green,
        ...palette.core,
        ...palette.light,
    },
    gruvbox_yellow_light: {
        primaryColor: palette.core.yellow,
        dividerColor: "#D5C4A1",
        windowFrame: palette.core.yellow,
        ...palette.core,
        ...palette.light,
    },
};
