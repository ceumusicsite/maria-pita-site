import { Hero } from '@/components/Hero';
import { ReleasesSection } from '@/components/ReleasesSection';
import { ShowsSection } from '@/components/ShowsSection';
import { ProductsSection } from '@/components/ProductsSection';
import { FiquePorDentroSection } from '@/components/FiquePorDentroSection';
import { NewsletterSection } from '@/components/NewsletterSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <ReleasesSection />
      <ShowsSection />
      <ProductsSection />
      <FiquePorDentroSection />
      <NewsletterSection />
    </main>
  );
}
