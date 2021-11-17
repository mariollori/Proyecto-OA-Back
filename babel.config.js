const presets = [
    [
        "@babel/env",
        {
            targets: {
                edge: "17",
                firefox: "32",
                chrome: "50",
                safari: "6.0",
            },
            useBuiltIns: "usage",
            corejs: 3,
        },
    ],
];

module.exports = { presets };