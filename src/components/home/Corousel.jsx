import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from 'swiper/modules';
import { Navigation } from 'swiper/modules';
import c1 from '../../assets/corousel/1.jpg'
import c2 from '../../assets/corousel/3.jpg'

function Corousel (){
    return(
        <>
        <div className="relative text-white min-h-[80vh]">
        <Swiper
          modules={[Autoplay, Navigation]}
          
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop
          slidesPerView={1} // Ensures one slide per view
          spaceBetween={0}
          className="h-full"
        >
          {/* Carousel Slide 1 */}
          <SwiperSlide>
            <div
              className="h-[80vh] flex items-start justify-center bg-cover bg-center mt-[4%]"
              style={{ backgroundImage: `url(${c1})` }} // Correct way to set background image
            >
              <h1 className="text-5xl font-bold bg-black bg-opacity-0 px-4 py-2 my-10 rounded">
                Create Amazing QR Codes
              </h1>
            </div>
          </SwiperSlide>


          {/* Carousel Slide 2 */}
          {/* <SwiperSlide>
            <video
              className="h-[80vh] w-full object-cover"
              src="/path-to-video.mp4"
              autoPlay
              muted
              loop
            />
          </SwiperSlide> */}

          {/* Carousel Slide 3 */}
          <SwiperSlide>
          <div
              className="h-[80vh] flex items-start justify-center bg-cover bg-center mt-[4%]"
              style={{ backgroundImage: `url(${c2})` }} // Correct way to set background image
            >
              <h1 className="text-5xl font-bold bg-black bg-opacity-0 px-4 py-2 my-10 rounded">
              Design Professional Visiting Cards
              </h1>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
        </>
    )
}

export default Corousel