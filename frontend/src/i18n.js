import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        dashboard: 'Dashboard',
        chat: 'Chat',
        data: 'Data Visualization',
        guide: 'User Guide',
        incois: 'INCOIS Portal',
        settings: 'Settings'
      },
      
      // Home page
      home: {
        title: 'FloatChat',
        subtitle: 'Ocean Data Intelligence',
        description: 'Dive deep into oceanographic data with AI-powered insights and natural language queries.',
        getStarted: 'Get Started',
        exploreData: 'Explore Data',
        learnMore: 'Learn More'
      },
      
      // Dashboard
      dashboard: {
        title: 'Ocean Dashboard',
        welcome: 'Welcome to your ocean data command center',
        metrics: 'Key Metrics',
        recentQueries: 'Recent Queries',
        dataOverview: 'Data Overview',
        temperature: 'Temperature',
        salinity: 'Salinity',
        depth: 'Depth',
        location: 'Location',
        lastUpdate: 'Last Update'
      },
      
      // Chat
      chat: {
        title: 'Ocean Chat',
        placeholder: 'Ask me anything about ocean data...',
        send: 'Send',
        clear: 'Clear',
        examples: 'Example queries:',
        example1: 'What is the average temperature in the Pacific?',
        example2: 'Show me data from the deepest measurements',
        example3: 'Which floats are closest to the equator?',
        thinking: 'Analyzing ocean data...',
        error: 'Sorry, I encountered an error. Please try again.',
        listening: 'Listening...',
        clickToSpeak: 'Click to speak',
        speechNotSupported: 'Speech recognition not supported'
      },
      
      // Data Visualization
      dataViz: {
        title: 'Data Visualization',
        map: 'Ocean Map',
        charts: 'Charts & Graphs',
        filters: 'Filters',
        timeRange: 'Time Range',
        dataType: 'Data Type',
        region: 'Region',
        apply: 'Apply Filters',
        reset: 'Reset'
      },
      
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        refresh: 'Refresh',
        download: 'Download',
        share: 'Share',
        copy: 'Copy',
        language: 'Language',
        theme: 'Theme',
        settings: 'Settings',
        help: 'Help',
        about: 'About'
      },
      
      // Ocean specific
      ocean: {
        depth: 'Depth',
        surface: 'Surface',
        deep: 'Deep',
        temperature: 'Temperature',
        salinity: 'Salinity',
        pressure: 'Pressure',
        oxygen: 'Oxygen',
        ph: 'pH',
        chlorophyll: 'Chlorophyll',
        current: 'Current',
        wave: 'Wave',
        tide: 'Tide',
        float: 'Float',
        buoy: 'Buoy',
        sensor: 'Sensor',
        measurement: 'Measurement',
        data: 'Data',
        analysis: 'Analysis',
        forecast: 'Forecast',
        prediction: 'Prediction'
      },
      
      // Guide page
      guide: {
        title: 'User Guide',
        subtitle: 'Complete guide to using FloatChat',
        download: 'Download PDF',
        sections: {
          gettingStarted: 'Getting Started',
          chatInterface: 'Chat Interface',
          dashboard: 'Dashboard',
          dataVisualization: 'Data Visualization',
          tips: 'Tips & Tricks'
        },
        content: {
          welcome: 'Welcome to FloatChat - your gateway to ocean data intelligence!',
          gettingStarted: 'Learn how to navigate the platform and make your first query.',
          chatInterface: 'Discover how to ask questions about ocean data in natural language.',
          dashboard: 'Understand the analytics dashboard and key metrics.',
          dataVisualization: 'Explore interactive maps and data visualization tools.',
          tips: 'Get the most out of FloatChat with these expert tips.'
        }
      },
      
      // INCOIS page
      incois: {
        title: 'INCOIS Portal',
        subtitle: 'Indian National Centre for Ocean Information Services',
        loading: 'Loading INCOIS portal...',
        error: 'Unable to load INCOIS portal. Please try again.',
        refresh: 'Refresh Portal'
      }
    }
  },
  
  hi: {
    translation: {
      nav: {
        home: 'होम',
        dashboard: 'डैशबोर्ड',
        chat: 'चैट',
        data: 'डेटा विज़ुअलाइज़ेशन',
        guide: 'उपयोगकर्ता गाइड',
        incois: 'INCOIS पोर्टल',
        settings: 'सेटिंग्स'
      },
      home: {
        title: 'फ्लोटचैट',
        subtitle: 'महासागर डेटा इंटेलिजेंस',
        description: 'AI-संचालित अंतर्दृष्टि और प्राकृतिक भाषा प्रश्नों के साथ समुद्र विज्ञान डेटा में गहराई से जाएं।',
        getStarted: 'शुरू करें',
        exploreData: 'डेटा एक्सप्लोर करें',
        learnMore: 'और जानें'
      },
      dashboard: {
        title: 'महासागर डैशबोर्ड',
        welcome: 'आपके महासागर डेटा कमांड सेंटर में आपका स्वागत है',
        metrics: 'मुख्य मेट्रिक्स',
        recentQueries: 'हाल के प्रश्न',
        dataOverview: 'डेटा अवलोकन',
        temperature: 'तापमान',
        salinity: 'लवणता',
        depth: 'गहराई',
        location: 'स्थान',
        lastUpdate: 'अंतिम अपडेट'
      },
      chat: {
        title: 'महासागर चैट',
        placeholder: 'महासागर डेटा के बारे में कुछ भी पूछें...',
        send: 'भेजें',
        clear: 'साफ़ करें',
        examples: 'उदाहरण प्रश्न:',
        example1: 'प्रशांत महासागर में औसत तापमान क्या है?',
        example2: 'मुझे सबसे गहरे मापों का डेटा दिखाएं',
        example3: 'कौन से फ्लोट भूमध्य रेखा के सबसे करीब हैं?',
        thinking: 'महासागर डेटा का विश्लेषण कर रहे हैं...',
        error: 'क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया फिर से कोशिश करें।',
        listening: 'सुन रहे हैं...',
        clickToSpeak: 'बोलने के लिए क्लिक करें',
        speechNotSupported: 'स्पीच रिकग्निशन समर्थित नहीं है'
      },
      dataViz: {
        title: 'डेटा विज़ुअलाइज़ेशन',
        map: 'महासागर मानचित्र',
        charts: 'चार्ट और ग्राफ़',
        filters: 'फ़िल्टर',
        timeRange: 'समय सीमा',
        dataType: 'डेटा प्रकार',
        region: 'क्षेत्र',
        apply: 'फ़िल्टर लागू करें',
        reset: 'रीसेट'
      },
      common: {
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        success: 'सफलता',
        cancel: 'रद्द करें',
        save: 'सहेजें',
        delete: 'हटाएं',
        edit: 'संपादित करें',
        close: 'बंद करें',
        back: 'वापस',
        next: 'अगला',
        previous: 'पिछला',
        search: 'खोजें',
        filter: 'फ़िल्टर',
        sort: 'क्रमबद्ध करें',
        refresh: 'ताज़ा करें',
        download: 'डाउनलोड',
        share: 'साझा करें',
        copy: 'कॉपी',
        language: 'भाषा',
        theme: 'थीम',
        settings: 'सेटिंग्स',
        help: 'सहायता',
        about: 'के बारे में'
      },
      ocean: {
        depth: 'गहराई',
        surface: 'सतह',
        deep: 'गहरा',
        temperature: 'तापमान',
        salinity: 'लवणता',
        pressure: 'दबाव',
        oxygen: 'ऑक्सीजन',
        ph: 'pH',
        chlorophyll: 'क्लोरोफिल',
        current: 'धारा',
        wave: 'लहर',
        tide: 'ज्वार',
        float: 'फ्लोट',
        buoy: 'बॉय',
        sensor: 'सेंसर',
        measurement: 'माप',
        data: 'डेटा',
        analysis: 'विश्लेषण',
        forecast: 'पूर्वानुमान',
        prediction: 'भविष्यवाणी'
      },
      
      // Guide page
      guide: {
        title: 'उपयोगकर्ता गाइड',
        subtitle: 'FloatChat का उपयोग करने की पूरी गाइड',
        download: 'PDF डाउनलोड करें',
        sections: {
          gettingStarted: 'शुरुआत करना',
          chatInterface: 'चैट इंटरफेस',
          dashboard: 'डैशबोर्ड',
          dataVisualization: 'डेटा विज़ुअलाइज़ेशन',
          tips: 'टिप्स और ट्रिक्स'
        },
        content: {
          welcome: 'FloatChat में आपका स्वागत है - महासागर डेटा इंटेलिजेंस का आपका प्रवेश द्वार!',
          gettingStarted: 'प्लेटफॉर्म को नेविगेट करना और अपना पहला प्रश्न पूछना सीखें।',
          chatInterface: 'प्राकृतिक भाषा में महासागर डेटा के बारे में प्रश्न पूछना सीखें।',
          dashboard: 'एनालिटिक्स डैशबोर्ड और मुख्य मेट्रिक्स को समझें।',
          dataVisualization: 'इंटरैक्टिव मानचित्र और डेटा विज़ुअलाइज़ेशन टूल्स का अन्वेषण करें।',
          tips: 'इन विशेषज्ञ टिप्स के साथ FloatChat का अधिकतम लाभ उठाएं।'
        }
      },
      
      // INCOIS page
      incois: {
        title: 'INCOIS पोर्टल',
        subtitle: 'भारतीय राष्ट्रीय महासागर सूचना सेवा केंद्र',
        loading: 'INCOIS पोर्टल लोड हो रहा है...',
        error: 'INCOIS पोर्टल लोड नहीं हो सका। कृपया फिर से कोशिश करें।',
        refresh: 'पोर्टल रीफ्रेश करें'
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n
