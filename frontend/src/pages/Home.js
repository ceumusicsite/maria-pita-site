import { Hero } from '@/components/Hero';
import { ReleasesSection } from '@/components/ReleasesSection';
import { ShowsSection } from '@/components/ShowsSection';
import { ProductsSection } from '@/components/ProductsSection';
import { FiquePorDentroSection } from '@/components/FiquePorDentroSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { BackgroundWatermarks } from '@/components/BackgroundWatermarks';

export default function Home() {
  return (
    <main className="relative bg-[#0A0A0A]">
      <Hero />
      <div className="relative w-full overflow-hidden">
        {/* Parallax Background Vertical Texts & Ambient Glows */}
        <BackgroundWatermarks />
        
        <ReleasesSection />
        <ShowsSection />
        <ProductsSection />
        <FiquePorDentroSection />
        <NewsletterSection />
      </div>
    </main>
  );
}
