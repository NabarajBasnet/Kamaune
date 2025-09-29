import { useState, useEffect, useRef } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Pause,
    Play,
    TrendingUp,
    Gift,
    Sparkles,
    Zap,
    Star,
} from "lucide-react";
import { Button } from "../ui/button";
interface SlideContent {
    image: string;
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonAction?: () => void;
    badge?: string;
    icon?: React.ReactNode;
    gradient?: string;
}

interface PromotionalCarouselProps {
    slides?: SlideContent[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    height?: string;
    className?: string;
}

const defaultSlides: SlideContent[] = [
    {
        image: "https://picsum.photos/1400/500?random=1",
        title: "Boost Your Sales",
        subtitle: "UP TO 50% COMMISSION",
        description:
            "Join our exclusive affiliate program and earn incredible commissions on every sale",
        buttonText: "Start Earning Now",
        badge: "LIMITED TIME",
        icon: <TrendingUp className="w-8 h-8" />,
        gradient: "from-blue-600 to-purple-600",
    },
    {
        image: "https://picsum.photos/1400/500?random=2",
        title: "Special Offers",
        subtitle: "EXCLUSIVE DEALS",
        description:
            "Get access to premium offers and maximize your earning potential",
        buttonText: "View Offers",
        badge: "HOT",
        icon: <Gift className="w-8 h-8" />,
        gradient: "from-green-600 to-teal-600",
    },
    {
        image: "https://picsum.photos/1400/500?random=3",
        title: "Premium Coupons",
        subtitle: "SAVE MORE, EARN MORE",
        description: "Discover high-value coupons that your audience will love",
        buttonText: "Browse Coupons",
        badge: "NEW",
        icon: <Sparkles className="w-8 h-8" />,
        gradient: "from-purple-600 to-pink-600",
    },
    {
        image: "https://picsum.photos/1400/500?random=4",
        title: "Launch Campaign",
        subtitle: "REACH MILLIONS",
        description:
            "Create powerful campaigns and connect with your target audience",
        buttonText: "Create Campaign",
        badge: "TRENDING",
        icon: <Zap className="w-8 h-8" />,
        gradient: "from-orange-600 to-red-600",
    },
    {
        image: "https://picsum.photos/1400/500?random=5",
        title: "Top Performer",
        subtitle: "JOIN THE ELITE",
        description:
            "Become a top affiliate and unlock exclusive benefits and rewards",
        buttonText: "Learn More",
        badge: "EXCLUSIVE",
        icon: <Star className="w-8 h-8" />,
        gradient: "from-yellow-600 to-orange-600",
    },
];

export function PromotionalCarousel({
    slides = defaultSlides,
    autoPlay = true,
    autoPlayInterval = 5000,
    height = "h-[500px]",
    className = "",
}: PromotionalCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Preload images
    useEffect(() => {
        const preloadImages = () => {
            slides.forEach((slide, index) => {
                const img = new Image();
                img.src = slide.image;
                img.onload = () => {
                    setLoadedImages((prev) => new Set([...prev, index]));
                    if (index === 0) setIsLoading(false);
                };
            });
        };
        preloadImages();
    }, [slides]);

    // Auto-play functionality
    useEffect(() => {
        if (isPlaying && slides.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
            }, autoPlayInterval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, slides.length, autoPlayInterval]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && slides.length > 1) {
            goToNext();
        }
        if (isRightSwipe && slides.length > 1) {
            goToPrevious();
        }
    };

    return (
        <div
            className={`relative w-full ${height} overflow-hidden rounded-2xl shadow-2xl ${className}`}
        >
            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 animate-pulse flex items-center justify-center z-30">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            Loading amazing offers...
                        </p>
                    </div>
                </div>
            )}

            {/* Slides Container */}
            <div
                className="relative h-full flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0 relative">
                        {/* Background Image */}
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-fill"
                            loading={index === 0 ? "eager" : "lazy"}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                                <div className="max-w-4xl">
                                    {/* Left Content */}
                                    <div className="flex-1 pr-4">
                                        {/* Badge and Title Row */}
                                        <div className="flex items-center gap-4 mb-2">
                                            {slide.badge && (
                                                <span
                                                    className={`px-3 py-1 bg-gradient-to-r ${slide.gradient} text-white text-xs font-bold rounded-full shadow-lg`}
                                                >
                                                    {slide.badge}
                                                </span>
                                            )}
                                            {slide.icon && (
                                                <div
                                                    className={`p-2 bg-gradient-to-br ${slide.gradient} text-white rounded-lg shadow-lg`}
                                                >
                                                    {slide.icon}
                                                </div>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
                                            {slide.title}
                                        </h2>

                                        {/* Subtitle */}
                                        <h3
                                            className={`text-sm md:text-base lg:text-lg font-semibold bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent mb-2`}
                                        >
                                            {slide.subtitle}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm md:text-base text-gray-200 leading-relaxed line-clamp-2">
                                            {slide.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* View More Button - Center Right */}
                        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20">
                            <Button
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 text-sm font-semibold rounded-lg transform transition-all hover:scale-105 shadow-lg"
                                onClick={() => {
                                    // TODO: Link to specific page later
                                }}
                            >
                                View More
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            {slides.length > 1 && (
                <>
                    {/* Previous Button - Bottom Left */}
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 bottom-4 z-20 p-2 bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white rounded-md transition-all focus:outline-none"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Next Button - Bottom Right */}
                    <button
                        onClick={goToNext}
                        className="absolute right-4 bottom-4 z-20 p-2 bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white rounded-md transition-all focus:outline-none"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePlayPause}
                        className="absolute top-4 right-4 z-20 p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5" />
                        ) : (
                            <Play className="w-5 h-5" />
                        )}
                    </button>
                </>
            )}

            {/* Indicators */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all focus:outline-none ${index === currentIndex
                                ? "w-12 h-3 bg-white rounded-full shadow-lg"
                                : "w-3 h-3 bg-white/40 hover:bg-white/60 rounded-full"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Progress Bar */}
            {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                        style={{
                            width: "100%",
                            animation: `progress ${autoPlayInterval}ms linear infinite`,
                        }}
                    />
                </div>
            )}

            <style>{`
        @keyframes progress {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
        </div>
    );
}
