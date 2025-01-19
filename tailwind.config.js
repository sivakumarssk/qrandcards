// tailwind.config.js
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true, // Ensures horizontal centering
        padding: "1rem", // Adds padding for small screens
        screens: {
          sm: "100%", // Makes container 100% wide on small screens
          md: "768px",
          lg: "1024px",
          xl: "1280px",
        },
      },
    },
  },
  plugins: [],
};
