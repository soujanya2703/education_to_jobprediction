import React from "react";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import "swiper/css"
import './community.css'
import data from '../../utils/slider.json'
import { sliderSettings } from "../../utils/common";
const ComponentName = () => {
  return (
    <section className="r-wrapper" id="community">
      <div className="paddings innerWidth r-container">
        <div className="r-head flexColStart">
          <span className="orangeText">Our Community</span>
          <span className="primaryText">Meet some of our Learners & Professionals</span>
        </div>
        <Swiper {...sliderSettings}>
          {data.map((card, i) => (
            <SwiperSlide key={i}>
              <div className="flexColStart r-card">
                <img src={card.image} alt="" />

                <span className="thirdText r-price">
                  <span style={{ color: "orange" }}>Job: </span><span>{card.occupation}</span>
                </span>
                <span className="primaryText">{card.name}</span>
                <span className="thirdText">{card.detail}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
};

export default ComponentName;
