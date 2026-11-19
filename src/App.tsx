/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { HeroVideoSection } from './components/HeroVideoSection';
import { Navbar } from './components/Navbar';
import { PaintSimulator3D } from './components/PaintSimulator3D';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsSection } from './components/TestimonialsSection';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A]">
      <Navbar />
      <main>
        <HeroVideoSection />
        <ServicesSection />
        <PaintSimulator3D />
        <GallerySection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
