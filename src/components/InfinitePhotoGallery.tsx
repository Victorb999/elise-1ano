'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface Photo {
    id: string;
    name: string;
    url: string;
}

interface InfinitePhotoGalleryProps {
    allPhotos: Photo[];
}

export default function InfinitePhotoGallery({ allPhotos }: InfinitePhotoGalleryProps) {
    const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const ITEMS_PER_PAGE = 12;

    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);
        // Simular um atraso para o efeito de carregamento
        setTimeout(() => {
            const currentLength = displayedPhotos.length;
            const nextBatch = allPhotos.slice(currentLength, currentLength + ITEMS_PER_PAGE);

            setDisplayedPhotos(prev => [...prev, ...nextBatch]);
            setHasMore(currentLength + nextBatch.length < allPhotos.length);
            setLoading(false);
        }, 500);
    }, [allPhotos, displayedPhotos.length, hasMore, loading]);

    useEffect(() => {
        // Carregar o primeiro lote
        setDisplayedPhotos(allPhotos.slice(0, ITEMS_PER_PAGE));
        setHasMore(allPhotos.length > ITEMS_PER_PAGE);
    }, [allPhotos]);

    const lastPhotoRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, loadMore]
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Modal / Lightbox */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute -top-12 right-0 text-white hover:text-gold transition-colors p-2 text-xl"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            ✕ Fechar
                        </button>

                        <div className="relative w-full aspect-auto min-h-[50vh] flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <Image
                                src={`https://drive.google.com/thumbnail?id=${selectedPhoto.id}&sz=w2000`}
                                alt={selectedPhoto.name}
                                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                                width={1920}
                                height={1080}
                                unoptimized={true}
                                priority={true}
                                referrerPolicy="no-referrer"
                            />
                        </div>

                        <div className="flex flex-col items-center gap-2 text-white">
                            <p className="text-sm opacity-70">{selectedPhoto.name}</p>
                            <a
                                href={`https://drive.google.com/uc?export=download&id=${selectedPhoto.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 px-8 py-3 bg-gold text-white rounded-full font-bold hover:bg-gold-light transition-all flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
                            >
                                📥 Baixar Foto Original
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedPhotos.map((photo, index) => (
                    <div
                        key={photo.id + index}
                        ref={index === displayedPhotos.length - 1 ? lastPhotoRef : null}
                        onClick={() => setSelectedPhoto(photo)}
                        className="aspect-square relative overflow-hidden rounded-2xl shadow-sm border border-gold/10 group cursor-pointer"
                    >
                        <Image
                            src={`https://drive.google.com/thumbnail?id=${photo.id}&sz=w1000`}
                            alt={photo.name}
                            fill
                            unoptimized={true}
                            priority={index < 4}
                            referrerPolicy="no-referrer"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <span className="text-white text-xs truncate w-full">{photo.name}</span>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center p-10">
                    <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                </div>
            )}

            {!hasMore && allPhotos.length > 0 && (
                <p className="text-center text-gray-400 italic pt-10">
                    Você chegou ao fim das memórias! ✨
                </p>
            )}

            {allPhotos.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500">Nenhuma foto encontrada na pasta.</p>
                </div>
            )}
        </div>
    );
}
