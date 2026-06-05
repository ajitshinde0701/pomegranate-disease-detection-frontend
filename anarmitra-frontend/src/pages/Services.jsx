import { useTranslation } from "react-i18next";
import VoiceReader from "../components/VoiceReader";
import "../styles/publicPages.css";

export default function Services() {
  const { i18n } = useTranslation();

  const content = {
    en: {
      title: "Our Services",
      subtitle: "Everything needed for smart pomegranate farming and agricultural support.",
      cards: [
        ["🌱 Fertilizer Store Listing", "Find fertilizer stores with stock, price, contact details and services."],
        ["🤝 Merchant Contact Platform", "Connect with merchants for produce inquiry and selling support."],
        ["🧑‍🌾 Advisor Consultation", "Get agricultural guidance from expert advisors."],
        ["📊 Realtime Anar Market Analysis", "Track market price trends and improve selling decisions."],
        ["🌦 Weather Alerts", "Stay updated with weather information relevant to farming activity."],
        ["🧠 Disease Detection", "Upload fruit and plant photos to identify pomegranate disease."]
      ]
    },

    mr: {
      title: "आमच्या सेवा",
      subtitle: "स्मार्ट डाळिंब शेती आणि कृषी सहाय्यासाठी आवश्यक सर्व सेवा.",
      cards: [
        ["🌱 खत दुकान यादी", "खत दुकानांची माहिती, साठा, किंमत आणि संपर्क तपशील पहा."],
        ["🤝 व्यापारी संपर्क प्लॅटफॉर्म", "पीक विक्री आणि चौकशीसाठी व्यापाऱ्यांशी संपर्क साधा."],
        ["🧑‍🌾 सल्लागार मार्गदर्शन", "तज्ञ सल्लागारांकडून कृषी मार्गदर्शन मिळवा."],
        ["📊 रिअलटाइम डाळिंब बाजार विश्लेषण", "बाजारभावाचा ट्रेंड पाहून योग्य विक्री निर्णय घ्या."],
        ["🌦 हवामान सूचना", "शेतीसाठी उपयुक्त हवामान माहिती मिळवा."],
        ["🧠 रोग ओळख", "डाळिंबाच्या झाडाचे फोटो अपलोड करून रोग ओळखा."]
      ]
    },

    hi: {
      title: "हमारी सेवाएं",
      subtitle: "स्मार्ट अनार खेती और कृषि सहायता के लिए जरूरी सभी सेवाएं.",
      cards: [
        ["🌱 खाद दुकान सूची", "खाद दुकानों की जानकारी, स्टॉक, कीमत और संपर्क विवरण देखें."],
        ["🤝 व्यापारी संपर्क प्लेटफॉर्म", "फसल बिक्री और पूछताछ के लिए व्यापारियों से संपर्क करें."],
        ["🧑‍🌾 सलाहकार मार्गदर्शन", "विशेषज्ञ सलाहकारों से कृषि मार्गदर्शन प्राप्त करें."],
        ["📊 रियलटाइम अनार बाजार विश्लेषण", "बाजार भाव के ट्रेंड देखकर बेहतर बिक्री निर्णय लें."],
        ["🌦 मौसम अलर्ट", "खेती के लिए उपयोगी मौसम जानकारी प्राप्त करें."],
        ["🧠 रोग पहचान", "अनार के पौधे की फोटो अपलोड करके रोग पहचानें."]
      ]
    }
  };

  const data = content[i18n.language] || content.en;

  return (
    <div className="page-section">
      <section className="banner-section">
        <VoiceReader text={`${data.title}. ${data.subtitle}`}>
          <h1>{data.title}</h1>
          <p>{data.subtitle}</p>
        </VoiceReader>
      </section>

      <section className="info-section">
        <div className="card-grid">
          {data.cards.map((card, index) => (
            <div
              className="info-card voice-card"
              key={index}
            >
              <VoiceReader text={`${card[0]}. ${card[1]}`}>
                <h3>{card[0]}</h3>
                <p>{card[1]}</p>
              </VoiceReader>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}