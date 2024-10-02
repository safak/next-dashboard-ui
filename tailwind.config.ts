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
        lansSky: "#C3EBFA",
        lansSkyLight: "#EDF9FD",
        lansGreen: "#3a5a40",
        lansGreenLight: "#e0aaff",
        lansYellow: "#f4a261",
        lansYellowLight: "#f8d7a6",
        lansBlueLight: "#e9edc9",
       
        
      }
    },
  },
  plugins: [],
};
export default config;
