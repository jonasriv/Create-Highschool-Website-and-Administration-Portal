import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		backgroundSize: {
			'200%': '200% 200%',
		},
		height: {
			'screen-minus-36': 'calc(100vh - 36px)',
			'screen-minus-24': 'calc(100vh - 24px)',
			'half-screen': 'calc(100vh / 2)',
			'three-quarter-screen': 'calc(100vh * 0.75)',
			'80-percent-screen': 'calc(100vh * 0.8)',
			'85-percent-screen': 'calc(100vh * 0.85)',
			'30-percent-screen': 'calc(100vh * 0.30)',
			'35-percent-screen': 'calc(100vh * 0.35)',
			'40-percent-screen': 'calc(100vh * 0.40)',
			'50-percent-screen': 'calc(100vh * 0.50)',
			'10-percent-screen': 'calc(100vh * 0.10)',
			'20-percent-screen': 'calc(100vh * 0.20)',
			'70-percent-screen': 'calc(100vh * 0.70)',
			'90-percent-screen': 'calc(100vh * 0.90)',
			'15-percent-screen': 'calc(100vh * 0.15)',
			'12-percent-screen': 'calc(100vh * 0.12)',
			'60-percent-screen': 'calc(100vh * 0.60)',
			'65-percent-screen': 'calc(100vh * 0.65)',
			'75-percent-screen': 'calc(100vh * 0.75)',
		},
		backgroundImage: {
			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
		},
		animation: {
			'flash-border1': 'flash-border1 5s infinite',
			'flash-border2': 'flash-border2 5s infinite',
			'flash-border3': 'flash-border3 5s infinite',
			'spin-fast': 'spin 1s linear infinite',
			'highlight-fileinput': 'highlight-fileinput 3s infinite'
		},		
		keyframes: {
			'flash-border1': {
				'0%, 30%': { color: 'white' },
				'35%, 100%': { color: 'lightGrey'},
			},
			'flash-border2': {
				'0%, 30%': { color: 'lightGrey' },
				'35%, 70%': { color: 'white'},
				'75%, 100%': { color: 'lightGrey' },
			},
			'flash-border3': {
				'0%, 70%': { color: 'lightGrey' },
				'75%, 100%': { color: 'white'},
			},
			'spin': {
				'0%': { transform: 'rotate(0deg)' },
				'100%': { transform: 'rotate(360deg)' },
	  
			},
			'highlight-fileinput': {
				'0%': { borderColor: 'white' },
				'50%': { borderColor: '#d500f9' },
				'100%': { borderColor: 'white' },
			},			
		},				
		fontFamily: {
			offside: ["var(--font-offside)", "sans-serif"],
			notable: ["var(--font-notable)", "sans-serif"],
			rubik: ["var(--font-rubik_dirt)", "sans-serif"],
			bahiana: ["var(--font-bahiana)", "sans-serif"],
			bungee: ["var(--font-bungee)", "sans-serif"],
			mina: ["var(--font-mina)", "serif"],
			roboto: ["var(--font-roboto-sans)", "sans-serif"],
			robotoMono: ["var(--font-roboto-mono)", "monospace"],
			supermercado: ["var(--font-koulen)", "sans-serif"],
		  },
  		colors: {
  			pinky: 'var(--pinky)',
			superpinky: 'var(--superpinky)',
			redpink: 'var(--redpink)',
			browny: 'var(--browny)',
			lightbrowny: 'var(--lightbrowny)',
			darkbrowny: 'var(--darkbrowny)',
			redish: 'var(--redish)',
			orangy: 'var(--orangy)',
			orangest: 'var(--orangest)',
			yallow: 'var(--yallow)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
