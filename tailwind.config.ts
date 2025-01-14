import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        zeidSky:"#C3EBFA",
        zeidSkyLight:"#EDF9FD",
        zeidPurple:"#CFCEFF",
        zeidPurpleLight:"#F1F0FF",
        zeidYellow:"#FAE27C",
        zeidYellowLight:"#FEFCE8",
        zeidBlue:"#302780",
        zeidBlueLight:"#7e57eb",
        zeidPink:"#de7ed6",
      }
    },
  },
  plugins: [],
};
export default config;
