import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      home: "Home",
      about: "About",
      services: "Services",
      contact: "Contact",
      login: "Login",
      register: "Register",
      dashboard: "Dashboard",
      logout: "Logout",
      heroTitle: "Smart Digital Platform for Pomegranate Farmers",
      heroText:
        "AnarMitra helps farmers with disease detection, market analysis, fertilizer services, advisor support, billing and chat in one integrated system.",
      createAccount: "Create Account",
      exploreServices: "Explore Services"
    }
  },

  mr: {
    translation: {
      home: "मुख्यपृष्ठ",
      about: "आमच्याबद्दल",
      services: "सेवा",
      contact: "संपर्क",
      login: "लॉगिन",
      register: "नोंदणी",
      dashboard: "डॅशबोर्ड",
      logout: "लॉगआउट",
      heroTitle: "डाळिंब शेतकऱ्यांसाठी स्मार्ट डिजिटल प्लॅटफॉर्म",
      heroText:
        "अनारमित्र शेतकऱ्यांना रोग ओळख, बाजार विश्लेषण, खत सेवा, सल्लागार मदत, बिलिंग आणि चॅट एकाच प्रणालीमध्ये उपलब्ध करून देते.",
      createAccount: "खाते तयार करा",
      exploreServices: "सेवा पहा"
    }
  },

  hi: {
    translation: {
      home: "होम",
      about: "हमारे बारे में",
      services: "सेवाएं",
      contact: "संपर्क",
      login: "लॉगिन",
      register: "रजिस्टर",
      dashboard: "डैशबोर्ड",
      logout: "लॉगआउट",
      heroTitle: "अनार किसानों के लिए स्मार्ट डिजिटल प्लेटफॉर्म",
      heroText:
        "अनारमित्र किसानों को रोग पहचान, बाजार विश्लेषण, खाद सेवाएं, सलाहकार सहायता, बिलिंग और चैट एक ही सिस्टम में उपलब्ध कराता है.",
      createAccount: "खाता बनाएं",
      exploreServices: "सेवाएं देखें"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;