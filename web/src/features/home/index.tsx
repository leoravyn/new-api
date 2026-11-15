import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'

import { TokexHeroSection } from './components/tokex/hero-section'

export function Home() {
  return (
    <PublicLayout showMainContainer={false}>
      <div className='relative min-h-screen'>
        <TokexHeroSection />
      </div>
      <Footer />
    </PublicLayout>
  )
}
