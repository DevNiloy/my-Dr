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
        
        {/* ID যোগ করা হয়েছে স্ক্রলিং টার্গেট করার জন্য */}
        <div id="how-it-works">
          <HowItWork/>
        </div>
        
        <FeatureSection/>
        <MapSection/>
        
        <div id="about-us">
          <AboutUs/>
        </div>
        
        <div id="mobile-app">
          <MobileApp/>
        </div>
    </div>
  )
}

export default HomePage;