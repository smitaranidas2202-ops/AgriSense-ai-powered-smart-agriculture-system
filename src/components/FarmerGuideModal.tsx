import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Sprout, 
  Layers, 
  Bug, 
  Radio, 
  FileText, 
  ShieldCheck, 
  PhoneCall, 
  Volume2, 
  VolumeX, 
  Camera, 
  Droplets, 
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

interface FarmerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onNavigateToTab?: (tab: string) => void;
}

export const FarmerGuideModal: React.FC<FarmerGuideModalProps> = ({
  isOpen,
  onClose,
  lang,
  onNavigateToTab,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'leaf' | 'soil' | 'pest' | 'crops' | 'helpline'>('overview');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  if (!isOpen) return null;

  const content = {
    en: {
      title: 'Farmer User Manual & Guide',
      subtitle: 'Complete step-by-step guide to protect your crops, maximize yield, and cut fertilizer costs.',
      listenAll: 'Listen to this Guide',
      stopAudio: 'Stop Audio',
      callHelpline: 'Call Kisan Call Centre (Toll-Free 1800-180-1551)',
      tabs: {
        overview: 'Overview',
        leaf: '1. Leaf Doctor',
        soil: '2. Soil & Fertilizer',
        pest: '3. Pest & Spray',
        crops: '4. Crops & Soils',
        helpline: '5. Help & Numbers'
      },
      overviewText: `AgriSense AI is designed specifically for Indian farmers to take the guesswork out of farming. By combining leaf photo diagnosis, soil nutrient analysis, and live weather forecasting, you can make decisions that save money on pesticides and boost your crop yield.`,
      sections: {
        overview: {
          heading: 'How AgriSense AI Empowers You in the Field',
          bullets: [
            {
              title: 'Spot Crop Diseases Early (Before They Spread)',
              desc: 'Catch fungal, bacterial, or pest damage within 3 seconds using just your phone camera. Avoid spraying expensive broad-spectrum chemicals blindly.'
            },
            {
              title: 'Balanced Fertilizer Savings (Save ₹1,500 - ₹3,000 per Acre)',
              desc: 'Calculate exact 45kg bags of Urea, DAP, and MOP required for your soil so you never over-apply or under-apply nutrients.'
            },
            {
              title: 'Pest Weather Warning & Safe Spray Hours',
              desc: 'Know if rain or high wind will wash away your pesticide spray today, saving you ₹800+ per tank in wasted chemicals.'
            },
            {
              title: 'Government Soil Health Card (SHC) Generation',
              desc: 'Generate, print, or download an official-format Soil Health Card with your PM-Kisan ID number.'
            }
          ]
        },
        leaf: {
          heading: 'Module 1: Leaf Disease Doctor (पत्ता डॉक्टर)',
          whyItMatters: 'Fungal and viral leaf spots can destroy 30% to 70% of your crop within 7-10 days if left untreated. Early identification gives 95%+ recovery rate.',
          steps: [
            {
              step: 'Step 1: Take a Clear Photo',
              text: 'Pluck a diseased leaf and place it on a flat palm or plain sheet under daylight. Avoid blurry shots or direct sun reflection.'
            },
            {
              step: 'Step 2: Upload or Select Sample',
              text: 'Click "Upload Leaf Photo" or tap one of our pre-tested field samples (e.g. Tomato Early Blight, Potato Late Blight, Rice Leaf Blast).'
            },
            {
              step: 'Step 3: Check AI Confidence & Heatmap',
              text: 'The CNN neural network analyzes the spots and shows a Grad-CAM Heatmap (red zones highlight exactly where the disease lesions are located).'
            },
            {
              step: 'Step 4: Follow Treatment Advisory',
              text: 'Read both the Organic Cures (Neem oil, Trichoderma viride) and Chemical Medicines (e.g., Mancozeb, Azoxystrobin) with precise dilution (ml per liter of water).'
            }
          ],
          tips: [
            'Do NOT spray on rainy or windy mornings.',
            'Always spray on the underside of leaves where fungal spores hide.',
            'Wear gloves and face mask when applying chemical fungicides.'
          ]
        },
        soil: {
          heading: 'Module 2: Soil Health & Fertilizer Calculator (मिट्टी व खाद)',
          whyItMatters: 'Using only Urea makes soil acidic and leaves plants weak against pests. Balanced N-P-K nutrition ensures strong root anchoring, abundant flowering, and higher grain weight.',
          steps: [
            {
              step: 'Step 1: Enter your Soil Test Values',
              text: 'Enter Nitrogen (N), Phosphorus (P), Potassium (K), pH, and Moisture from your local Soil Testing Lab (or load live IoT sensors).'
            },
            {
              step: 'Step 2: AI Crop Recommendation',
              text: 'Our Machine Learning model evaluates 22 Indian crops and recommends the top 3 crops that will produce the highest yield in your soil.'
            },
            {
              step: 'Step 3: Read Fertilizer Bag Calculation',
              text: 'The app converts scientific kg/ha into real-world 45kg Bags (Urea, DAP, MOP) required for your exact field acreage.'
            },
            {
              step: 'Step 4: Download Soil Health Card',
              text: 'Click "Print Soil Health Card" to keep a digital record for bank credit or government subsidies.'
            }
          ],
          tips: [
            'Ideal soil pH for most crops is between 6.0 and 7.5.',
            'Apply Nitrogen in 2-3 split doses (basal, vegetative, flowering) rather than all at once.'
          ]
        },
        pest: {
          heading: 'Module 3: Live Weather & Pest Spray Window (मौसम व कीट चेतावनी)',
          whyItMatters: 'Spraying pesticides right before a rainstorm washes the chemical into the ground, wasting your money and polluting groundwater. High humidity (above 80%) breeds aphids, thrips, and blights.',
          steps: [
            {
              step: 'Step 1: Check Live Weather Forecast',
              text: 'The app automatically connects to Open-Meteo satellite weather for your exact farm district (Temperature, Humidity, Wind speed, Rainfall probability).'
            },
            {
              step: 'Step 2: Select Crop Growth Stage',
              text: 'Select your crop’s current stage (Seedling, Vegetative, Flowering, or Maturity) to adjust vulnerability.'
            },
            {
              step: 'Step 3: Check Pest Risk Level',
              text: 'View whether risk is Low (Green), Moderate (Yellow), or Critical (Red), with names of specific pests likely to attack.'
            },
            {
              step: 'Step 4: Read "Safe Spray Window"',
              text: 'Check the Spray Window indicator: "Safe to Spray" vs "Do Not Spray". Look for low wind (<15 km/h) and zero rain in the next 6 hours.'
            }
          ],
          tips: [
            'Best time to spray is early morning (7 AM - 10 AM) or late afternoon (4 PM - 6 PM).',
            'Avoid spraying during peak midday heat (12 PM - 3 PM) as chemical evaporates rapidly.'
          ]
        },
        crops: {
          heading: 'Module 4: Indian Crop & Soil Encyclopedia (फसल व मिट्टी ज्ञान)',
          whyItMatters: 'Every district in India has unique agro-climatic zones. Matching the right crop variety to your soil order (ICAR classification) guarantees high market price and pest resistance.',
          steps: [
            {
              step: 'Explore 8 ICAR Soil Orders',
              text: 'Learn the characteristics, moisture retention, and deficiency risks of Alluvial (जलोढ़), Black/Regur (काली), Red & Yellow (लाल), Laterite, Arid, Saline, and Mountain soils.'
            },
            {
              step: 'Explore 15+ Major Indian Crops',
              text: 'Detailed profiles for Rice, Wheat, Cotton, Sugarcane, Soybean, Chickpea, Mustard, Tomato, Onion, Maize, Groundnut, and more across Kharif, Rabi, and Zaid seasons.'
            },
            {
              step: 'Read State-by-State Guidelines',
              text: 'See best practices tailored for Maharashtra, Punjab, Uttar Pradesh, Gujarat, Madhya Pradesh, Karnataka, Andhra Pradesh, and more.'
            }
          ],
          tips: [
            'Practice crop rotation (e.g. legume like Chickpea after Rice) to naturally replenish soil Nitrogen.'
          ]
        },
        helpline: {
          heading: 'Module 5: Emergency Support & Kisan Helplines (किसान सहायता केंद्र)',
          whyItMatters: 'When unexpected locust swarms, sudden pest blights, or unseasonal hailstorms strike, immediate expert agricultural advice is just one phone call away.',
          contacts: [
            {
              name: 'Kisan Call Centre (KCC) - Government of India',
              number: '1800-180-1551',
              timing: '6:00 AM to 10:00 PM (All 7 Days)',
              languages: '22 Indian Languages (Hindi, Marathi, Punjabi, Gujarati, etc.)',
              badge: 'Toll-Free'
            },
            {
              name: 'PM-KISAN Samman Nidhi Helpline',
              number: '155261 / 011-24300606',
              timing: '10:00 AM to 5:00 PM',
              languages: 'Hindi, English',
              badge: 'Direct Support'
            },
            {
              name: 'ICAR National Agricultural Advisory',
              number: '011-25841000',
              timing: 'Office Hours',
              languages: 'Agronomy Research & Disease Diagnosis',
              badge: 'Research'
            }
          ]
        }
      }
    },
    hi: {
      title: 'किसान मार्गदर्शिका एवं उपयोग विधि',
      subtitle: 'फसलों को बीमारियों से बचाने, खाद का खर्च घटाने और अधिक उपज पाने का सम्पूर्ण तरीका।',
      listenAll: 'यह गाइड सुनें',
      stopAudio: 'आवाज बंद करें',
      callHelpline: 'किसान कॉल सेंटर पर फोन करें (टोल-फ्री 1800-180-1551)',
      tabs: {
        overview: 'परिचय',
        leaf: '१. पत्ता डॉक्टर',
        soil: '२. मिट्टी व खाद',
        pest: '३. कीट व मौसम',
        crops: '४. फसल व मिट्टी',
        helpline: '५. हेल्पलाइन नंबर'
      },
      overviewText: `एग्रीसेंस एआई भारतीय किसानों के लिए तैयार किया गया है ताकि खेती में नुकसान न हो। मोबाइल कैमरे से पत्ते की बीमारी पहचानें, मिट्टी में खाद की सही मात्रा जानें, और मौसम के अनुसार सही समय पर दवाई का छिड़काव करें।`,
      sections: {
        overview: {
          heading: 'एग्रीसेंस एआई आपकी खेती में कैसे मदद करता है?',
          bullets: [
            {
              title: 'बीमारी का समय रहते पता लगाना',
              desc: 'पत्ते का फोटो खींचते ही ३ सेकंड में बीमारी, उसका कारण और देसी व वैज्ञानिक इलाज सामने आ जाता है।'
            },
            {
              title: 'खाद के खर्च में ₹1,500 से ₹3,000 प्रति एकड़ की बचत',
              desc: 'यूरिया, डीएपी और पोटाश की बिल्कुल सही बोरियों (४५ किलो) की गिनती मिलती है, जिससे फालतू खाद का पैसा बचता है।'
            },
            {
              title: 'दवाई छिड़काव का सही समय (मौसम आधारित)',
              desc: 'बारिश या तेज हवा में दवाई बह जाने का खतरा नहीं रहता। ऐप बताता है कि आज दवाई डालना सुरक्षित है या नहीं।'
            },
            {
              title: 'डिजिटल मृदा स्वास्थ्य कार्ड (Soil Health Card)',
              desc: 'अपने खेत का डिजिटल कार्ड बनाएं व प्रिंट करें जो बैंक लोन व सरकारी योजनाओं में काम आता है।'
            }
          ]
        },
        leaf: {
          heading: 'भाग १: पत्ता डॉक्टर (फसल रोग पहचान)',
          whyItMatters: 'फफूंद या जीवाणु रोग ७ से १० दिन में आधी फसल नष्ट कर सकते हैं। शुरुआती दिनों में पहचान होने पर ९५% फसल बच जाती है।',
          steps: [
            {
              step: 'पहला कदम: पत्ते का साफ फोटो लें',
              text: 'बीमार पत्ते को हथेली या सफेद कागज पर रखें। दिन की रोशनी में नजदीक से फोटो खींचें।'
            },
            {
              step: 'दूसरा कदम: फोटो अपलोड करें',
              text: '"पत्ते का फोटो अपलोड करें" बटन दबाएं या दिए गए नमूनों में से जांचें।'
            },
            {
              step: 'तीसरा कदम: हीटमैप में बीमारी देखें',
              text: 'एआई आपको लाल घेरे (हीटमैप) में दिखाएगा कि बीमारी पत्ते के किस हिस्से में फैली है।'
            },
            {
              step: 'चौथा कदम: सुझाई गई दवा का छिड़काव करें',
              text: 'नीम तेल जैसे जैविक उपचार और मैनकोजेब जैसी दवाओं की सही मात्रा (मिलीलीटर प्रति लीटर पानी) पढ़कर इस्तेमाल करें।'
            }
          ],
          tips: [
            'पत्ते के निचले हिस्से पर फफूंद ज्यादा होती है, वहां भी अच्छी तरह छिड़कें।',
            'दवाई डालते समय मुंह पर मास्क और हाथों में दस्ताने जरूर पहनें।'
          ]
        },
        soil: {
          heading: 'भाग २: मिट्टी व खाद सलाहकार (संतुलित पोषण)',
          whyItMatters: 'केवल यूरिया डालने से मिट्टी सख्त होती है और पौधों में कीड़े जल्दी लगते हैं। नाइट्रोजन, फॉस्फोरस और पोटाश का सही संतुलन ही बंपर पैदावार देता है।',
          steps: [
            {
              step: 'पहला कदम: मिट्टी जांच के आंकड़े भरें',
              text: 'मृदा प्रयोगशाला की पर्ची से एन, पी, के और पीएच दर्ज करें (या हमारे आईओटी सेंसर से ऑटो-भरें)।'
            },
            {
              step: 'दूसरा कदम: उपयुक्त फसल की सिफारिश पाएं',
              text: 'एआई बताएगा कि आपकी मिट्टी की ताकत के हिसाब से कौन सी फसल सबसे ज्यादा मुनाफा देगी।'
            },
            {
              step: 'तीसरा कदम: खाद की बोरियों की गिनती देखें',
              text: 'ऐप सीधे बताएगा: कितने बैग यूरिया, कितने बैग डीएपी और पोटाश अपने एकड़ के लिए बाजार से लाने हैं।'
            },
            {
              step: 'चौथा कदम: मृदा स्वास्थ्य कार्ड प्रिंट करें',
              text: 'अपने खेत का पूरा रिकॉर्ड अपने मोबाइल में सुरक्षित रखें।'
            }
          ],
          tips: [
            'मिट्टी का पीएच ६.० से ७.५ के बीच सबसे उत्तम माना जाता है।',
            'यूरिया को एक साथ डालने के बजाय २-३ किस्तों में डालें।'
          ]
        },
        pest: {
          heading: 'भाग ३: मौसम व कीट चेतावनी (छिड़काव समय)',
          whyItMatters: 'अगर दवाई छिड़कने के तुरंत बाद बारिश हो जाए तो सारा पैसा बर्बाद हो जाता है। ८०% से ज्यादा नमी में माहू, इल्ली और झुलसा तेजी से पनपते हैं।',
          steps: [
            {
              step: 'पहला कदम: अपने जिले का मौसम देखें',
              text: 'ऐप आपके खेत का आज का तापमान, हवा की रफ्तार और बारिश की संभावना दिखाता है।'
            },
            {
              step: 'दूसरा कदम: फसल की अवस्था चुनें',
              text: 'पौधा छोटा है, फूल आ रहे हैं या फल बन रहे हैं - यह चुनें।'
            },
            {
              step: 'तीसरा कदम: कीट खतरे का स्तर जांचें',
              text: 'कम (हरा), मध्यम (पीला), या गंभीर (लाल) खतरा देखें।'
            },
            {
              step: 'चौथा कदम: छिड़काव विंडो पढ़ें',
              text: 'यदि "छिड़काव के लिए सुरक्षित" लिखा है तभी पंप चालू करें। तेज हवा में दवाई उड़ जाती है।'
            }
          ],
          tips: [
            'सुबह ७ से १० बजे या शाम ४ से ६ बजे का समय छिड़काव के लिए सबसे अच्छा होता है।',
            'दोपहर की तेज धूप में छिड़काव न करें, दवा भाप बनकर उड़ जाती है।'
          ]
        },
        crops: {
          heading: 'भाग ४: भारत की फसलें एवं मिट्टी ज्ञान',
          whyItMatters: 'अपनी मिट्टी के अनुसार सही बीज और किस्म चुनने से कम पानी और कम लागत में भी पैदावार २०-३०% बढ़ जाती है।',
          steps: [
            {
              step: '८ प्रमुख भारतीय मिट्टियों की जानकारी',
              text: 'जलोढ़, काली/रेगुर, लाल-पीली, लैटेराइट, मरुस्थलीय और पर्वतीय मिट्टी के गुण व कमियां जानें।'
            },
            {
              step: '१५ से अधिक प्रमुख फसलों की गाइड',
              text: 'धान, गेहूं, कपास, गन्ना, सोयाबीन, चना, सरसों, टमाटर, प्याज, मक्का, मूंगफली आदि की संपूर्ण जानकारी।'
            },
            {
              step: 'फसल चक्र अपनाएं',
              text: 'अनाज के बाद दलहनी फसलें (जैसे चना या मूंग) बोने से जमीन में प्राकृतिक रूप से नाइट्रोजन बढ़ती है।'
            }
          ],
          tips: [
            'दलहनी फसलों की जड़ों में राइजोबियम जीवाणु होते हैं जो यूरिया की जरूरत कम करते हैं।'
          ]
        },
        helpline: {
          heading: 'भाग ५: किसान सहायता व सरकारी हेल्पलाइन',
          whyItMatters: 'किसी भी आपात स्थिति या कीट हमले में तुरंत विशेषज्ञ कृषि वैज्ञानिकों से सीधे फोन पर बात करें।',
          contacts: [
            {
              name: 'किसान कॉल सेंटर (भारत सरकार)',
              number: '1800-180-1551',
              timing: 'सुबह ६ बजे से रात १० बजे तक (सातों दिन)',
              languages: '२२ भारतीय भाषाओं में उपलब्ध',
              badge: 'टोल-फ्री (निःशुल्क)'
            },
            {
              name: 'पीएम-किसान सम्मान निधि हेल्पलाइन',
              number: '155261 / 011-24300606',
              timing: 'सुबह १० बजे से शाम ५ बजे तक',
              languages: 'हिन्दी, अंग्रेजी',
              badge: 'सीधी सहायता'
            },
            {
              name: 'भारतीय कृषि अनुसंधान परिषद (ICAR)',
              number: '011-25841000',
              timing: 'कार्यालय समय',
              languages: 'फसल अनुसंधान व कीट परामर्श',
              badge: 'वैज्ञानिक सलाह'
            }
          ]
        }
      }
    },
    mr: {
      title: 'शेतकरी मार्गदर्शिका व वापर पद्धती',
      subtitle: 'पिकांचे रोगांपासून रक्षण, खतांचा खर्च कमी करणे व भरघोस उत्पादन मिळवण्याची संपूर्ण माहिती.',
      listenAll: 'मार्गदर्शिका ऐका',
      stopAudio: 'आवाज थांबवा',
      callHelpline: 'किसान कॉल सेंटरवर संपर्क करा (टोल-फ्री 1800-180-1551)',
      tabs: {
        overview: 'माहिती',
        leaf: '१. पान डॉक्टर',
        soil: '२. माती व खते',
        pest: '३. कीड व फवारणी',
        crops: '४. पिके व जमीन',
        helpline: '५. हेल्पलाइन'
      },
      overviewText: `अ‍ॅग्रीसेन्स एआय महाराष्ट्रातील आणि भारतातील शेतकऱ्यांसाठी खास तयार केले आहे. पानाचा फोटो काढून रोग ओळखा, माती परीक्षणानुसार योग्य खतांची मात्रा ठरवा आणि हवामानानुसार सुरक्षित वेळी फवारणी करा.`,
      sections: {
        overview: {
          heading: 'अ‍ॅग्रीसेन्स एआय शेतात कशी मदत करते?',
          bullets: [
            {
              title: 'पिकांवरील रोग त्वरित ओळखणे',
              desc: 'मोबाईलने पानावरील डागांचा फोटो काढताच ३ सेकंदात रोग आणि त्यावर सेंद्रिय व रासायनिक उपाय मिळतात.'
            },
            {
              title: 'खतांच्या खर्चात प्रति एकर ₹१,५०० ते ₹३,००० बचत',
              desc: 'युरिया, डीएपी आणि पोटॅशच्या नेमक्या किती गोण्या (४५ किलो) लागतील याचे थेट गणित मिळते.'
            },
            {
              title: 'फवारणीची योग्य वेळ व हवामान अंदाज',
              desc: 'पावसात औषध वाहून जाणार नाही याची खात्री मिळते. आज फवारणी करावी की नाही हे स्पष्ट समजते.'
            },
            {
              title: 'डिजिटल सॉईल हेल्थ कार्ड',
              desc: 'आपल्या शेताचे अधिकृत माती आरोग्य कार्ड डाऊनलोड करा व प्रिंट करा.'
            }
          ]
        },
        leaf: {
          heading: 'विभाग १: पान डॉक्टर (रोग निदान)',
          whyItMatters: 'करपा, तांबेरा किंवा भुरी रोग काही दिवसांत संपूर्ण पीक नष्ट करू शकतात. सुरुवातीलाच उपचार केल्यास ९५% पीक सुरक्षित राहते.',
          steps: [
            {
              step: 'पायरी १: पानाचा स्पष्ट फोटो घ्या',
              text: 'रोगट पान हातावर किंवा कागदावर ठेवा. चांगल्या उजेडात जवळून स्पष्ट फोटो काढा.'
            },
            {
              step: 'पायरी २: फोटो अपलोड करा',
              text: '"पानाचा फोटो अपलोड करा" वर क्लिक करा किंवा दिलेल्या नमुन्यांतून निवडा.'
            },
            {
              step: 'पायरी ३: हीटमॅपद्वारे रोग तपासा',
              text: 'एआय लाल डागांद्वारे दाखवतो की पानावर रोगाचा प्रादुर्भाव नेमका कुठे आहे.'
            },
            {
              step: 'पायरी ४: औषधांची मात्रा वाचून फवारणी करा',
              text: 'सेंद्रिय (निंबोळी अर्क) आणि रासायनिक बुरशीनाशकांचे अचूक प्रमाण (मिली/ग्रॅम प्रति लिटर पाणी) समजून वापरा.'
            }
          ],
          tips: [
            'पानाच्या मागच्या बाजूला फवारणी व्यवस्थित करा, तिथे बुरशीचे बीजाणू लपलेले असतात.',
            'कीटकनाशक फवारताना नेहमी मास्क आणि हातमोजे वापरा.'
          ]
        },
        soil: {
          heading: 'विभाग २: माती व खत सल्लागार (संतुलित पोषण)',
          whyItMatters: 'फक्त युरिया टाकल्याने जमीन नापीक होते आणि किडींचा प्रादुर्भाव वाढतो. नत्र, स्फुरद आणि पालाशचा समतोलच पिकाला ताकद देतो.',
          steps: [
            {
              step: 'पायरी १: माती परीक्षणाचे गुणधर्म भरा',
              text: 'माती परीक्षण अहवालातील N, P, K आणि pH टाका किंवा IoT सेन्सरद्वारे थेट घ्या.'
            },
            {
              step: 'पायरी २: योग्य पिकांची शिफारस मिळवा',
              text: 'जमिनीच्या गुणधर्मानुसार कोणते पीक जास्त नफा देईल हे एआय सांगते.'
            },
            {
              step: 'पायरी ३: खतांच्या गोण्यांची अचूक संख्या',
              text: 'आपल्या क्षेत्रानुसार बाजारातून युरिया, डीएपी आणि पोटॅशच्या किती गोण्या आणायच्या ते थेट समजते.'
            },
            {
              step: 'पायरी ४: सॉईल हेल्थ कार्ड प्रिंट करा',
              text: 'आपल्या शेताचा डिजिटल रेकॉर्ड कायम जपून ठेवा.'
            }
          ],
          tips: [
            'उत्तम पिकासाठी जमिनीचा सामू (pH) ६.० ते ७.५ दरम्यान असावा.',
            'नत्र खते एकाच वेळी न देता २ ते ३ हप्त्यांमध्ये विभागून द्या.'
          ]
        },
        pest: {
          heading: 'विभाग ३: हवामान व कीड इशारा (फवारणी सल्ला)',
          whyItMatters: 'फवारणीनंतर लगेच पाऊस पडल्यास सर्व खर्च पाण्यात जातो. हवेतील दमटपणा वाढल्यास मावा, तुडतुडे आणि बुरशीजन्य रोगांचा प्रादुर्भाव वाढतो.',
          steps: [
            {
              step: 'पायरी १: हवामानाचा अंदाज पाहा',
              text: 'तापमान, हवेतील आर्द्रता, वाऱ्याचा वेग आणि पावसाची शक्यता तपासा.'
            },
            {
              step: 'पायरी २: पिकाची वाढीची अवस्था निवडा',
              text: 'रोप अवस्था, वाढीची अवस्था, फुले किंवा फळ धारणा अवस्था निवडा.'
            },
            {
              step: 'पायरी ३: किडींचा धोका तपासा',
              text: 'कमी, मध्यम किंवा जास्त धोका पाहून सतर्क व्हा.'
            },
            {
              step: 'पायरी ४: सुरक्षित फवारणी वेळ',
              text: '"फवारणीसाठी सुरक्षित" असा संदेश आल्यावरच फवारणी करा.'
            }
          ],
          tips: [
            'सकाळी ७ ते १० किंवा दुपारी ४ नंतर फवारणी करणे सर्वोत्तम ठरते.',
            'दुपारच्या कडक उन्हात फवारणी करू नका.'
          ]
        },
        crops: {
          heading: 'विभाग ४: पिके व जमीन ज्ञानकोश',
          whyItMatters: 'महाराष्ट्रातील काळी कसदार रेगुर जमीन असो वा लाल जमीन, योग्य वाण निवडल्यास कमी खर्चात अधिक उत्पन्न मिळते.',
          steps: [
            {
              step: '८ प्रकारच्या जमिनींची माहिती',
              text: 'काळी जमीन, गाळाची जमीन, जांभी जमीन, तांबडी जमीन इत्यादींचे गुणधर्म समजून घ्या.'
            },
            {
              step: '१५ प्रमुख पिकांची संपूर्ण माहिती',
              text: 'सोयाबीन, कापूस, ऊस, हरभरा, गहू, तूर, कांदा, टोमॅटो इत्यादींच्या लागवडीचे तंत्रज्ञान.'
            },
            {
              step: 'पीक फेरपालट करा',
              text: 'तृणधान्यानंतर कडधान्य (उदा. हरभरा किंवा मूग) घेतल्यास जमिनीची सुपीकता टिकून राहते.'
            }
          ],
          tips: [
            'कडधान्य पिकांच्या मुळांवरील गाठी हवेतील नत्र जमिनीत साठवतात.'
          ]
        },
        helpline: {
          heading: 'विभाग ५: शेतकरी मदत व हेल्पलाइन क्रमांक',
          whyItMatters: 'कोणत्याही शेतीविषयक अडचणीत किंवा रोगराईच्या काळात थेट तज्ज्ञ कृषी शास्त्रज्ञांचा सल्ला मिळवा.',
          contacts: [
            {
              name: 'किसान कॉल सेंटर (भारत सरकार)',
              number: '1800-180-1551',
              timing: 'सकाळी ६ ते रात्री १० (आठवड्याचे सातही दिवस)',
              languages: 'मराठी व इतर २१ प्रादेशिक भाषांमध्ये',
              badge: 'टोल-फ्री (विनामूल्य)'
            },
            {
              name: 'पीएम-किसान सन्मान निधी हेल्पलाइन',
              number: '155261 / 011-24300606',
              timing: 'सकाळी १० ते संध्याकाळी ५',
              languages: 'मराठी, हिंदी, इंग्रजी',
              badge: 'थेट मदत'
            },
            {
              name: 'कृषी विज्ञान केंद्र व शास्त्रज्ञ सल्ला',
              number: '011-25841000',
              timing: 'कार्यालयीन वेळेत',
              languages: 'रोग निदान व तांत्रिक सल्ला',
              badge: 'तज्ज्ञ सल्ला'
            }
          ]
        }
      }
    }
  };

  const currentContent = content[lang] || content.en;
  const currentSectionData = currentContent.sections[activeSection];

  const handleToggleVoice = () => {
    if (isAudioPlaying) {
      stopSpeech();
      setIsAudioPlaying(false);
    } else {
      let speechScript = `${currentContent.title}. `;
      if (activeSection === 'overview') {
        speechScript += currentContent.overviewText;
      } else if (activeSection === 'leaf' || activeSection === 'soil' || activeSection === 'pest' || activeSection === 'crops') {
        const sec = currentContent.sections[activeSection] as any;
        speechScript += `${sec.heading}. ${sec.whyItMatters || ''}. `;
        if (sec.steps) {
          sec.steps.forEach((s: any) => {
            speechScript += `${s.step}: ${s.text}. `;
          });
        }
      } else if (activeSection === 'helpline') {
        speechScript += `${currentContent.sections.helpline.heading}. Kisan Call Centre toll free number is 1800-180-1551. Available from 6 AM to 10 PM in your regional language.`;
      }

      setIsAudioPlaying(true);
      speakText(speechScript, lang, () => {
        setIsAudioPlaying(false);
      });
    }
  };

  const handleNavigate = (tab: string) => {
    stopSpeech();
    setIsAudioPlaying(false);
    onClose();
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[var(--pastel-card,white)] border border-[var(--pastel-border,#d4e5da)] rounded-3xl shadow-2xl overflow-hidden my-4">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[var(--pastel-accent-light,#e4f4ec)] via-[var(--pastel-card,white)] to-[var(--pastel-surface,#edf5ef)] border-b border-[var(--pastel-border,#d4e5da)] px-5 py-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--pastel-accent,#2e7d52)] text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[var(--pastel-text-title,#142d1f)]">
                {currentContent.title}
              </h2>
              <p className="text-xs text-[var(--pastel-text-muted,#587564)] hidden sm:block">
                {currentContent.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Readout Button */}
            <button
              onClick={handleToggleVoice}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                isAudioPlaying 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-[var(--pastel-surface,#edf5ef)] hover:bg-[var(--pastel-accent-light,#e4f4ec)] border border-[var(--pastel-border,#d4e5da)] text-[var(--pastel-accent,#2e7d52)]'
              }`}
              title={isAudioPlaying ? currentContent.stopAudio : currentContent.listenAll}
            >
              {isAudioPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {isAudioPlaying ? currentContent.stopAudio : currentContent.listenAll}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopSpeech();
                setIsAudioPlaying(false);
                onClose();
              }}
              className="p-1.5 rounded-xl hover:bg-[var(--pastel-surface,#edf5ef)] text-[var(--pastel-text-muted,#587564)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="bg-[var(--pastel-surface,#edf5ef)] border-b border-[var(--pastel-border-subtle,#e2ede5)] px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: currentContent.tabs.overview, icon: HelpCircle },
            { id: 'leaf', label: currentContent.tabs.leaf, icon: Sprout },
            { id: 'soil', label: currentContent.tabs.soil, icon: Layers },
            { id: 'pest', label: currentContent.tabs.pest, icon: Bug },
            { id: 'crops', label: currentContent.tabs.crops, icon: BookOpen },
            { id: 'helpline', label: currentContent.tabs.helpline, icon: PhoneCall },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  stopSpeech();
                  setIsAudioPlaying(false);
                  setActiveSection(item.id as any);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[var(--pastel-card,white)] text-[var(--pastel-accent,#2e7d52)] border border-[var(--pastel-accent-border,#bce3cb)] shadow-2xs'
                    : 'text-[var(--pastel-text-muted,#587564)] hover:text-[var(--pastel-text-title,#142d1f)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Section Heading & Why It Matters */}
          <div>
            <h3 className="text-lg font-bold text-[var(--pastel-text-title,#142d1f)] mb-1">
              {(currentSectionData as any).heading}
            </h3>
            {(currentSectionData as any).whyItMatters && (
              <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">
                    {lang === 'hi' ? 'यह क्यों महत्वपूर्ण है?' : lang === 'mr' ? 'हे का महत्त्वाचे आहे?' : 'Why This Matters to You:'}
                  </strong>{' '}
                  {(currentSectionData as any).whyItMatters}
                </div>
              </div>
            )}
          </div>

          {/* Overview Tab Content */}
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--pastel-text-body,#2b4536)] leading-relaxed">
                {currentContent.overviewText}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {currentContent.sections.overview.bullets.map((b, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[var(--pastel-surface,#edf5ef)] border border-[var(--pastel-border,#d4e5da)] space-y-1.5 hover:border-[var(--pastel-accent-border,#bce3cb)] transition-all">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--pastel-accent,#2e7d52)]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{b.title}</span>
                    </div>
                    <p className="text-xs text-[var(--pastel-text-muted,#587564)] leading-relaxed pl-6">
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Jump Buttons to Modules */}
              <div className="p-4 rounded-2xl bg-[var(--pastel-accent-light,#e4f4ec)] border border-[var(--pastel-accent-border,#bce3cb)] mt-4">
                <h4 className="text-xs font-bold text-[var(--pastel-accent,#2e7d52)] uppercase tracking-wider mb-2">
                  {lang === 'hi' ? 'सीधे संबंधित मॉड्यूल पर जाएं:' : lang === 'mr' ? 'थेट संबंधित विभागावर जा:' : 'Quick Jump to Modules:'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleNavigate('cropHealth')}
                    className="p-2.5 rounded-xl bg-white border border-[var(--pastel-border,#d4e5da)] hover:border-[var(--pastel-accent,#2e7d52)] text-left transition-all"
                  >
                    <Sprout className="w-4 h-4 text-emerald-600 mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">Leaf Doctor</span>
                    <span className="text-[10px] text-slate-500">पत्ते की जांच</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('soilAssessment')}
                    className="p-2.5 rounded-xl bg-white border border-[var(--pastel-border,#d4e5da)] hover:border-[var(--pastel-accent,#2e7d52)] text-left transition-all"
                  >
                    <Layers className="w-4 h-4 text-amber-600 mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">Soil & Fertilizer</span>
                    <span className="text-[10px] text-slate-500">खाद कैलकुलेटर</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('pestRisk')}
                    className="p-2.5 rounded-xl bg-white border border-[var(--pastel-border,#d4e5da)] hover:border-[var(--pastel-accent,#2e7d52)] text-left transition-all"
                  >
                    <Bug className="w-4 h-4 text-rose-600 mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">Pest Risk</span>
                    <span className="text-[10px] text-slate-500">कीट व छिड़काव</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('cropSoilExplorer')}
                    className="p-2.5 rounded-xl bg-white border border-[var(--pastel-border,#d4e5da)] hover:border-[var(--pastel-accent,#2e7d52)] text-left transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-sky-600 mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">Crop Guide</span>
                    <span className="text-[10px] text-slate-500">फसल ज्ञानकोष</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Leaf / Soil / Pest / Crops Tab Steps */}
          {(activeSection === 'leaf' || activeSection === 'soil' || activeSection === 'pest' || activeSection === 'crops') && (
            <div className="space-y-4">
              <div className="space-y-3">
                {(currentSectionData as any).steps?.map((s: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[var(--pastel-surface,#edf5ef)] border border-[var(--pastel-border,#d4e5da)] flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[var(--pastel-accent,#2e7d52)] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--pastel-text-title,#142d1f)]">
                        {s.step}
                      </h4>
                      <p className="text-xs text-[var(--pastel-text-body,#2b4536)] leading-relaxed">
                        {s.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button to open this module */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    if (activeSection === 'leaf') handleNavigate('cropHealth');
                    else if (activeSection === 'soil') handleNavigate('soilAssessment');
                    else if (activeSection === 'pest') handleNavigate('pestRisk');
                    else if (activeSection === 'crops') handleNavigate('cropSoilExplorer');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--pastel-accent,#2e7d52)] text-white text-xs font-bold hover:bg-[var(--pastel-accent-hover,#256b44)] transition-all shadow-xs"
                >
                  <span>
                    {lang === 'hi' ? 'इस मॉड्यूल पर जाएं' : lang === 'mr' ? 'या विभागावर जा' : 'Open This Feature Now'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Farmer Pro Tips Card */}
              {(currentSectionData as any).tips && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>{lang === 'hi' ? 'किसान मित्र सलाह (विशेष सावधानियां):' : lang === 'mr' ? 'शेतकरी मित्र सल्ला (महत्त्वाची काळजी):' : 'Farmer Pro Tips & Field Precautions:'}</span>
                  </h5>
                  <ul className="text-xs text-emerald-950 space-y-1 list-disc pl-5">
                    {(currentSectionData as any).tips.map((tip: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Helpline Tab Content */}
          {activeSection === 'helpline' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-[var(--pastel-text-body,#2b4536)]">
                {lang === 'hi' 
                  ? 'खेती में किसी भी संदेह या प्राकृतिक आपदा के समय भारत सरकार के निःशुल्क नंबरों पर संपर्क करें:'
                  : lang === 'mr'
                  ? 'शेतीविषयक कोणत्याही शंकेसाठी अथवा संकटाच्या वेळी भारत सरकारच्या खालील टोल-फ्री क्रमांकावर संपर्क करा:'
                  : 'Call these verified government and research helplines for immediate agronomy guidance and emergency assistance:'}
              </p>

              <div className="space-y-3">
                {currentContent.sections.helpline.contacts.map((contact, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[var(--pastel-surface,#edf5ef)] border border-[var(--pastel-border,#d4e5da)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[var(--pastel-text-title,#142d1f)]">
                          {contact.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--pastel-accent-light,#e4f4ec)] text-[var(--pastel-accent,#2e7d52)] border border-[var(--pastel-accent-border,#bce3cb)]">
                          {contact.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--pastel-text-muted,#587564)]">
                        ⏰ {contact.timing} • 🗣️ {contact.languages}
                      </p>
                    </div>

                    <a
                      href={`tel:${contact.number.split('/')[0].trim()}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs shrink-0"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{contact.number}</span>
                    </a>
                  </div>
                ))}
              </div>

              {/* Direct Toll-Free Quick Action Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">
                    Kisan Call Centre (Toll-Free 24x7 / 1800-180-1551)
                  </h4>
                  <p className="text-xs text-emerald-100">
                    Directly speak to an Agricultural Graduate in your mother tongue.
                  </p>
                </div>
                <a
                  href="tel:18001801551"
                  className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition-colors shrink-0"
                >
                  📞 Dial 1800-180-1551
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[var(--pastel-surface,#edf5ef)] border-t border-[var(--pastel-border,#d4e5da)] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--pastel-text-muted,#587564)]">
            <ShieldCheck className="w-4 h-4 text-[var(--pastel-accent,#2e7d52)]" />
            <span>Designed for Bharat Farmers • PlantVillage + ICAR Standards</span>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              setIsAudioPlaying(false);
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-[var(--pastel-card,white)] border border-[var(--pastel-border,#d4e5da)] text-[var(--pastel-text-title,#142d1f)] font-bold hover:bg-[var(--pastel-surface-hover,#e3efe6)] transition-colors"
          >
            {lang === 'hi' ? 'बंद करें' : lang === 'mr' ? 'बंद करा' : 'Close Guide'}
          </button>
        </div>
      </div>
    </div>
  );
};
