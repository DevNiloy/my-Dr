 
import AboutUs from "./component/AboutUs"
import FeatureSection from "./component/FeatureSection"
import Hero from "./component/Hero"
import HowItWork from "./component/HowItWork"
import MapSection from "./component/MapSection"
import MobileApp from "./component/MobileApp"


function HomePage() {
  return (
    <div>
        <Hero/>
        <HowItWork/>
        <FeatureSection/>
        <MapSection/>
        
        <AboutUs/>
        <MobileApp/>
    </div>
  )
}

export default HomePage