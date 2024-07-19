import React from "react";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

function About() {
  return (
    <div className="flex flex-col bg-white">
      {/* Main */}
      <div className="relative">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/56bb666e945d744c8fac97c6d588ebf8196715779e88ea6045dde2754112bf8f?apiKey=402c56a5a1d94d11bd24e7050966bb9d&"
          alt="background image"
          className="about-background-image"
          style={{ pointerEvents: "none" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-[1000px] mx-auto px-8">
            <h1 className="text-3xl mb-8 font-poetsen-one">About us</h1>
            <p className="text-lg leading-6 mb-4 font-poetsen-one">
              We are a sales website specializing in providing diverse and rich
              souvenir products. We are proud to bring our customers quality,
              unique and iconic products that represent special places, events or
              memories.
            </p>
            <p className="text-lg leading-6 mb-4 font-poetsen-one">
              With a wide variety of products ranging from souvenirs, jewelry,
              decorations, homewares and more, we guarantee that you will find a
              special gift or item to celebrate and remember special moments in
              your life.
            </p>
            <p className="text-lg leading-6 mb-4 font-poetsen-one">
              We are committed to providing a convenient, fast and reliable
              shopping experience for our customers. Your satisfaction is our
              greatest joy, and we are always willing to serve you wholeheartedly
              and thoughtfully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
