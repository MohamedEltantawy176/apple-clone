import { useEffect, useRef, useState } from "react";
import { highlightsSlides } from "../constants";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  // video indicators
  const [video, setVideo] = useState({
    ended: false,
    playStarted: false,
    id: 0,
    isLast: false,
    isPlaying: false,
  });
  const [loadedData, setLoadedData] = useState([]);
  const { ended, playStarted, id, isLast, isPlaying } = video;

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[id].pause();
      } else {
        playStarted && videoRef.current[id].play();
      }
    }
  }, [playStarted, id, isPlaying, loadedData]);

  const handleLoadedMetadata = (i, e) =>
    setLoadedData((preLoadedData) => [...preLoadedData, e]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[id]) {
      let animate = gsap.to(span[id], {
        onUpdate: () => {
          const progress = Math.ceil(animate.progress() * 100);
          if (progress != currentProgress) {
            currentProgress = progress;

            // setting the width of the progress bar
            gsap.to(videoDivRef.current[id], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
            });

            // setting the background color of the progress bar
            gsap.to(span[id], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        // when the video is ended, replace the progress bar with the indicator and change the background color
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[id], {
              width: "12px",
            });

            gsap.to(span[id], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });
      if (id === 0) {
        animate.restart();
      }

      // update the progress bar
      const animUpdate = () => {
        animate.progress(
          videoRef.current[id].currentTime / highlightsSlides[id].videoDuration
        );
      };

      if (isPlaying) {
        // timer for update the progress bar
        gsap.ticker.add(animUpdate);
      } else {
        // remove the timer when the video is paused (the progress should stop)
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [id, playStarted]);

  // id is the id of of every video until it becomes number 3
  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((prevVideo) => ({
          ...prevVideo,
          ended: true,
          id: i + 1,
        }));
        break;
      case "video-last":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLast: true,
        }));
        break;
      case "video-reset":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLast: false,
          id: 0,
        }));
        break;
      case "play":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;
      case "pause":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;
      default:
        return video;
    }
  };

  useGSAP(() => {
    // slider animation to move the video out of the screen and bring the next video in
    gsap.to("#slider", {
      transform: `translateX(${-100 * id}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    // video animation to play the video when it is in the view
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((prevVideo) => ({
          ...prevVideo,
          playStarted: true,
          isPlaying: true,
        }));
      },
    });
  }, [ended, id]);

  return (
    <>
      <div className="flex items-center">
        {highlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  className={`${list.id === 2 && "translate-x-44"}
                    pointer-events-none `}
                  ref={(el) => (videoRef.current[i] = el)}
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onEnded={() => {
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last");
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetadata(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-5">
                {list.textLists.map((textList, i) => (
                  <p key={i} className="md:text-2xl text-xl font-medium">
                    {textList}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => (videoDivRef.current[i] = el)}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLast ? replayImg : isPlaying ? pauseImg : playImg}
            alt={isLast ? "replay" : isPlaying ? "pause" : "play"}
            onClick={
              isLast
                ? () => handleProcess("video-reset")
                : !isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
