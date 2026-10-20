"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import ChatWidget from "@/components/ChatWidget";
import { motion, Variants } from "framer-motion";

// ---------------- ZOD SCHEMA ----------------
const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormData = z.infer<typeof ContactSchema>;

type GalleryImage = {
  id: number;
  fileName: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
};

type GalleryEvent = {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: string | null;
  galleryImages: GalleryImage[];
};

type Testimonial = {
  id: number;
  author_name: string;
  text: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    author_name: "Rajesh N",
    text: "We are very happy with the caring and supportive environment at TrueSunshine. Our child enjoys coming to school every day.",
    rating: 5,
  },
  {
    id: 2,
    author_name: "Swarna Kumari V",
    text: "The teachers are patient, friendly, and attentive to every child. We have seen a wonderful change in our child's confidence.",
    rating: 4,
  },
  {
    id: 3,
    author_name: "Ashwini K",
    text: "TrueSunshine provides a warm and joyful learning environment. We really appreciate the Montessori approach and individual attention.",
    rating: 3,
  },
  {
    id: 4,
    author_name: "Sarath T",
    text: "A lovely preschool with caring teachers and a positive atmosphere. Our child has developed a genuine interest in learning.",
    rating: 3,
  },
  {
    id: 5,
    author_name: "Kavya M",
    text: "We appreciate the school's focus on independence, creativity, and overall development. The staff have been very supportive throughout.",
    rating: 5,
  },
];

