import { companyInfo } from "../data/company";
import { ContactForm } from "./ContactForm";
import { LucideIcon } from "./LucideIcon";

export function ContactSection() {
  return (
    <section className="bg-neutral-50 py-20 md:py-28 relative" id="home-contact-section">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Form Intro info */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-body tracking-widest text-red-600 uppercase font-semibold">
              SECURE CONSULTATION SCOPING
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-black tracking-tight leading-tight">
              Initiate Your <br />
              <span className="text-red-600">Enterprise AI</span> Pipeline
            </h2>
            <p className="text-neutral-500 text-sm leading-relaxed font-body">
              Our solutions team reviews incoming requirements securely. Connect with us to establish
              a direct Slack channel, map budget parameters, and review code compliance matrices.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-3.5 text-neutral-700">
                <div className="p-2 bg-white rounded text-red-600 border border-neutral-200">
                  <LucideIcon name="Mail" className="w-4 h-4" />
                </div>
                <span className="text-sm font-body font-medium">{companyInfo.contact.email}</span>
              </div>
              <div className="flex items-center space-x-3.5 text-neutral-700">
                <div className="p-2 bg-white rounded text-red-600 border border-neutral-200">
                  <LucideIcon name="Phone" className="w-4 h-4" />
                </div>
                <span className="text-sm font-body font-medium">{companyInfo.contact.phone}</span>
              </div>
            </div>
          </div>

          {/* Interactive Form Component */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </div>
    </section>
  );
}
