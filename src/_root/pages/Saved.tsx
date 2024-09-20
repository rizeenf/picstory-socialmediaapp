// import FaceCam from "@/components/shared/FaceCam"

import Loader from '@/components/shared/Loader';
import { lazy, Suspense } from 'react';

const FaceCam = lazy(() => import('@/components/shared/FaceCam'));

const Saved = () => {
  return (
    <div>Saved

      <Suspense fallback={<Loader />}>
        <FaceCam />
      </Suspense>
    </div>
  )
}

export default Saved