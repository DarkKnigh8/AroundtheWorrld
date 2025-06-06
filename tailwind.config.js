/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f5f5f5',  // lightest gray
          100: '#e0e0e0',  // very light gray
          200: '#c2c2c2',  // light gray
          300: '#a3a3a3',  // medium-light gray
          400: '#858585',  // mid gray
          500: '#4f4f4f',  // dark gray
          600: '#2e2e2e',  // very dark gray
          700: '#1c1c1c',  // near black
          800: '#121212',  // UI black
          900: '#000000'   // true black
        },
        secondary: {
          50:  '#f4f4f5',  // very light gray
          100: '#e4e4e7',  // light neutral gray
          200: '#d4d4d8',  // soft gray
          300: '#a1a1aa',  // mid gray
          400: '#71717a',  // darker gray
          500: '#52525b',  // deep gray
          600: '#3f3f46',  // charcoal gray
          700: '#27272a',  // near black
          800: '#18181b',  // dark black-ish
          900: '#0f0f11'   // almost pure black
        },
        accent: {
          50: '#FFE5E5',
          100: '#FFCCCC',
          200: '#FF9999',
          300: '#FF6666',
          400: '#FF4D4D',
          500: '#FF3B30', // Accent red
          600: '#E60000',
          700: '#B30000',
          800: '#800000',
          900: '#4C0000',
        },
        success: {
          50: '#E3FBE9',
          100: '#C7F7D3',
          200: '#8FEFA7',
          300: '#57E77B',
          400: '#30D158', // Success green
          500: '#28B04A',
          600: '#208F3C',
          700: '#186D2E',
          800: '#104C1F',
          900: '#082A11',
        },
        warning: {
          50: '#FFF4E5',
          100: '#FFE9CC',
          200: '#FFD499',
          300: '#FFBF66',
          400: '#FFAF33',
          500: '#FF9F0A', // Warning orange
          600: '#E68300',
          700: '#B36600',
          800: '#804A00',
          900: '#4C2C00',
        },
        error: {
          50: '#FFE8E5',
          100: '#FFD1CC',
          200: '#FFA399',
          300: '#FF7566',
          400: '#FF5C4D',
          500: '#FF453A', // Error red
          600: '#E60800',
          700: '#B30600',
          800: '#800400',
          900: '#4C0200',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#0D1117',
        },
      },
      fontFamily: {
        sans: [
          'SF Pro Display', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'Helvetica Neue', 
          'Arial', 
          'sans-serif'
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}