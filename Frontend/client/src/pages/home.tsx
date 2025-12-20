import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  CommunityCard,
  type CommunityCardProps,
} from "@/components/community-card";

export default function Home() {
  const [approvedCommunities, setApprovedCommunities] = useState<
    CommunityCardProps[]
  >([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchApprovedCommunities = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/communities/approved",
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setApprovedCommunities(data);
      } catch (error) {
        console.error("Failed to fetch approved communities:", error);
      }
    };
    fetchApprovedCommunities();
  }, []);

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons();
      return () => slider.removeEventListener("scroll", checkScrollButtons);
    }
  }, [approvedCommunities]);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 340;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />

        <section className="py-16 md:py-24 bg-gradient-to-b from-orange-50/50 to-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                  Featured Communities
                </h2>
                <p className="text-lg text-gray-600">
                  Discover verified and trending communities across India
                </p>
              </div>
              <Link href="/zones">
                <Button
                  variant="outline"
                  className="hidden md:flex border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400"
                  data-testid="button-view-all-communities"
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative group">
              <button
                onClick={() => scroll("left")}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 ${
                  canScrollLeft
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>

              <div
                ref={sliderRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {approvedCommunities.map((community) => (
                  <CommunityCard key={community._id} {...community} />
                ))}
              </div>

              <button
                onClick={() => scroll("right")}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 ${
                  canScrollRight
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            <div className="flex justify-center mt-8 md:hidden">
              <Link href="/zones">
                <Button
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  View All Communities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
