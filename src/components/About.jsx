import React from 'react';
import logo from "../assets/Book-abute-img.jpg";
import AnimateOnScroll from './AnimateOnScroll';

const About = () => {
  return (
    <section id="about" className="py-16 px-4">
      <AnimateOnScroll animation="fadeInUp">
        <h2 className="text-3xl font-tajawal font-bold text-center text-primary mb-10">من نحن</h2>
      </AnimateOnScroll>
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <AnimateOnScroll animation="fadeInRight" className="md:w-1/2">
          <img 
            src={logo} 
            alt="مكتبة متجر جيم" 
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </AnimateOnScroll>
        
        <div className="md:w-1/2 space-y-4 text-text-color">
          <AnimateOnScroll animation="fadeInLeft" delay={0.2}>
            <p className="text-lg leading-relaxed">
              متجر جيم هو المتجر الأول لبيع الكتب واستعارتها في محافظة إدلب. تأسس المتجر في عام 2023 بهدف نشر الثقافة والمعرفة في المجتمع.
            </p>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="fadeInLeft" delay={0.4}>
            <p className="text-lg leading-relaxed">
              نسعى في متجر جيم لتوفير مجموعة متنوعة من الكتب بأسعار مناسبة، بالإضافة إلى خدمة استعارة الكتب لمن يرغب في القراءة دون الحاجة للشراء.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

export default About;