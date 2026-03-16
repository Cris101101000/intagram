'use client';

export function MockBanner() {
  if (process.env.NEXT_PUBLIC_MOCK_MODE !== 'true') return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-black text-center text-xs font-semibold py-1 tracking-wide">
      MOCK MODE — Los datos mostrados son ficticios
    </div>
  );
}
