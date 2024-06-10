import Hero from '@/components/hero';
import performanceImg from '../../../public/performance.jpg'

export default function PerformancePage() {
  return (
   <div>
    <Hero imgData={performanceImg} imgAlt='welding' title="We server high performance applications" />
    </div>
  );
}