// ---------------- PAGE ----------------
export default function HomePage() {
  /* ---------------- STATE ---------------- */
  const [menuOpen, setMenuOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const today = new Date();
  const month = today.getMonth(); // 0 = Jan
  const date = today.getDate();
  const [activeGalleryImage, setActiveGalleryImage] = useState<string | null>(
    null,
  );
  const [galleryEvents, setGalleryEvents] = useState<GalleryEvent[]>([]);

  type Festival = "pongal" | "christmas" | "diwali" | null;

  const festival: Festival =
    // 🪔 PONGAL (Jan 14–17)
    month === 0 && date >= 7 && date <= 17
      ? "pongal"
      : // 🎄 CHRISTMAS (Dec 20–31)
        month === 11 && date >= 20
        ? "christmas"
        : // 🪔 DIWALI (example range – adjust yearly)
          month === 9 && date >= 28 && date <= 31
          ? "diwali"
          : null;

  const isFestiveMode = festival !== null;

  /* ---------------- FORM ---------------- */
  const { register, handleSubmit, reset } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  });

  /* ---------------- DATA ---------------- */
  const taglines = ["Nurturing Minds", "Inspiring Hearts", "Building Futures"];

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % taglines.length),
      2500,
    );

    return () => clearInterval(timer);
  }, [taglines.length]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery");

        if (!response.ok) {
          throw new Error("Failed to load gallery.");
        }

        const data = await response.json();

        setGalleryEvents(data.events ?? []);
      } catch (error) {
        console.error("Failed to load gallery:", error);
      }
    };

    fetchGallery();
  }, []);

  const galleryImages = galleryEvents.flatMap((event) =>
    event.galleryImages.map((image) => ({
      ...image,
      eventTitle: event.title,
      eventCategory: event.category,
    })),
  );

  // const [googleReviews, setGoogleReviews] = useState<any[]>([]);

  // const displayedReviews =
  //   googleReviews.length >= 1
  //     ? googleReviews
  //     : [
  //         {
  //           author_name: "Verified Parent",
  //           text: "Parents consistently appreciate our caring environment and child-focused learning approach.",
  //           rating: 5,
  //           fallback: true,
  //         },
  //       ];

  // const canLoopTestimonials = displayedReviews.length > 1;
  const [chatOpen, setChatOpen] = useState(false);
  const displayedReviews = testimonials;
  const canLoopTestimonials = displayedReviews.length > 1;

  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       const res = await fetch("/api/google-reviews");

  //       if (!res.ok) {
  //         console.error("Google Reviews API failed:", res.status);
  //         return;
  //       }

  //       const text = await res.text();

  //       if (!text) {
  //         console.warn("Google Reviews API returned empty response");
  //         return;
  //       }

  //       const data = JSON.parse(text);

  //       if (data?.reviews?.length) {
  //         setGoogleReviews(data.reviews || []);
  //       }
  //     } catch (err) {
  //       console.error("Failed to load Google reviews:", err);
  //     }
  //   };

  //   fetchReviews();
  // }, []);

  const handleShareImage = async (imageUrl: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "TrueSunshine Gallery",
          text: "Check out this moment from TrueSunshine Preschool",
          url: window.location.origin + imageUrl,
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin + imageUrl);
        alert("Image link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const [showGalleryControls, setShowGalleryControls] = useState(true);

  useEffect(() => {
    if (!activeGalleryImage) return;

    setShowGalleryControls(true);

    const timer = setTimeout(() => {
      setShowGalleryControls(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [activeGalleryImage]);

  return (
    <main
      className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-400 via-purple-400
    to-pink-300 text-gray-800 font-sans"
    >
      {/* Responsive Navbar */}
      <nav className="sticky top-0 z-50 h-16 bg-[#555B86] shadow-[0_4px_18px_rgba(75,81,125,0.18)]">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1000 64"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Orange curve */}
            <path
              d="M1000 0 H760 C730 4 710 10 690 20 C670 30 652 43 630 64 H1000 Z"
              fill="#F59A23"
            />

            {/* Brown accent */}
            <path
              d="M1000 0 H750 C720 5 699 12 679 22 C659 32 641 46 620 64 H630 C652 43 670 30 690 20
              C710 10 730 4 760 0 Z"
              fill="#B9824A"
            />
          </svg>
        </div>

        <div className="relative z-10 flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex shrink-0 items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <Image
                src="/TSLogo.png"
                alt="TrueSunshine Logo"
                width={46}
                height={46}
                priority
                quality={100}
                className="h-11 w-11 object-contain"
              />
            </div>
          </div>

          <div className="hidden items-center gap-6 text-sm font-semibold text-white md:flex lg:gap-7">
            <Link
              href="#about"
              className="whitespace-nowrap transition-colors hover:text-[#555B86]"
            >
              About
            </Link>

            <Link
              href="#mission"
              className="whitespace-nowrap transition-colors hover:text-[#555B86]"
            >
              Mission & Vision
            </Link>

            <Link
              href="#gallery"
              className="whitespace-nowrap transition-colors hover:text-[#555B86]"
            >
              Gallery
            </Link>

            <Link
              href="#contact"
              className="whitespace-nowrap transition-colors hover:text-[#555B86]"
            >
              Contact
            </Link>

            <Link
              href="/sign-in"
              className="whitespace-nowrap rounded-full bg-white px-5 py-2 font-semibold text-[#555B86]
              hover:text-white shadow-[0_3px_10px_rgba(0,0,0,0.12)] transition-all hover:scale-[1.03]
              hover:bg-[#555B86]"
            >
              Login
            </Link>
          </div>

          <button
            type="button"
            className="relative z-20 text-white transition-colors hover:text-[#555B86] md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div
            className="
      absolute
      left-0
      right-0
      top-16
      z-[999]
      rounded-b-3xl
      border-t
      border-white/10
      bg-[#555B86]
      px-5
      py-4
      shadow-[0_12px_30px_rgba(75,81,125,0.25)]
      md:hidden
    "
          >
            {["about", "mission", "gallery", "contact"].map((item) => (
              <Link
                key={item}
                href={`#${item}`}
                onClick={() => setMenuOpen(false)}
                className="
          block
          py-1.5
          text-sm
          font-semibold
          text-white
          transition-colors
          hover:text-[#F59A23]
        "
              >
                {item
                  .replace("-", " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </Link>
            ))}

            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="
        mt-3
        block
        rounded-full
        bg-white
        px-5
        py-2.5
        text-center
        text-sm
        font-semibold
        text-[#555B86]
        shadow-md
        transition-all
        hover:bg-[#F59A23]
        hover:text-white
      "
            >
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section
        className="relative flex min-h-[60vh] items-center justify-center overflow-hidden
        xs:min-h-[65vh] sm:min-h-[80vh] md:min-h-[90vh]"
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/gallery1.png')" }}
        />

        {/* Brand overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#4B517D]/60
          via-[#4B517D]/20 to-[#FF9100]/25"
        />

        {/* Soft readability layer */}
        <div className="absolute inset-0 bg-white/10" />

        {/* Decorative brand glows */}
        <div
          className="absolute -left-32 -top-32 hidden h-[500px] w-[500px] rounded-full
          bg-[#4B517D]/20 blur-3xl sm:block"
        />

        <div
          className="absolute -right-32 top-20 hidden h-[500px] w-[500px] rounded-full
          bg-[#FF9100]/20 blur-3xl sm:block"
        />

        {/* Airplane */}
        <div className="pointer-events-none absolute inset-0 z-10 mt-1 overflow-hidden sm:mt-2 md:mt-3 lg:mt-4">
          <div className="airplane-move">
            <div className="airplane-flip">
              <Image
                src="/transport.png"
                alt="Airplane"
                width={40}
                height={28}
                className="h-auto w-auto"
              />
            </div>

            <div className="rope-image">
              <Image
                src="/node.png"
                alt="Rope"
                width={28}
                height={10}
                className="h-auto w-auto"
              />
            </div>

            <div className="cloth-banner text-xs sm:text-sm">
              <span>Admissions Open – 2026–27</span>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-40 w-full max-w-3xl px-4 text-center sm:px-6">
          {/* Hero logo */}
          {/* Hero logo */}
          <motion.div
            initial={{
              opacity: 0,
              y: -35,
              scale: 0.75,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
    relative
    z-40
    mb-6
    mt-6
    flex
    justify-center
    sm:mb-8
    sm:mt-14
  "
          >
            {/* Animated glow */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.55, 0.35],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
      absolute
      inset-[-18px]
      rounded-full
      bg-gradient-to-br
      from-[#F59A23]/40
      via-white/30
      to-[#4B517D]/30
      blur-2xl
    "
            />

            {/* Logo */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 1, 0, -1, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.05,
                rotate: 2,
              }}
              className="
      relative
      rounded-full
      bg-white/95
      p-2
      shadow-[0_12px_45px_rgba(75,81,125,0.28)]
      backdrop-blur-sm
      sm:p-3
    "
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(245,154,35,0)",
                    "0 0 25px rgba(245,154,35,0.25)",
                    "0 0 0 rgba(245,154,35,0)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="rounded-full"
              >
                <Image
                  src="/TSLogo.png"
                  alt="TrueSunshine Logo"
                  width={280}
                  height={240}
                  priority
                  className="
          h-[140px]
          w-[140px]
          object-contain
          sm:h-[160px]
          sm:w-[160px]
        "
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: false, amount: 0.2 }}
            className="mb-3 bg-gradient-to-r from-[#4B517D] via-[#4B517D] to-[#B87938]
            bg-clip-text pb-2.5 text-2xl font-extrabold leading-[1.15] tracking-tight text-transparent
            sm:mb-6 sm:text-4xl lg:text-5xl"
          >
            {taglines[index]}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: false, amount: 0.2 }}
            className="mx-auto mb-6 max-w-xl text-sm font-semibold leading-relaxed text-[#4B517D]
            drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] sm:mb-10 sm:text-lg"
          >
            TrueSunshine Montessori helps children grow with confidence,
            curiosity, and compassion — fostering joyful learning every day.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: false, amount: 0.2 }}
            className="
        mx-auto
        mt-2
        flex
        w-full
        max-w-md
        flex-row
        items-center
        justify-center
        gap-3
        sm:gap-4
      "
          >
            <motion.div
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link
                href="https://forms.gle/iETUsNBC3C7UfD3E7"
                target="_blank"
                className="
            inline-block
            rounded-full
            bg-[#FF9100]
            px-6
            py-3
            font-semibold
            text-white
            shadow-[0_6px_20px_rgba(255,145,0,0.35)]
            transition-all
            hover:bg-[#E98200]
            hover:shadow-[0_8px_25px_rgba(255,145,0,0.45)]
          "
              >
                Enroll Now →
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link
                href="#contact"
                className="
            inline-block
            rounded-full
            bg-[#4B517D]
            px-6
            py-3
            font-semibold
            text-white
            shadow-[0_6px_20px_rgba(75,81,125,0.35)]
            transition-all
            hover:bg-[#3F456C]
            hover:shadow-[0_8px_25px_rgba(75,81,125,0.45)]
          "
              >
                Contact Us →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative overflow-hidden bg-gradient-to-b from-[#EEF0FA] via-[#F4F2FB]
        to-[#FFF7EA] px-4 py-8 sm:px-12 sm:py-16 lg:py-20"
      >
        {/* Decorative background elements */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-10 h-72 w-72
          rounded-full bg-[#4B517D]/15 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80
          rounded-full bg-[#F59A23]/15 blur-3xl"
        />

        <div
          className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10
          md:flex-row md:gap-14 lg:gap-20"
        >
          {/* LEFT — ABOUT TEXT */}
          <div className="flex-1 text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: false, amount: 0.3 }}
              className="mb-3 bg-gradient-to-r from-[#4B517D] via-[#555B86] to-[#F59A23]
              bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-4xl"
            >
              About TrueSunshine Preschool
            </motion.h2>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "6rem", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
              className="mx-auto mb-7 h-1 rounded-full bg-gradient-to-r from-[#4B517D]
            to-[#F59A23] md:mx-0 sm:mb-9"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: false, amount: 0.3 }}
              className="mb-4 text-xs leading-relaxed text-slate-600 sm:text-sm lg:text-base"
            >
              At{" "}
              <span className="font-semibold text-[#D98212]">
                TrueSunshine Preschool
              </span>
              , we nurture every child’s natural curiosity and independence
              through hands-on exploration and purposeful play. Our classrooms
              are designed to inspire creativity, responsibility, and a lifelong
              love for learning.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-xs leading-relaxed text-slate-600 sm:text-sm lg:text-base"
            >
              Guided by the Montessori philosophy, we help children grow not
              just academically — but emotionally and socially — in a calm,
              caring, and stimulating environment that celebrates individuality
              and joy.
            </motion.p>

            {/* Small brand accent */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: false, amount: 0.3 }}
              className="mt-6 flex items-center justify-center gap-2 md:justify-start"
            >
              <span className="h-2 w-2 rounded-full bg-[#F59A23]" />
              <span className="text-xs font-semibold tracking-wide text-[#4B517D]">
                Learning • Growing • Shining
              </span>
            </motion.div>
          </div>

          {/* RIGHT — IMAGE + MESSAGE */}
          <div className="flex flex-1 flex-col items-center text-center">
            {/* Image */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                rotate: -8,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.3,
              }}
              viewport={{
                once: false,
                amount: 0.3,
              }}
              className="relative mb-5 sm:mb-6"
            >
              {/* Soft brand glow */}
              <div
                className="absolute inset-[-10px] rounded-full bg-gradient-to-br from-[#F59A23]/30
              via-white/30 to-[#4B517D]/25 blur-xl"
              />

              {/* Image frame */}
              <div className="relative rounded-full bg-white p-1.5 shadow-[0_10px_35px_rgba(75,81,125,0.18)]">
                <Image
                  src="/alekhya_toon.jpg"
                  alt="Chairman"
                  width={260}
                  height={260}
                  className="h-[180px] w-[180px] rounded-full border-4 border-[#F6C66D] object-cover
                  sm:h-[220px] sm:w-[220px] lg:h-[260px] lg:w-[260px]"
                />
              </div>
            </motion.div>

            {/* Chairman Message */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
              }}
              viewport={{
                once: false,
                amount: 0.3,
              }}
              className="mb-3 max-w-md text-xs leading-relaxed text-slate-600 sm:mb-4 sm:text-sm lg:text-base"
            >
              “Every child is a seed of possibility. At TrueSunshine, our goal
              is to nurture that possibility with love, guidance, and meaningful
              experiences that empower children to grow with confidence and
              compassion.”
            </motion.p>

            {/* Name */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.7,
              }}
              viewport={{
                once: false,
                amount: 0.3,
              }}
              className="text-sm font-semibold italic text-[#D98212] sm:text-base lg:text-lg"
            >
              — Mrs. Alekhya Kumar V
              <br />
              <span className="text-xs font-medium not-italic text-[#4B517D]/80 sm:text-sm">
                Managing Director and Principal, TrueSunshine Preschool
              </span>
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        id="mission"
        className="
    relative
    overflow-hidden
    bg-gradient-to-br
    from-[#E4E7F2]
    via-[#F0EEF7]
    to-[#FFF1DC]
    px-4
    py-8
    sm:px-10
    sm:py-12
    lg:py-14
  "
      >
        <div className="pointer-events-none absolute -left-28 top-0 h-64 w-64 rounded-full bg-[#4B517D]/12 blur-3xl" />

        <div className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-[#F59A23]/12 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* LEFT — Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -60, scale: 0.92 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.2 }}
            className="hidden justify-center lg:flex"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div
                className="
            absolute
            inset-0
            rounded-full
            bg-gradient-to-br
            from-[#F59A23]/20
            to-[#4B517D]/15
            blur-2xl
          "
              />

              <Image
                src="/mission_vision.png"
                alt="Mission and Vision illustration"
                width={500}
                height={500}
                className="
            relative
            w-[400px]
            select-none
            drop-shadow-xl
            xl:w-[440px]
          "
              />
            </motion.div>
          </motion.div>

          {/* RIGHT — Content */}
          <div>
            {/* Heading */}
            <div className="mb-7">
              <motion.h2
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: false, amount: 0.2 }}
                className="
            mb-2
            bg-gradient-to-r
            from-[#4B517D]
            via-[#5C6290]
            to-[#F59A23]
            bg-clip-text
            text-center
            text-2xl
            font-extrabold
            tracking-tight
            text-transparent
            sm:text-3xl
            lg:text-left
          "
              >
                Mission & Vision
              </motion.h2>

              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "5.5rem" }}
                transition={{ duration: 0.7 }}
                viewport={{ once: false, amount: 0.2 }}
                className="
            mx-auto
            h-1
            rounded-full
            bg-gradient-to-r
            from-[#4B517D]
            to-[#F59A23]
            lg:mx-0
          "
              />

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: false, amount: 0.2 }}
                className="
            mt-4
            text-center
            text-xs
            leading-6
            text-slate-600
            sm:text-sm
            lg:text-left
          "
              >
                At TrueSunshine, every decision we make is guided by a clear
                purpose — nurturing confident learners, compassionate
                individuals, and future global citizens through joyful
                Montessori education.
              </motion.p>
            </div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              viewport={{ once: false, amount: 0.2 }}
              className="
          relative
          mb-4
          rounded-2xl
          border
          border-white/70
          bg-white/85
          px-5
          py-4
          shadow-[0_8px_25px_rgba(75,81,125,0.10)]
          backdrop-blur-md
          sm:px-6
          sm:py-5
        "
            >
              <span
                className="
            absolute
            right-5
            top-1
            text-5xl
            font-bold
            text-[#4B517D]/10
          "
              >
                01
              </span>

              <div className="mb-2.5 flex items-center gap-3">
                <div
                  className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#EEF0FA]
              text-xl
            "
                >
                  🌱
                </div>

                <h3 className="text-lg font-bold text-[#4B517D] sm:text-xl">
                  Our Mission
                </h3>
              </div>

              <p className="text-xs leading-6 text-slate-600 sm:text-sm sm:leading-6">
                To inspire self-motivated learners through the Montessori
                philosophy — fostering independence, curiosity, empathy, and
                respect for themselves, others, and the environment while making
                learning joyful every day.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: false, amount: 0.2 }}
              className="
          relative
          rounded-2xl
          border
          border-white/70
          bg-white/85
          px-5
          py-4
          shadow-[0_8px_25px_rgba(75,81,125,0.10)]
          backdrop-blur-md
          sm:px-6
          sm:py-5
        "
            >
              <span
                className="
            absolute
            right-5
            top-1
            text-5xl
            font-bold
            text-[#F59A23]/15
          "
              >
                02
              </span>

              <div className="mb-2.5 flex items-center gap-3">
                <div
                  className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#FFF4E4]
              text-xl
            "
                >
                  ☀️
                </div>

                <h3 className="text-lg font-bold text-[#4B517D] sm:text-xl">
                  Our Vision
                </h3>
              </div>

              <p className="text-xs leading-6 text-slate-600 sm:text-sm sm:leading-6">
                To become a leading Montessori institution that nurtures
                confident, compassionate, creative, and capable lifelong
                learners who positively impact their families, communities, and
                the world around them.
              </p>
            </motion.div>

            {/* Brand Motto */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: false, amount: 0.2 }}
              className="
          mt-5
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-[#F59A23]/20
          bg-[#FFF9F1]/90
          px-4
          py-3
        "
            >
              <div className="h-8 w-1 shrink-0 rounded-full bg-[#F59A23]" />

              <p className="text-xs font-medium italic leading-5 text-[#4B517D] sm:text-sm">
                “Learning with purpose. Growing with confidence. Shining with
                compassion.”
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        className="relative overflow-hidden bg-gradient-to-br from-[#E4E7F2] via-[#F0EEF7]
        to-[#FFF1DC] px-4 py-8 sm:px-10 sm:py-12 lg:py-14"
      >
        <div
          className="pointer-events-none absolute -left-28 top-0
          h-64 w-64 rounded-full bg-[#4B517D]/10 blur-3xl"
        />

        <div
          className="pointer-events-none absolute -right-28 bottom-0
          h-72 w-72 rounded-full bg-[#F59A23]/10 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, amount: 0.2 }}
            className="mb-7 text-center sm:mb-8"
          >
            <motion.h3
              className="mb-2 bg-gradient-to-r from-[#4B517D] via-[#5C6290] to-[#F59A23]
              bg-clip-text text-2xl font-extrabold  tracking-tight text-transparent sm:text-3xl lg:text-4xl"
            >
              What Parents Say
            </motion.h3>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "5.5rem" }}
              transition={{ duration: 0.7 }}
              viewport={{ once: false, amount: 0.2 }}
              className="mx-auto h-1 rounded-full bg-gradient-to-r from-[#4B517D] to-[#F59A23]"
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: false, amount: 0.2 }}
              className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-slate-600 sm:text-sm"
            >
              The trust of our parents inspires us every day. Here are some of
              the experiences shared by families who are part of the
              TrueSunshine community.
            </motion.p>
          </motion.div>

          {/* Testimonials */}
          <div className="relative mx-auto max-w-6xl px-7 sm:px-10 lg:px-12">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              loop={false}
              rewind={displayedReviews.length > 1}
              centeredSlides
              slidesPerView={1}
              spaceBetween={18}
              speed={650}
              watchSlidesProgress
              autoplay={
                canLoopTestimonials
                  ? {
                      delay: 4000,
                      pauseOnMouseEnter: true,
                      disableOnInteraction: false,
                    }
                  : false
              }
              pagination={{
                clickable: true,
                el: ".testimonial-pagination",
              }}
              navigation={{
                prevEl: ".testimonial-prev",
                nextEl: ".testimonial-next",
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1.15,
                  spaceBetween: 18,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 22,
                },
              }}
              className="testimonial-swiper"
            >
              {displayedReviews.map((review, i) => (
                <SwiperSlide key={i} className="testimonial-slide !h-auto">
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 25,
                      scale: 0.94,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.65,
                      delay: i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    viewport={{
                      once: false,
                      amount: 0.15,
                    }}
                    className="flex h-full justify-center py-4 sm:py-5"
                  >
                    <div
                      className="testimonial-card relative flex min-h-[300px] w-full max-w-[265px]
                      flex-col items-center overflow-hidden rounded-2xl border border-white/80
                      bg-white/95 px-5 py-6 text-center shadow-[0_8px_25px_rgba(75,81,125,0.10)]
                      transition-all duration-500 sm:min-h-[310px] sm:max-w-[280px] sm:px-6 sm:py-7"
                    >
                      {/* Quote */}
                      <div
                        aria-hidden="true"
                        className="testimonial-quote absolute left-5 top-2 z-10 font-serif text-5xl
                        font-black leading-none text-[#C9CDD5] transition-all duration-500 sm:text-6xl"
                      >
                        “
                      </div>

                      {/* Active Quote */}
                      <div
                        aria-hidden="true"
                        className="testimonial-active-quote absolute left-5 top-2 z-10 font-serif
                        text-5xl font-black leading-none text-[#168FE5] opacity-0 transition-all
                        duration-500 sm:text-6xl"
                      >
                        “
                      </div>

                      {/* Avatar */}
                      <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.55,
                          delay: 0.15 + i * 0.08,
                        }}
                        className="testimonial-avatar mt-2 mb-4 flex h-16 w-16 shrink-0 items-center
                        justify-center overflow-hidden rounded-full border border-slate-200
                        bg-gradient-to-br from-[#EEF1F6] to-[#F8F9FA] text-xl font-bold
                        text-[#4B517D] shadow-sm transition-all duration-500 sm:h-[68px] sm:w-[68px]"
                      >
                        {review.author_name?.charAt(0)?.toUpperCase() || "P"}
                      </motion.div>

                      {/* Review */}
                      <p
                        className="testimonial-text flex min-h-[78px] max-w-[225px] items-center
                        justify-center text-center text-xs leading-5 text-slate-500 transition-all
                        duration-500 sm:text-[13px] sm:leading-5"
                      >
                        {review.text}
                      </p>

                      {/* Rating */}
                      <div className="mt-3 flex items-center justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <motion.span
                            key={index}
                            initial={{
                              opacity: 0,
                              scale: 0.5,
                            }}
                            whileInView={{
                              opacity: 1,
                              scale: 1,
                            }}
                            transition={{
                              duration: 0.3,
                              delay: 0.3 + index * 0.05,
                            }}
                            className={`text-sm leading-none ${
                              index < (review.rating ?? 5)
                                ? "text-[#F59A23]"
                                : "text-slate-200"
                            }`}
                          >
                            ★
                          </motion.span>
                        ))}
                      </div>

                      {/* Author */}
                      <div className="mt-3">
                        <p
                          className="testimonial-author text-sm font-bold text-slate-700
                          transition-all duration-500"
                        >
                          {review.author_name}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Parent
                        </p>
                      </div>

                      {/* Bottom Accent */}
                      <div
                        aria-hidden="true"
                        className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-t-full
                        bg-gradient-to-r from-[#4B517D] to-[#F59A23] opacity-70"
                      />
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Previous */}
            <button
              type="button"
              aria-label="Previous testimonial"
              className="testimonial-prev absolute left-0 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2
              items-center justify-center rounded-full border border-[#D7ECFA] bg-[#EAF6FF] text-[#168FE5]
              shadow-sm transition hover:scale-110 hover:bg-[#DDF1FF] disabled:opacity-40 sm:h-10 sm:w-10"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 18l-6-6 6-6"
                />
              </svg>
            </button>

            {/* Next */}
            <button
              type="button"
              aria-label="Next testimonial"
              className="testimonial-next absolute right-0 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2
              items-center justify-center rounded-full border border-[#D7ECFA] bg-[#EAF6FF] text-[#168FE5]
              shadow-sm transition hover:scale-110 hover:bg-[#DDF1FF] disabled:opacity-40 sm:h-10 sm:w-10"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 18l6-6-6-6"
                />
              </svg>
            </button>
          </div>

          {/* Pagination */}
          <div className="testimonial-pagination mt-3 flex min-h-[10px] items-center justify-center" />
        </div>
      </section>

      {/* Gallery Section */}
      <section
        id="gallery"
        className="
    relative
    overflow-hidden
    bg-gradient-to-br
    from-[#E4E7F2]
    via-[#F0EEF7]
    to-[#FFF1DC]
    px-4
    py-8
    text-center
    sm:px-6
    sm:py-12
    lg:py-14
  "
      >
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      -left-32
      top-0
      h-64
      w-64
      rounded-full
      bg-[#4B517D]/12
      blur-3xl
    "
        />

        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      -right-32
      bottom-0
      h-72
      w-72
      rounded-full
      bg-[#F59A23]/12
      blur-3xl
    "
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.h3
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: false, amount: 0.2 }}
            className="
        mb-2
        bg-gradient-to-r
        from-[#4B517D]
        via-[#5C6290]
        to-[#F59A23]
        bg-clip-text
        text-2xl
        font-extrabold
        tracking-tight
        text-transparent
        sm:text-3xl
        lg:text-4xl
      "
          >
            Gallery
          </motion.h3>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "5.5rem", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false, amount: 0.2 }}
            className="
        mx-auto
        mb-5
        h-1
        rounded-full
        bg-gradient-to-r
        from-[#4B517D]
        to-[#F59A23]
        sm:mb-6
      "
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            viewport={{ once: false, amount: 0.2 }}
            className="
        mx-auto
        mb-6
        max-w-2xl
        text-xs
        leading-6
        text-slate-600
        sm:mb-7
        sm:text-sm
        lg:text-base
      "
          >
            Explore moments from our Montessori environment, classroom
            activities, and joyful learning experiences at TrueSunshine
            Preschool.
          </motion.p>

          <div className="relative">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              slidesPerView={1}
              spaceBetween={14}
              loop
              pagination={{
                clickable: true,
              }}
              navigation
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 18,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
              }}
              className="gallery-swiper !px-2 !pb-10 sm:!px-4"
            >
              {galleryImages.map((image, i) => (
                <SwiperSlide key={i}>
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 30,
                      scale: 0.96,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.06,
                    }}
                    viewport={{
                      once: false,
                      amount: 0.2,
                    }}
                    whileHover={{
                      y: -4,
                      scale: 1.015,
                    }}
                    className="group"
                  >
                    <div
                      onClick={() => {
                        setActiveGalleryImage(image.imageUrl);
                        setShowGalleryControls(true);
                      }}
                      className="
    relative
    aspect-[4/3]
    w-full
    cursor-pointer
    overflow-hidden
    rounded-2xl
    border
    border-white/70
    bg-white
    shadow-[0_8px_24px_rgba(75,81,125,0.12)]
    transition-all
    duration-300
    group-hover:border-[#F59A23]/40
    group-hover:shadow-[0_12px_28px_rgba(75,81,125,0.16)]
  "
                    >
                      <Image
                        src={image.imageUrl}
                        alt={
                          image.altText ||
                          `${image.eventTitle} - TrueSunshine Preschool`
                        }
                        fill
                        sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 768px) 50vw,
                    (max-width: 1024px) 33vw,
                    20vw
                  "
                        className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
                      />

                      <div
                        className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#4B517D]/80
                    via-[#4B517D]/10
                    to-transparent
                    opacity-65
                    transition-opacity
                    duration-500
                    group-hover:opacity-90
                  "
                      />

                      <div
                        className="
                    absolute
                    left-3
                    top-3
                    h-1
                    w-7
                    rounded-full
                    bg-[#F59A23]
                    opacity-0
                    transition-all
                    duration-300
                    group-hover:w-11
                    group-hover:opacity-100
                  "
                      />

                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 12,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.5,
                          delay: 0.15 + i * 0.04,
                        }}
                        viewport={{
                          once: false,
                          amount: 0.2,
                        }}
                        className="
                    absolute
                    inset-x-0
                    bottom-0
                    px-3
                    pb-3
                    text-left
                  "
                      >
                        <p
                          className="
    text-[10px]
    font-semibold
    leading-4
    text-white
    sm:text-xs
  "
                        >
                          {image.eventTitle}
                        </p>

                        <p
                          className="
    mt-0.5
    text-[9px]
    font-medium
    text-white/70
    sm:text-[10px]
  "
                        >
                          {image.eventCategory || "TrueSunshine Preschool"}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* ================= GALLERY LIGHTBOX ================= */}
      {activeGalleryImage && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center px-4"
          onClick={() => setActiveGalleryImage(null)}
          onMouseMove={() => setShowGalleryControls(true)}
          onTouchStart={() => setShowGalleryControls(true)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <Image
              src={activeGalleryImage}
              alt="Gallery Preview"
              width={1400}
              height={900}
              className="rounded-xl object-contain w-full max-h-[85vh]"
            />

            {/* CLOSE BUTTON */}
            {showGalleryControls && (
              <button
                onClick={() => setActiveGalleryImage(null)}
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:scale-110 transition"
                title="Close"
              >
                <Image src="/close.png" alt="Close" width={18} height={18} />
              </button>
            )}

            {/* ACTION BUTTONS */}
            {showGalleryControls && (
              <div className="absolute top-4 right-4 flex gap-3">
                {/* Download */}
                <a
                  href={activeGalleryImage}
                  download
                  className="
              w-10 h-10
              rounded-full
              bg-white/90 backdrop-blur
              flex items-center justify-center
              shadow-lg
              hover:scale-110
              transition
            "
                  title="Download"
                >
                  <Image
                    src="/downloads.png"
                    alt="Download"
                    width={18}
                    height={18}
                  />
                </a>

                {/* Share */}
                <button
                  onClick={() => handleShareImage(activeGalleryImage)}
                  className="
              w-10 h-10
              rounded-full
              bg-white/90 backdrop-blur
              flex items-center justify-center
              shadow-lg
              hover:scale-110
              transition
            "
                  title="Share"
                >
                  <Image src="/share.png" alt="Share" width={18} height={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Us Section */}
      <section
        id="contact"
        className="
    relative
    overflow-hidden
    bg-gradient-to-br
    from-[#E8EAF3]
    via-[#F3F1F6]
    to-[#FFF1DC]
    px-4
    py-8
    sm:px-8
    sm:py-10
    lg:px-10
    lg:py-12
  "
      >
        {/* Background Glows */}
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      -left-28
      -top-20
      h-64
      w-64
      rounded-full
      bg-[#4B517D]/10
      blur-3xl
    "
        />

        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      -bottom-28
      -right-20
      h-72
      w-72
      rounded-full
      bg-[#F59A23]/10
      blur-3xl
    "
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6 text-center sm:mb-7">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.2 }}
              className="
          mb-2
          bg-gradient-to-r
          from-[#4B517D]
          via-[#5C6290]
          to-[#F59A23]
          bg-clip-text
          text-2xl
          font-extrabold
          tracking-tight
          text-transparent
          sm:text-3xl
          lg:text-4xl
        "
            >
              Contact Us
            </motion.h3>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "5.5rem", opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: false, amount: 0.2 }}
              className="
          mx-auto
          mb-4
          h-1
          rounded-full
          bg-gradient-to-r
          from-[#4B517D]
          to-[#F59A23]
        "
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: false, amount: 0.2 }}
              className="
          mx-auto
          max-w-xl
          text-xs
          leading-5
          text-[#4B517D]/70
          sm:text-sm
          sm:leading-6
        "
            >
              We’d love to connect with you. Reach out for admissions, campus
              visits, or general queries.
            </motion.p>
          </div>

          {/* Map + Chat */}
          <div
            className="
        grid
        grid-cols-1
        items-stretch
        gap-5
        lg:grid-cols-[1.45fr_0.8fr]
        lg:gap-6
      "
          >
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: false, amount: 0.2 }}
              className="
          overflow-hidden
          rounded-[22px]
          border
          border-[#4B517D]/10
          bg-white
          shadow-[0_10px_30px_rgba(75,81,125,0.10)]
          transition-shadow
          duration-300
          hover:shadow-[0_14px_36px_rgba(75,81,125,0.14)]
        "
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.97106829474!2d78.38164457414304!3d17.461098800679487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93d6209e0f0d%3A0x95c9fe94d6e83177!2sMohan's%20Elite%20Apartment!5e0!3m2!1sen!2sin!4v1763088792805!5m2!1sen!2sin"
                className="h-[250px] w-full border-0 sm:h-[280px] lg:h-[310px]"
                allowFullScreen
                loading="lazy"
              />
            </motion.div>

            {/* Chatbot Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: false, amount: 0.2 }}
              className="
          flex
          flex-col
          justify-center
          rounded-[22px]
          border
          border-[#4B517D]/10
          bg-white
          px-6
          py-6
          shadow-[0_10px_30px_rgba(75,81,125,0.10)]
          sm:px-7
          sm:py-7
        "
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: false, amount: 0.2 }}
                className="
            mx-auto
            mb-4
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-[#EEF0F8]
            shadow-[0_6px_16px_rgba(75,81,125,0.10)]
          "
              >
                <Image
                  src="/live-chat.png"
                  alt="Chat"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </motion.div>

              <h4
                className="
            mb-2
            text-center
            text-lg
            font-bold
            text-[#4B517D]
            sm:text-xl
          "
              >
                Need Quick Help?
              </h4>

              <p
                className="
            mx-auto
            mb-5
            max-w-sm
            text-center
            text-xs
            leading-5
            text-slate-600
            sm:text-sm
            sm:leading-6
          "
              >
                Use our chatbot available on the bottom-right corner to enquire
                about admissions, fees, classes, timings, and more.
              </p>

              <div className="flex justify-center">
                <motion.button
                  whileHover={{
                    scale: 1.04,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={() => setChatOpen(true)}
                  className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#4B517D]
              px-6
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-[0_7px_18px_rgba(75,81,125,0.18)]
              transition-all
              duration-200
              hover:bg-[#41476F]
            "
                >
                  Open Chat
                </motion.button>
              </div>

              <div
                className="
            mx-auto
            mt-5
            h-1
            w-10
            rounded-full
            bg-[#F59A23]
          "
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ⚓ Footer */}
      <footer
        className="
    relative
    overflow-hidden
    bg-[#3F456B]
    px-6
    pb-6
    pt-12
    text-white
    sm:px-10
  "
      >
        {/* Decorative brand glow */}
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      -right-32
      -top-32
      h-80
      w-80
      rounded-full
      bg-[#F59A23]/15
      blur-3xl
    "
        />

        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      -bottom-40
      -left-32
      h-80
      w-80
      rounded-full
      bg-[#555B86]/40
      blur-3xl
    "
        />

        <div
          className="
      relative
      z-10
      mx-auto
      grid
      max-w-6xl
      grid-cols-1
      gap-10
      md:grid-cols-4
    "
        >
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-xl
            bg-white
            shadow-md
          "
              >
                <Image
                  src="/TSLogo.png"
                  alt="TrueSunshine"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">TrueSunshine</h3>

                <p className="text-xs font-medium text-[#F6C66D]">
                  Montessori Preschool
                </p>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-6 text-white/75">
              Nurturing curiosity, independence, creativity and joyful learning
              through the Montessori philosophy in a safe and inspiring
              environment.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: false, amount: 0.2 }}
          >
            <h4 className="mb-4 text-lg font-semibold text-white">
              Quick Links
            </h4>

            <ul className="space-y-2.5 text-sm">
              {[
                { href: "#about", label: "About Us" },
                { href: "#admissions", label: "Admissions" },
                { href: "#gallery", label: "Gallery" },
                { href: "#contact", label: "Contact" },
              ].map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + i * 0.1,
                  }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <a
                    href={item.href}
                    className="
                inline-flex
                items-center
                gap-2
                text-white/75
                transition-all
                duration-300
                hover:translate-x-1
                hover:text-[#F59A23]
              "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F59A23]" />
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: false, amount: 0.2 }}
          >
            <h4 className="mb-4 text-lg font-semibold text-white">Contact</h4>

            <ul className="space-y-3 text-sm text-white/75">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: false, amount: 0.2 }}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Image
                    src="/placeholder.png"
                    alt="Location"
                    width={17}
                    height={17}
                    className="object-contain"
                  />
                </div>

                <span className="leading-5">
                  Mohan&apos;s Elite Apartments
                  <br />
                  Khanamet, Hyderabad
                  <br />
                  Telangana - 500084
                </span>
              </motion.li>

              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                viewport={{ once: false, amount: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Image
                    src="/phone.png"
                    alt="Phone"
                    width={17}
                    height={17}
                    className="object-contain"
                  />
                </div>

                <span>+91 79895 99833</span>
              </motion.li>

              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: false, amount: 0.2 }}
                className="flex items-start gap-3"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Image
                    src="/email.png"
                    alt="Email"
                    width={17}
                    height={17}
                    className="object-contain"
                  />
                </div>

                <span className="break-all">
                  truesunshine.playschools@gmail.com
                </span>
              </motion.li>
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: false, amount: 0.2 }}
          >
            <h4 className="mb-4 text-lg font-semibold text-white">Follow Us</h4>

            <p className="mb-4 text-sm leading-6 text-white/70">
              Stay connected with TrueSunshine and follow our latest activities
              and updates.
            </p>

            <div className="flex gap-3">
              {[
                { src: "/facebook.png", alt: "Facebook" },
                { src: "/instagram.png", alt: "Instagram" },
                { src: "/youtube.png", alt: "YouTube" },
              ].map((social, i) => (
                <motion.a
                  key={social.alt}
                  href="#"
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.1,
                  }}
                  viewport={{
                    once: false,
                    amount: 0.2,
                  }}
                  whileHover={{
                    scale: 1.1,
                    y: -3,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/10
              transition-all
              duration-300
              hover:border-[#F59A23]/50
              hover:bg-[#F59A23]
            "
                >
                  <Image
                    src={social.src}
                    alt={social.alt}
                    width={23}
                    height={23}
                    className="object-contain"
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: false, amount: 0.2 }}
          className="
      relative
      z-10
      mx-auto
      mt-10
      max-w-6xl
      border-t
      border-white/10
      pt-5
      text-center
    "
        >
          <p className="text-xs font-medium text-white/60 sm:text-sm">
            © {new Date().getFullYear()} TrueSunshine Montessori —{" "}
            <span className="text-[#F6C66D]">
              Growing Minds, Shaping Futures
            </span>{" "}
            🌻
          </p>
        </motion.div>
      </footer>

      {/* ================= PREMIUM FLOATING DOCK ================= */}
      <div
        className="
    fixed right-5 bottom-6 z-[9999]
    flex flex-col items-center gap-3
    p-2
    rounded-full
    bg-transparent backdrop-blur-xl
    border border-white/40
    shadow-2xl
  "
      >
        {/* WhatsApp */}
        <div className="relative group">
          <span
            className="
        absolute right-14 top-1/2 -translate-y-1/2
        whitespace-nowrap
        rounded-lg bg-black/80 px-3 py-1.5
        text-xs text-white
        opacity-0 group-hover:opacity-100
        transition duration-300
        pointer-events-none
      "
          >
            Chat on WhatsApp
          </span>

          <a
            href="https://wa.me/7989599833"
            target="_blank"
            rel="noopener noreferrer"
            className="
        w-11 h-11 rounded-full
        flex items-center justify-center
        hover:scale-110 transition
      "
          >
            <Image src="/whatsapp.png" alt="WhatsApp" width={32} height={32} />
          </a>
        </div>

        {/* Scroll To Top */}
        {showScrollTop && !chatOpen && (
          <div className="relative group">
            <span
              className="
          absolute right-12 top-1/2 -translate-y-1/2
          whitespace-nowrap
          rounded-lg bg-black/80 px-3 py-1.5
          text-xs text-white
          opacity-0 group-hover:opacity-100
          transition duration-300
          pointer-events-none
        "
            >
              Scroll to Top
            </span>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="
          w-8 h-8 rounded-full
          bg-gradient-to-r from-rose-400 to-indigo-500
          text-white flex items-center justify-center
          shadow-md hover:scale-110 transition
        "
            >
              ↑
            </button>
          </div>
        )}

        {/* Chat Toggle */}
        <div className="relative group">
          <span
            className="
        absolute right-12 top-1/2 -translate-y-1/2
        whitespace-nowrap
        rounded-lg bg-black/80 px-3 py-1.5
        text-xs text-white
        opacity-0 group-hover:opacity-100
        transition duration-300
        pointer-events-none
      "
          >
            {chatOpen ? "Close Chat" : "Open Chat"}
          </span>

          <button
            onClick={() => setChatOpen((prev) => !prev)}
            className="
        w-8 h-8 rounded-full
        flex items-center justify-center
        shadow-md hover:scale-110 transition
      "
          >
            <Image
              src="/chat-bot.png"
              alt="Chat"
              width={28}
              height={28}
              className="object-contain"
            />
          </button>
        </div>
      </div>

      {/* Chat Box */}
      {chatOpen && (
        <div className="fixed right-5 bottom-40 sm:bottom-44 z-[9999]">
          <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
      )}
    </main>
  );
}
