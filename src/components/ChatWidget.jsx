import React, { useEffect } from 'react';

const ChatWidget = () => {
  useEffect(() => {
    // Initialize Chatbase
    const initChatbase = () => {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args) => { // Changed 'arguments' to 'args'
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(args);
        };
        
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") {
              return target.q;
            }
            return (...args) => target(prop, ...args);
          }
        });
      }
      
      // Create and append the script
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "_9RzXcTC3tEOaFLW83ewh";
      script.setAttribute("domain", "www.chatbase.co");
      document.body.appendChild(script);
    };
    
    // Check if document is already loaded
    if (document.readyState === "complete") {
      initChatbase();
    } else {
      window.addEventListener("load", initChatbase);
      // Clean up event listener
      return () => window.removeEventListener("load", initChatbase);
    }
  }, []); // Empty dependency array ensures this runs once when component mounts

  return null; // This component doesn't render anything
};

export default ChatWidget;