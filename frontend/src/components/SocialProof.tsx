const logos = [{
  name: "Vogue",
  svg: "VOGUE"
}, {
  name: "GQ",
  svg: "GQ"
}, {
  name: "TechCrunch",
  svg: "TechCrunch"
}, {
  name: "Forbes",
  svg: "Forbes"
}, {
  name: "Wired",
  svg: "WIRED"
}, {
  name: "The Verge",
  svg: "The Verge"
}];
const SocialProof = () => {
  return <section className="py-16 border-y border-border overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <p className="micro-label text-center">APARECE EN</p>
      </div>
      
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        
        {/* Ticker */}
        <div className="flex ticker-animate">
          {[...logos, ...logos].map((logo, index) => <div key={index} className="flex-shrink-0 px-12 flex items-center justify-center">
              <span className="text-xl md:text-2xl font-semibold text-text-tertiary opacity-40 tracking-tight">
                {logo.svg}
              </span>
            </div>)}
        </div>
      </div>
    </section>;
};
export default SocialProof;