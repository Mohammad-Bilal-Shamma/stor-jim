import React, { useState, useEffect } from 'react';
import '../styles/DailyQuote.css';

// Collection of quotes from popular books
const bookQuotes = [
  {
    quote: "إن الحياة ليست سوى ظل عابر، ممثل مسكين يتبختر ويتباهى ساعته على المسرح ثم لا يُسمع له صوت.",
    book: "مكبث",
    author: "وليام شكسبير"
  },
  {
    quote: "كل ما هو ذهبي يفنى، وكالأشجار الخضراء يذبل، والعصر القديم يضيع، والشباب يشيخ، والحكمة اليومية تفقد بريقها.",
    book: "سيد الخواتم",
    author: "ج. ر. ر. تولكين"
  },
  {
    quote: "لا يمكنك أن تعيش حياتك للآخرين. عليك أن تكون أنت نفسك، فردًا مستقلًا.",
    book: "ليتل وومن",
    author: "لويزا ماي ألكوت"
  },
  {
    quote: "الخوف يقتل العقل. الخوف هو الموت الصغير الذي يجلب الفناء الكلي.",
    book: "ديون",
    author: "فرانك هربرت"
  },
  {
    quote: "الحياة تتكون من لحظات صغيرة، كل منها مهم.",
    book: "ألف شمس مشرقة",
    author: "خالد حسيني"
  },
  {
    quote: "الأمل هو الشيء الوحيد الأقوى من الخوف.",
    book: "مباريات الجوع",
    author: "سوزان كولينز"
  },
  {
    quote: "لا تحكم على يومك بحصاد المساء، بل بالبذور التي زرعتها.",
    book: "الخيميائي",
    author: "باولو كويلو"
  },
  {
    quote: "الكتب هي المرايا: أنت ترى فيها فقط ما هو موجود بالفعل في داخلك.",
    book: "ظل الريح",
    author: "كارلوس زافون"
  },
  {
    quote: "الحياة ليست عادلة، وربما هذا أمر جيد بالنسبة لمعظمنا.",
    book: "الأمير والفقير",
    author: "مارك توين"
  },
  {
    quote: "الكلمات هي، في رأيي المتواضع، مصدرنا الأكثر لا نهائية من السحر.",
    book: "هاري بوتر",
    author: "ج. ك. رولينج"
  }
];

const DailyQuote = () => {
  const [quote, setQuote] = useState(null);
  const [isNewDay, setIsNewDay] = useState(true);

  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * bookQuotes.length);
    return bookQuotes[randomIndex];
  };

  // Function to check if we need a new quote for the day
  const checkForNewDay = () => {
    const lastQuoteDate = localStorage.getItem('lastQuoteDate');
    const today = new Date().toDateString();
    
    if (lastQuoteDate !== today) {
      localStorage.setItem('lastQuoteDate', today);
      return true;
    }
    return false;
  };

  // Function to get today's quote
  const getTodayQuote = () => {
    // Check if we need a new quote for today
    if (checkForNewDay()) {
      const newQuote = getRandomQuote();
      localStorage.setItem('dailyQuote', JSON.stringify(newQuote));
      return newQuote;
    } else {
      // Get the saved quote for today
      const savedQuote = localStorage.getItem('dailyQuote');
      return savedQuote ? JSON.parse(savedQuote) : getRandomQuote();
    }
  };

  // Initialize quote on component mount
  useEffect(() => {
    setQuote(getTodayQuote());
  }, []);

  // Function to manually refresh the quote
  const refreshQuote = () => {
    setQuote(getRandomQuote());
    setIsNewDay(false); // Mark that we've manually changed the quote
  };

  if (!quote) return null;

  return (
    <div className="daily-quote-container">
      <div className="container mx-auto max-w-4xl">
        <div className="daily-quote-card">
          <div className="quote-decoration-top"></div>
          <div className="quote-decoration-bottom"></div>
          
          <div className="quote-content">
            <h2 className="text-2xl font-bold text-center text-primary mb-6">اقتباس اليوم</h2>
            
            <div className="text-center mb-6">
              <p className="quote-text">{quote.quote}</p>
              <div className="quote-source">
                <p className="quote-book">{quote.book}</p>
                <p className="quote-author">— {quote.author}</p>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={refreshQuote}
                className="refresh-button"
              >
                اقتباس آخر
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuote;