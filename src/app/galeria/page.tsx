import InfinitePhotoGallery from '@/components/InfinitePhotoGallery';
import Link from 'next/link';
import photos from '@/data/gallery.json';

export default async function GalleryPage() {

    return (
        <main className="min-h-screen py-10 px-4 md:py-20 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-light rounded-full blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-6xl mx-auto space-y-12 relative z-10">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl gold-text font-serif leading-tight">
                        Galeria de Memórias
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Um pouquinho de cada momento especial da nossa pequena Elise.
                    </p>
                </div>

                <InfinitePhotoGallery allPhotos={photos.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))} />
            </div>

            <footer className="mt-20 text-center text-gray-400 text-sm italic py-10">
                Com amor, Papai e Mamãe! ❤️
            </footer>
        </main>
    );
}
