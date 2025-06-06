import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: 'أفضل متجر للكتب في إدلب! تنوع كبير في الكتب وأسعار مناسبة جداً. أنصح الجميع بالتعامل معهم.',
      author: 'أحمد محمد',
      role: 'عميل دائم'
    },
    {
      id: 2,
      text: 'فواصل الكتب التي اشتريتها من متجر جيم رائعة جداً وذات جودة عالية. سأعود للشراء منهم مرة أخرى بالتأكيد.',
      author: 'سارة المحمود',
      role: 'طالبة جامعية'
    },
    {
      id: 3,
      text: 'خدمة ممتازة وسرعة في التوصيل. الكتب التي اشتريتها كانت بحالة ممتازة وبأسعار معقولة. شكراً متجر جيم!',
      author: 'محمد علي',
      role: 'مدرس'
    }
  ];

  return (
    <section id="testimonials" className="py-16 px-4">
      <h2 className="text-3xl font-tajawal font-bold text-center text-primary mb-10">آراء عملائنا</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 relative">
            <div className="absolute top-4 right-4 text-2xl text-primary opacity-50">
              <i className="fas fa-quote-right"></i>
            </div>
            <p className="text-gray-700 mb-6 italic leading-relaxed">{testimonial.text}</p>
            <div className="flex items-center">
              <div>
                <h4 className="font-semibold text-primary">{testimonial.author}</h4>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;