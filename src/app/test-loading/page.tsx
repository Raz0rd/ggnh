'use client';

import LoadingCep from '@/components/LoadingCep';

export default function TestLoadingPage() {
  return <LoadingCep onComplete={() => console.log('Loading completo!')} />;
}
