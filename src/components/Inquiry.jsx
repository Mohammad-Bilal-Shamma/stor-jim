import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Inquiry = () => {
  // Form state
  const [formData, setFormData] = useState({
    bookTitle: '',
    bookAuthor: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();
  const whatsappNumber = '212723329765';

  // Check for URL parameters to pre-fill the form
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const title = params.get('title');
    const author = params.get('author');

    if (title || author) {
      setFormData(prev => ({
        ...prev,
        bookTitle: title || '',
        bookAuthor: author || ''
      }));
    }
  }, [location]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bookTitle.trim()) {
      newErrors.bookTitle = 'يرجى إدخال عنوان الكتاب';
    }
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'يرجى إدخال اسمك';
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'يرجى إدخال رقم الهاتف';
    } else if (!/^\+?[0-9\s-]{8,}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'يرجى إدخال رقم هاتف صحيح';
    }
    
    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'يرجى إدخال بريد إلكتروني صحيح';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format WhatsApp message
  const formatWhatsAppMessage = () => {
    let message = `*استعلام عن كتاب من متجر جيم*%0A%0A`;
    message += `*عنوان الكتاب:* ${formData.bookTitle}%0A`;
    
    if (formData.bookAuthor) {
      message += `*اسم المؤلف:* ${formData.bookAuthor}%0A`;
    }
    
    message += `%0A*معلومات العميل:*%0A`;
    message += `*الاسم:* ${formData.customerName}%0A`;
    message += `*رقم الهاتف:* ${formData.customerPhone}%0A`;
    
    if (formData.customerEmail) {
      message += `*البريد الإلكتروني:* ${formData.customerEmail}%0A`;
    }
    
    if (formData.additionalInfo) {
      message += `%0A*معلومات إضافية:*%0A${formData.additionalInfo}%0A`;
    }
    
    return message;
  };

  // Send WhatsApp message
  const sendWhatsAppMessage = (message) => {
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const message = formatWhatsAppMessage();
      sendWhatsAppMessage(message);
      setIsSubmitted(true);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      bookTitle: '',
      bookAuthor: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      additionalInfo: ''
    });
    setIsSubmitted(false);
  };

  return (
    <div className="bg-light-bg py-12">
      {/* Hero Section */}
      <div className="text-center py-8 px-4 bg-primary text-white">
        <h1 className="text-3xl font-bold mb-2">استعلام عن كتاب</h1>
        <p className="text-lg max-w-2xl mx-auto">لم تجد الكتاب الذي تبحث عنه؟ أرسل لنا استعلامًا وسنحاول توفيره لك</p>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Information Section */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-primary mb-4">كيف يمكننا مساعدتك؟</h2>
            <p className="mb-8 text-gray-700">
              إذا كنت تبحث عن كتاب غير متوفر في متجرنا، يمكنك إرسال استعلام وسنبذل قصارى جهدنا لتوفيره لك في أقرب وقت ممكن.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <i className="fas fa-search text-primary text-3xl mb-4"></i>
                <h3 className="font-bold text-lg mb-2">البحث عن الكتب النادرة</h3>
                <p className="text-gray-600">نساعدك في العثور على الكتب النادرة أو التي يصعب الحصول عليها.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <i className="fas fa-clock text-primary text-3xl mb-4"></i>
                <h3 className="font-bold text-lg mb-2">استجابة سريعة</h3>
                <p className="text-gray-600">نرد على استعلامك في غضون 24 ساعة لإبلاغك بتوفر الكتاب.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <i className="fas fa-truck text-primary text-3xl mb-4"></i>
                <h3 className="font-bold text-lg mb-2">توصيل سريع</h3>
                <p className="text-gray-600">نوفر لك الكتاب ونوصله إليك في أسرع وقت ممكن.</p>
              </div>
            </div>
          </div>
          
          {/* Form Section */}
          <div className="md:w-1/2">
            {isSubmitted ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="text-center mb-6">
                  <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
                  <h2 className="text-2xl font-bold mb-2">تم إرسال استعلامك بنجاح!</h2>
                  <p className="text-gray-600 mb-6">سيتم التواصل معك قريبًا بخصوص توفر الكتاب.</p>
                  <button 
                    onClick={resetForm}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-accent transition-colors"
                  >
                    إرسال استعلام آخر
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-primary mb-6">نموذج الاستعلام</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="bookTitle" className="block mb-2 font-medium">عنوان الكتاب*</label>
                    <input
                      type="text"
                      id="bookTitle"
                      name="bookTitle"
                      value={formData.bookTitle}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.bookTitle ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.bookTitle && <p className="text-red-500 text-sm mt-1">{errors.bookTitle}</p>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bookAuthor" className="block mb-2 font-medium">اسم المؤلف</label>
                    <input
                      type="text"
                      id="bookAuthor"
                      name="bookAuthor"
                      value={formData.bookAuthor}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label htmlFor="customerName" className="block mb-2 font-medium">اسمك*</label>
                      <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="customerPhone" className="block mb-2 font-medium">رقم الهاتف*</label>
                      <input
                        type="tel"
                        id="customerPhone"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="customerEmail" className="block mb-2 font-medium">البريد الإلكتروني</label>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.customerEmail ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="additionalInfo" className="block mb-2 font-medium">معلومات إضافية</label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      rows="4"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                  
                  <div className="mt-6">
                    <button 
                      type="submit" 
                      className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-accent transition-colors font-medium"
                    >
                      إرسال الاستعلام
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquiry;