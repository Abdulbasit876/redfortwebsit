import { PageBanner } from "../components/PageBanner";
import { ContactForm } from "../components/ContactForm";
import { FAQSection } from "../components/FAQSection";
import { companyInfo } from "../data/company";
import { SectionTitle } from "../components/SectionTitle";
import { LucideIcon } from "../components/LucideIcon";

export default function Contact() {
  const contactDetails = [
    {
      title: "HQ Location",
      value: companyInfo.contact.address,
      icon: "MapPin"
    },
    {
      title: "Communications Cell",
      value: `${companyInfo.contact.phone} / ${companyInfo.contact.email}`,
      icon: "Phone"
    },
    {
      title: "Working Hours",
      value: companyInfo.contact.workingHours,
      icon: "Clock"
    }
  ];

  const socialLinks = [
    { name: "Linkedin", url: companyInfo.socials.linkedin, icon: "Linkedin" },
    { name: "Twitter", url: companyInfo.socials.twitter, icon: "Twitter" },
    { name: "Github", url: companyInfo.socials.github, icon: "Github" }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Page Banner */}
      <PageBanner
        title="Contact RedFort AI"
        subtitle="Secure encrypted channels for corporate system scoping, resource delegation, and SLA contracts."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Contact" }
        ]}
      />

      {/* Main Grid Contact Content */}
      <section className="py-20 md:py-28 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left: Contact Info details */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <SectionTitle
                  subtitle="Get In Touch"
                  title="Initiate {Scoping Sprints}"
                />
                <p className="text-neutral-550 text-sm leading-relaxed font-sans">
                  Connect with our Tx-certified solutions group. Complete the secure requisition form,
                  or transmit directly over encrypted secure mail channels.
                </p>
              </div>

              {/* Vertical Info cards */}
              <div className="space-y-6">
                {contactDetails.map((det, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-4 p-5 rounded-lg border border-neutral-200 bg-neutral-50"
                  >
                    <div className="p-3 bg-white border border-neutral-200 text-red-600 rounded shrink-0">
                      <LucideIcon name={det.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold mb-1">
                        {det.title}
                      </h4>
                      <p className="text-black text-sm font-sans font-medium leading-relaxed">
                        {det.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Channels section */}
              <div>
                <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-semibold mb-4">
                  Secure Channels
                </span>
                <div className="flex items-center space-x-3.5">
                  {socialLinks.map((soc, idx) => (
                    <a
                      key={idx}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded border border-neutral-200 hover:border-red-600 text-neutral-450 hover:text-red-600 flex items-center justify-center bg-white transition-all duration-300 shadow-sm"
                      aria-label={soc.name}
                    >
                      <LucideIcon name={soc.icon} className="w-4.5 h-4.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Scoping Form component */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Styled Google Maps Radar Placeholder */}
      <section className="py-12 bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <span className="block text-[10px] font-mono text-neutral-450 uppercase tracking-widest font-semibold mb-4 text-center">
            HEADQUARTERS COORDINATES
          </span>
          <div className="w-full h-80 rounded-2xl bg-black relative border-4 border-neutral-900 shadow-xl overflow-hidden flex flex-col items-center justify-center">
            {/* Atmospheric technical grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.1),transparent_70%)] pointer-events-none" />
            
            {/* Glowing radar line */}
            <div className="absolute inset-0 w-full h-[1.5px] bg-red-600/30 animate-pulse top-1/2 -translate-y-1/2" />

            {/* Concentric red circle outlines */}
            <div className="absolute w-48 h-48 border border-red-600/10 rounded-full animate-ping pointer-events-none" />
            <div className="absolute w-24 h-24 border border-red-600/20 rounded-full pointer-events-none" />
            
            {/* Marker Dot */}
            <div className="relative z-10 text-center space-y-3.5">
              <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-600/50 animate-bounce">
                <span className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>
              <div className="font-mono">
                <h4 className="text-white text-xs uppercase tracking-widest font-extrabold leading-none">
                  Islamabad & Wah Cantt, Pakistan
                </h4>
                <p className="text-red-500 text-[10px] tracking-wider font-semibold mt-1">
                  Latitude: 33.6844° N / Longitude: 73.0479° E
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Accordion list */}
      <FAQSection limit={4} />
    </div>
  );
}
