export const overlayStyles = {
  base: `
    position: fixed;
    box-sizing: border-box;
    transition: all 0.2s ease-in-out;
    border-radius: 4px;
    z-index: 10000;
    pointer-events: none;
  `,

  themes: {
    default: {
      style: `
        background: linear-gradient(45deg, 
          rgba(255, 255, 255, 0.1),
          rgba(255, 255, 255, 0.2)
        );
        border: 3px solid transparent;
        box-shadow: 
          0 0 0 2px rgba(62, 184, 255, 0.3),
          0 0 10px rgba(62, 184, 255, 0.2),
          inset 0 0 20px rgba(62, 184, 255, 0.1);
      `,
      keyframes: `
        @keyframes pulse {
          0% {
            box-shadow: 
              0 0 0 2px rgba(62, 184, 255, 0.3),
              0 0 10px rgba(62, 184, 255, 0.2),
              inset 0 0 20px rgba(62, 184, 255, 0.1);
          }
          50% {
            box-shadow: 
              0 0 0 4px rgba(62, 184, 255, 0.3),
              0 0 15px rgba(62, 184, 255, 0.2),
              inset 0 0 30px rgba(62, 184, 255, 0.1);
          }
          100% {
            box-shadow: 
              0 0 0 2px rgba(62, 184, 255, 0.3),
              0 0 10px rgba(62, 184, 255, 0.2),
              inset 0 0 20px rgba(62, 184, 255, 0.1);
          }
        }
      `,
    },

    pastel: {
      style: `
        background: linear-gradient(45deg,
          rgba(255, 182, 193, 0.2),
          rgba(255, 218, 185, 0.2),
          rgba(255, 255, 224, 0.2),
          rgba(176, 224, 230, 0.2)
        );
        border: 2px solid rgba(255, 182, 193, 0.3);
        box-shadow: 
          0 0 10px rgba(255, 182, 193, 0.2),
          inset 0 0 20px rgba(176, 224, 230, 0.2);
      `,
      keyframes: `
        @keyframes pulse {
          0% { 
            box-shadow: 
              0 0 10px rgba(255, 182, 193, 0.2),
              inset 0 0 20px rgba(176, 224, 230, 0.2);
          }
          50% { 
            box-shadow: 
              0 0 15px rgba(255, 218, 185, 0.3),
              inset 0 0 25px rgba(176, 224, 230, 0.3);
          }
          100% { 
            box-shadow: 
              0 0 10px rgba(255, 182, 193, 0.2),
              inset 0 0 20px rgba(176, 224, 230, 0.2);
          }
        }
      `,
    },

    neon: {
      style: `
        background: rgba(0, 0, 0, 0.1);
        border: 2px solid #00ff00;
        box-shadow: 
          0 0 10px #00ff00,
          inset 0 0 20px rgba(0, 255, 0, 0.5);
      `,
      keyframes: `
        @keyframes pulse {
          0% { 
            box-shadow: 
              0 0 10px #00ff00,
              0 0 20px #00ff00,
              0 0 30px #00ff00,
              inset 0 0 20px rgba(0, 255, 0, 0.5);
          }
          50% { 
            box-shadow: 
              0 0 15px #00ff00,
              0 0 25px #00ff00,
              0 0 35px #00ff00,
              inset 0 0 25px rgba(0, 255, 0, 0.7);
          }
          100% { 
            box-shadow: 
              0 0 10px #00ff00,
              0 0 20px #00ff00,
              0 0 30px #00ff00,
              inset 0 0 20px rgba(0, 255, 0, 0.5);
          }
        }
      `,
    },

    minimal: {
      style: `
        background: rgba(0, 0, 0, 0.05);
        border: 2px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      `,
      keyframes: `
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `,
    },
  },
} as const;

export type OverlayTheme = keyof typeof overlayStyles.themes;
