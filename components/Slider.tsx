"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Slider() {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      loop={true}
      grabCursor={true} 
      className="w-[330px]"
    >
      {/* SLIDE 1 */}
      <SwiperSlide>
        <div className="flex flex-col items-center text-center">
          <img src="/produk1.png" className="w-[250px]" />
          <h2 className="text-xl mt-3 font-semibold text-purple-900">
            Lip Cream Matte Premium
          </h2>
          <p className="text-sm text-gray-700 mt-1">
            Tahan lama, lembut di bibir, dan warna memukau.
          </p>
        </div>
      </SwiperSlide>

      {/* SLIDE 2 */}
      <SwiperSlide>
        <div className="flex flex-col items-center text-center">
          <img src="/produk2.png" className="w-[250px]" />
          <h2 className="text-xl mt-3 font-semibold text-purple-900">
            Serum Pencerah Wajah
          </h2>
          <p className="text-sm text-gray-700 mt-1">
            Membantu kulit jadi glowing dan sehat.
          </p>
        </div>
      </SwiperSlide>

      {/* SLIDE 3 */}
      <SwiperSlide>
        <div className="flex flex-col items-center text-center">
          <img src="/produk3.png" className="w-[250px]" />
          <h2 className="text-xl mt-3 font-semibold text-purple-900">
            Bedak Two Way Cake
          </h2>
          <p className="text-sm text-gray-700 mt-1">
            Coverage halus, ringan, dan tahan seharian.
          </p>
        </div>
      </SwiperSlide>

      {/* SLIDE 4 */}
      <SwiperSlide>
        <div className="flex flex-col items-center text-center">
          <img src="/produk4.png" className="w-[250px]" />
          <h2 className="text-xl mt-3 font-semibold text-purple-900">
            Mascara Volume Booster
          </h2>
          <p className="text-sm text-gray-700 mt-1">
            Bikin bulu mata lebih panjang dan tebal.
          </p>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
