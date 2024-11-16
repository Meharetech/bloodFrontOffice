import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/swiper-bundle.css';
import { Navigation, Autoplay } from 'swiper/modules';

// import sliderImage1 from '../images/home_1_slider_1.jpg';
// import sliderImage2 from '../images/about_feat_bg.jpg';
import axios from 'axios';
import { BaseUrl } from '../Util/util';

const WelcomePageSlider = () => {
  const [sliderImage1, setSliderImage1] = useState(null);
  const [sliderImage2, setSliderImage2] = useState(null);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/getImages`);
        console.log(response);
        setSliderImage1(response.data[0].sectionOne.imageOne);
        setSliderImage2(response.data[0].sectionOne.imageTwo);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);
  // console.log(sliderImage1)

  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      navigation
    >
      <SwiperSlide
        style={{
          backgroundImage: `url(${sliderImage1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="h-screen flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div className="text-white text-left p-4">
          <h3 className="text-2xl font-bold">Donate blood, save life!</h3>
          <h2 className="text-4xl font-bold my-4">
            YOUR BLOOD
            <br />
            CAN BRING SMILE
            <br />
            IN OTHER PERSON'S FACE
          </h2>
          <div className="flex space-x-4">
            <a
              href="/loginsignup"
              className="bg-red-600 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md 
             hover:bg-orange-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
             transition-all duration-300 ease-in-out"
            >
              Donate Now
            </a>

            <a
              href="tel:+919992396623"
              className="inline-block bg-teal-600 text-white font-bold py-2 px-6 rounded-lg border border-transparent shadow-md 
             hover:bg-teal-500 hover:border-teal-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 
             transition-all duration-300 ease-in-out"
            >
              CALL: +91 99923-96623
            </a>

          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide
        style={{
          backgroundImage: `url(${sliderImage2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="h-screen flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div className="text-white text-left p-4">
          <h3 className="text-2xl font-bold">Donate blood, save life!</h3>
          <h2 className="text-4xl font-bold my-4">
            DONATE BLOOD
            <br />
            AND INSPIRE OTHERS.
          </h2>
          <a
            href="/loginsignup"
            className="bg-red-600 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md 
             hover:bg-orange-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
             transition-all duration-300 ease-in-out"
          >
            Donate Now
          </a>

        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default WelcomePageSlider;
