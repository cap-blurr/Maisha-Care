import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		  fontFamily: {
			poppins: ["Poppins", "sans-serif"],
			DM: ["DM Sans", "sans-serif"],
			melodrama: ['var(--font-melodrama)']
		   },
		  backgroundImage: {
			"app-bg":"url('/svg/app-bg.svg')",
			"onboarding-bg":"url('/svg/onboarding-bg.svg')",
			"wallet-bg":"url('/svg/wallet-bg.svg')",
			"dash-hero-bg": "url('/svg/property-hero.svg')",
		  },
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
