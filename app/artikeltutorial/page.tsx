"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {

  const [articles, setArticles] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("Semua");

  const categories = [
    "Semua",
    "Skincare",
    "Makeup",
    "Bodycare",
    "Haircare",
  ];

  // ================= FETCH =================
  const fetchArticles = async () => {
    try {

      const res = await fetch("/api/artikel");

      const data = await res.json();

      setArticles(data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // ================= FILTER =================
  const filteredArticles =
    selectedCategory === "Semua"
      ? articles
      : articles.filter(
          (item: any) =>
            item.category === selectedCategory
        );

  return (

    <div className="min-h-screen bg-[#FFF8FC] px-4 md:px-8 py-10">

      <div className="max-w-7xl mx-auto">

        {/* ================= HERO ================= */}
        <div className="bg-gradient-to-r from-[#FFEAF4] to-[#FFF6FA] border border-[#F3CCDE] rounded-[35px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between mb-10 shadow-sm">

          {/* LEFT */}
          <div className="max-w-2xl">

            <span className="inline-block bg-[#F3CCDE] text-[#7B4364] px-4 py-2 rounded-full text-sm font-medium mb-5">
              ✨ Beauty Articles & Tips
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-[#B76E9B] leading-tight">

              Tips & Tutorial <br />

              <span className="text-[#D78FB3]">
                Kecantikan
              </span>

            </h1>

            <p className="text-[#7B4364] mt-5 text-lg leading-relaxed">
              Temukan berbagai tips skincare,
              makeup, bodycare dan haircare
              terbaik untuk merawat dan
              meningkatkan rasa percaya diri kamu 💖
            </p>

          </div>

          {/* RIGHT */}
        <div className="mt-8 md:mt-0">
            <Image
              src="/QQ.png"
              alt="hero"
              width={320}
              height={320}
              className="rounded-[30px] object-cover border-4 border-white shadow-lg"
            />

          </div>
        </div>

        {/* ================= CATEGORY ================= */}
        <div className="flex flex-wrap gap-3 mb-10">

          {categories.map((item, index) => (

            <button
              key={index}
              onClick={() =>
                setSelectedCategory(item)
              }
              className={`px-6 py-3 rounded-full transition-all duration-300 font-semibold text-sm ${
                selectedCategory === item
                  ? "bg-[#D78FB3] text-white shadow-md"
                  : "bg-white border border-[#F3CCDE] text-[#B76E9B] hover:bg-[#FFF0F6]"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ================= LEFT ================= */}
          <div className="lg:col-span-2 space-y-6">

            {filteredArticles.length > 0 ? (

              filteredArticles.map((item: any) => (

                <div
                  key={item.id}
                  className="bg-white border border-[#F3CCDE] rounded-[30px] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >

                  <div className="flex flex-col md:flex-row">

                    {/* IMAGE */}
                    <div className="relative w-full md:w-72 h-72">

                      <img
                        src={
                          item.image &&
                          item.image.trim() !== ""
                            ? item.image
                            : "/no-image.png"
                        }
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (
                            e.target as HTMLImageElement
                          ).src = "/no-image.png";
                        }}
                      />

                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 p-6">

                      <div className="flex flex-wrap items-center gap-3 mb-4">

                        <span className="bg-[#F3CCDE] text-[#7B4364] text-xs px-4 py-2 rounded-full font-medium">
                          {item.category}
                        </span>

                        <span className="text-xs text-gray-400">
                          {new Date(
                            item.created_at
                          ).toLocaleDateString("id-ID")}
                        </span>

                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold text-[#B76E9B] leading-snug">
                        {item.title}
                      </h2>

                      <p className="text-[#7B4364] mt-4 leading-relaxed text-sm md:text-base">
                        {item.content}
                      </p>

                    </div>

                  </div>

                </div>

              ))

            ) : (

              <div className="bg-white border border-[#F3CCDE] rounded-[30px] p-12 text-center shadow-sm">

                <h2 className="text-2xl font-bold text-[#B76E9B] mb-3">
                  Artikel Belum Tersedia
                </h2>

                <p className="text-[#7B4364]">
                  Artikel kecantikan akan segera hadir 💖
                </p>

              </div>

            )}

          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-6">

            {/* ================= CATEGORY BOX ================= */}
            <div className="bg-white border border-[#F3CCDE] rounded-[30px] shadow-sm p-6">

              <h3 className="font-bold text-[#B76E9B] text-2xl mb-6">
                Kategori Artikel
              </h3>

              <div className="space-y-4">

                {categories
                  .filter((item) => item !== "Semua")
                  .map((item, index) => (

                    <div
                      key={index}
                      className="flex justify-between items-center border-b border-[#F8D8E8] pb-3"
                    >

                      <span className="text-[#7B4364] font-medium">
                        {item}
                      </span>

                      <span className="bg-[#F3CCDE] text-[#B76E9B] px-3 py-1 rounded-full text-xs font-semibold">
                        {
                          articles.filter(
                            (a: any) =>
                              a.category === item
                          ).length
                        }
                      </span>

                    </div>

                  ))}

              </div>

            </div>

            {/* ================= ARTIKEL TERBARU ================= */}
            <div className="bg-white border border-[#F3CCDE] rounded-[30px] shadow-sm p-6">

              <h3 className="font-bold text-[#B76E9B] text-2xl mb-6">
                Artikel Terbaru
              </h3>

              <div className="space-y-5">

                {articles
                  .slice(0, 5)
                  .map((item: any) => (

                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-[#F8D8E8] pb-4 last:border-none"
                    >

                      <img
                        src={
                          item.image &&
                          item.image.trim() !== ""
                            ? item.image
                            : "/no-image.png"
                        }
                        className="w-20 h-20 rounded-2xl object-cover border border-[#F3CCDE]"
                        onError={(e) => {
                          (
                            e.target as HTMLImageElement
                          ).src = "/no-image.png";
                        }}
                      />

                      <div className="flex-1">

                        <p className="text-sm font-semibold text-[#B76E9B] line-clamp-2 leading-relaxed">
                          {item.title}
                        </p>

                        <span className="text-xs text-[#7B4364] mt-2 inline-block">
                          {new Date(
                            item.created_at
                          ).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>

                      </div>

                    </div>

                  ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}