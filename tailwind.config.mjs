/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
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
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
			  },
			  finance: {
				'blue': '#8e89f0',
				'light-blue': '#e2e1fc',
				'navy': '#1A1F2C',
				'gray': '#F5F5F7',
				'dark-gray': '#8E9196',
				'black': '#000000',
				'white': '#FFFFFF',
				primary: '#8E9196', // deep blue
				secondary: '#0f766e', // teal
				accent: '#047857', // green
				muted: '#e0f2fe', // light blue
				background: '#f8fafc', // very light blue-gray
			},



			transitionProperty: {
				opacity: "opacity",
			  },
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
		  },
		  keyframes: {
			'accordion-down': {
				from: { height: '0' },
				to: { height: 'var(--radix-accordion-content-height)' }
			},
			'accordion-up': {
				from: { height: 'var(--radix-accordion-content-height)' },
				to: { height: '0' }
			},
			'fade-in': {
				from: { opacity: '0' },
				to: { opacity: '1' }
			},
			'fade-in-up': {
				from: { 
					opacity: '0',
					transform: 'translateY(20px)'
				},
				to: { 
					opacity: '1',
					transform: 'translateY(0)'
				}
			},
			'fade-in-down': {
				from: { 
					opacity: '0',
					transform: 'translateY(-20px)'
				},
				to: { 
					opacity: '1',
					transform: 'translateY(0)'
				}
			},
			'slide-in-right': {
				from: { 
					opacity: '0',
					transform: 'translateX(20px)'
				},
				to: { 
					opacity: '1',
					transform: 'translateX(0)'
				}
			},
			'slide-in-left': {
				from: { 
					opacity: '0',
					transform: 'translateX(-20px)'
				},
				to: { 
					opacity: '1',
					transform: 'translateX(0)'
				}
			},
			'float': {
				'0%, 100%': { 
					transform: 'translateY(0)' 
				},
				'50%': { 
					transform: 'translateY(-10px)' 
				}
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'fade-in': 'fade-in 0.6s ease-out',
			'fade-in-up': 'fade-in-up 0.6s ease-out',
			'fade-in-down': 'fade-in-down 0.6s ease-out',
			'slide-in-right': 'slide-in-right 0.6s ease-out',
			'slide-in-left': 'slide-in-left 0.6s ease-out',
			'float': 'float 6s ease-in-out infinite'
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

