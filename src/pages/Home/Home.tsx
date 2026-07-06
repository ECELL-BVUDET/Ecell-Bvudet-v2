import gsap from "gsap";
import imagesLoaded from "imagesloaded";
import { PageProps } from "../page.types";
import Nav from "../../components/Nav/Nav";
import { useLocation } from "react-router-dom";
import LocomotiveScroll from "locomotive-scroll";
import IntroAnimation from "../../animations/intro";
import React, { useEffect, useRef, useState } from "react";
import SectionOne from "../../components/Home/SectionOne/SectionOne";
import SectionTwo from "../../components/Home/SectionTwo/SectionTwo";
import SectionSix from "../../components/Home/SectionSix/SectionSix";
import SectionFour from "../../components/Home/SectionFour/SectionFour";
import SectionFive from "../../components/Home/SectionFive/SectionFive";
import SectionNine from "../../components/Home/SectionNine/SectionNine";
import SectionThree from "../../components/Home/SectionThree/SectionThree";
import SectionSeven from "../../components/Home/SectionSeven/SectionSeven";
import SectionEight from "../../components/Home/SectionEight/SectionEight";
import { IoIosArrowDroprightCircle } from "react-icons/io";

const Home: React.FC<PageProps> = ({
	appLoaded,
	preloaded,
	navOnClick,
	windowWidth,
	setAppLoaded,
}) => {
	const navRef = useRef(null);
	const scrollRef = useRef(null);
	const [scroll, setScroll] = useState<any>();
	const location = useLocation();

	const preloadImages = () => {
		return new Promise((resolve) => {
			imagesLoaded(
				document.querySelectorAll("#home img"),
				{ background: true },
				resolve
			);
		});
	};

	useEffect(() => {
		if (preloaded && !scroll) {
			setScroll(
				new LocomotiveScroll({
					smooth: true,
					el: scrollRef.current,
					direction: "horizontal",
					gestureDirection: "both",
					tablet: {
						smooth: true,
					},
					smartphone: {
						smooth: true,
					},
					reloadOnContextChange: true,
				})
			);
		} else if (preloaded && scroll) {
			Promise.all([preloadImages(), (document as any).fonts.ready]).then(() => {
				scroll.update();
			});
			scroll.stop();
			scroll.update();
			const loadedAnimationDelay = windowWidth <= 1024 ? 0.8 : 0.5;
			setTimeout(
				() => {
					scroll.start();
					!appLoaded &&
						windowWidth > 1024 &&
						IntroAnimation(navRef.current);
					setAppLoaded(true);
				},
				!appLoaded ? 0 : loadedAnimationDelay
			);
		}
		return () => scroll && scroll.destroy();
	}, [scroll, preloaded]);

	useEffect(() => {
		if (scroll && location.hash === "#mentors") {
			setTimeout(() => {
				const target = document.querySelector("#mentors-section");
				if (target) {
					scroll.scrollTo(target, {
						duration: 1200,
						disableLerp: false
					});
				}
			}, 500); // Wait for loading to finish just in case
		}
	}, [scroll, location.hash]);

	useEffect(() => {
		const handleScrollTop = () => {
			if (scroll) {
				scroll.scrollTo(0, {
					duration: 1200,
					disableLerp: false
				});
			}
		};
		window.addEventListener("scrollToTop", handleScrollTop);

		if (scroll) {
			const btn = document.querySelector("#backToTopBtn");
			if (btn) {
				let isVisible = false;
				scroll.on('scroll', (obj: any) => {
					const pos = windowWidth > 1024 ? obj.scroll.x : obj.scroll.y;
					if (pos > 1000 && !isVisible) {
						isVisible = true;
						gsap.to(btn, { opacity: 1, pointerEvents: 'auto', scale: 1, duration: 0.3 });
					} else if (pos <= 1000 && isVisible) {
						isVisible = false;
						gsap.to(btn, { opacity: 0, pointerEvents: 'none', scale: 0.8, duration: 0.3 });
					}
				});
			}
		}

		return () => window.removeEventListener("scrollToTop", handleScrollTop);
	}, [scroll, windowWidth]);

	useEffect(() => {
		!appLoaded &&
			navRef.current &&
			windowWidth > 1024 &&
			gsap.set(navRef.current, { visibility: "hidden" });
	}, [navRef.current]);

	const scrollText = "SCROLL TO START • SCROLL TO START • ";

	return (
		<>
			<Nav ref={navRef} onClick={navOnClick} />
			<button 
				id="backToTopBtn" 
				onClick={() => {
					if (scroll) scroll.scrollTo(0, { duration: 1200, disableLerp: false });
				}}
			>
				<div className="btn-inner">
					<div className="circular-text">
						{scrollText.split("").map((char, i) => (
							<span key={i} style={{ transform: `rotate(${i * (360 / scrollText.length)}deg)` }}>
								{char}
							</span>
						))}
					</div>
					<div className="icon-container">
						<IoIosArrowDroprightCircle className="center-arrow" style={{ transform: windowWidth > 1024 ? 'rotate(180deg)' : 'rotate(-90deg)' }} />
					</div>
				</div>
			</button>
			<div id="home" ref={scrollRef} data-scroll-container>
				<SectionOne
					scroll={scroll}
					appLoaded={appLoaded}
					preloaded={preloaded}
					windowWidth={windowWidth}
				/>
				<SectionTwo />
				<SectionThree scroll={scroll} />
				<SectionFour />
				<SectionFive windowWidth={windowWidth} />
				<SectionSix />
				<SectionEight windowWidth={windowWidth} />
				<SectionSeven windowWidth={windowWidth} />
				<SectionNine windowWidth={windowWidth} />
			</div>
		</>
	);
};

export default Home;
