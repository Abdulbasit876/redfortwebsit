import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { companyInfo } from "../data/company";
import { PageBanner } from "../components/PageBanner";
import { StatsSection } from "../components/StatsSection";
import { CTA } from "../components/CTA";
import { SectionTitle } from "../components/SectionTitle";
import { LucideIcon } from "../components/LucideIcon";
import type { TeamMember } from "../types";

const API_BASE_URL = "/api/v1/public";

function getImageUrl(image?: string) {
  if (!image) return "https://via.placeholder.com/400x400?text=No+Image";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/api/v1/public")) return image;
  if (image.startsWith("/")) return `${API_BASE_URL}${image}`;
  return `${API_BASE_URL}/${image}`;
}

export default function About() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/team`);
        if (!response.ok) {
          throw new Error(`Failed to fetch team members (${response.status})`);
        }

        const payload = await response.json();
        const items = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        const mappedMembers: TeamMember[] = items
          .filter((item: any) => item?.status === "Active")
          .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map((item: any, index: number) => ({
            id: item.id || item._id || item.slug || `${item.name || "team"}-${index}`,
            name: item.name || "",
            role: item.role || "",
            image: getImageUrl(item.image),
            bio: item.description || "",
            social: {
              linkedin: item.linkedinUrl || undefined,
              twitter: item.twitterUrl || undefined
            }
          }));

        if (isMounted) {
          setTeamMembers(mappedMembers);
        }
      } catch (err) {
        console.error("Error fetching team members:", err);
        if (isMounted) {
          setError("Unable to load team members.");
          setTeamMembers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTeamMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  const timelineSteps = [
    { year: "2021", title: "RedFort Group Foundation", desc: "Established with a vision to deliver exceptional, high-performance web applications and business solutions." },
    { year: "2023", title: "RedFort AI Division Launch", desc: "Launched the specialized RedFort AI division to focus strictly on Software Development, Artificial Intelligence, and Machine Learning." },
    { year: "2025", title: "Business Automation Delivery", desc: "Pioneered cognitive business automation models, enabling enterprises to reduce operational costs and improve productivity." },
    { year: "2026", title: "AI Full Stack Solutions", desc: "Successfully scaled operations delivering end-to-end AI integrations across enterprise platforms with exceptional business efficiency." }
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600",
    "https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600"
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Page Banner */}
      <PageBanner
        title="About Our Enterprise"
        subtitle="Sleek spacing, professional code, and certified machine learning competency."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "About" }
        ]}
      />

      {/* Story section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-red-600 rounded-xl rotate-2 translate-x-2 translate-y-2 opacity-15 blur-sm" />
              <div className="relative rounded-xl overflow-hidden shadow-lg border-4 border-neutral-100 aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=800"
                  alt="RedFort meeting room"
                  className="w-full h-full object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <SectionTitle
                subtitle="Our Story"
                title="Smarter Operations {Built on Trust}"
              />
              <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
                {companyInfo.detailedDescription}
              </p>
              <p className="text-neutral-500 text-sm leading-relaxed">
                At RedFort AI, we operate with a strict philosophy of zero-leak data security.
                We specialize in deploying local models that keep your financial and patient data private,
                protecting your core enterprise asset: proprietary insights.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision cards */}
      <section className="py-16 md:py-24 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm flex flex-col justify-between group hover:border-red-600/20 transition-all duration-300"
            >
              <div>
                <div className="p-3 bg-neutral-100 text-red-600 inline-block rounded mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                  <LucideIcon name="Target" className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-black font-sans mb-4 group-hover:text-red-600 transition-colors duration-200">
                  Our Enterprise Mission
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  To engineer highly performant, luxury-grade software interfaces and autonomous AI pipelines
                  that eliminate routine back-office friction, allowing human teams to focus on high-impact strategic growth.
                </p>
              </div>
              <span className="text-[10px] font-body text-neutral-400 mt-8 block">MISSION STATUTORY DEFIANCE</span>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-neutral-200 rounded-xl p-8 shadow-sm flex flex-col justify-between group hover:border-red-600/20 transition-all duration-300"
            >
              <div>
                <div className="p-3 bg-neutral-100 text-red-600 inline-block rounded mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                  <LucideIcon name="Compass" className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-black font-sans mb-4 group-hover:text-red-600 transition-colors duration-200">
                  Our Corporate Vision
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  To stand as the global benchmark of reliable enterprise AI, bridging the divide between static cloud databases
                  and dynamic multi-modal generative agents with extreme structural integrity and beautiful, comfortable UX.
                </p>
              </div>
              <span className="text-[10px] font-body text-neutral-400 mt-8 block">VISIONARY HORIZONS VECTOR</span>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 md:py-28 bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6">
          <SectionTitle
            subtitle="Our Progress"
            title="Our Journey {Timeline}"
            centered
          />

          <div className="relative border-l border-neutral-200 ml-4 md:ml-32 mt-16 space-y-12">
            {timelineSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Floating Year marker for desktop */}
                <span className="absolute right-full mr-8 md:mr-12 top-0.5 text-right font-sans font-extrabold text-2xl text-red-600 hidden md:block select-none leading-none">
                  {step.year}
                </span>

                {/* Dot Bullet */}
                <span className="absolute -left-[6px] top-2 w-3 h-3 rounded-full bg-neutral-200 border-2 border-white group-hover:bg-red-600 group-hover:scale-125 transition-all duration-300" />

                {/* Content Box */}
                <div>
                  <span className="text-xs font-body font-bold text-red-600 uppercase tracking-widest md:hidden block mb-1">
                    {step.year}
                  </span>
                  <h4 className="text-lg font-bold text-black font-sans mb-2 group-hover:text-red-600 transition-colors duration-200">
                    {step.title}
                  </h4>
                  <p className="text-neutral-500 text-sm leading-relaxed max-w-2xl">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Leadership */}
      <section className="py-20 md:py-28 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            subtitle="Leadership Cell"
            title="Meet Our {Executive Team}"
            centered
          />

          {loading && (
            <div className="text-center py-16 text-sm text-neutral-500">Loading team members...</div>
          )}

          {!loading && error && (
            <div className="text-center py-16 text-sm text-neutral-500">{error}</div>
          )}

          {!loading && !error && teamMembers.length === 0 && (
            <div className="text-center py-16 text-sm text-neutral-500">No team members are available at the moment.</div>
          )}

          {!loading && !error && teamMembers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mt-16">
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-neutral-50 rounded-xl overflow-hidden border border-neutral-200 hover:border-red-600/20 shadow-sm flex flex-col justify-between group w-[calc(100%+20px)]"
                  id={`team-member-${member.id}`}
                >
                  {/* Avatar */}
                  <div className="aspect-square overflow-hidden bg-neutral-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-black font-sans group-hover:text-red-600 transition-colors duration-200">
                        {member.name}
                      </h4>
                      <span className="text-xxs font-body uppercase tracking-widest text-red-600 block mb-3 font-semibold">
                        {member.role}
                      </span>
                      <p className="text-neutral-500 text-[11px] leading-relaxed line-clamp-4 font-body">
                        {member.bio}
                      </p>
                    </div>

                    {/* Social icons */}
                    {(member.social?.linkedin || member.social?.twitter) && (
                      <div className="flex items-center space-x-3 pt-4 mt-4 border-t border-neutral-200/50">
                        {member.social?.linkedin && (
                          <a
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-450 hover:text-red-600 transition-colors duration-250"
                          >
                            <LucideIcon name="Linkedin" className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.social?.twitter && (
                          <a
                            href={member.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-450 hover:text-red-600 transition-colors duration-250"
                          >
                            <LucideIcon name="Twitter" className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Team Culture */}
      <section className="py-20 md:py-28 bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <SectionTitle
                subtitle="Corporate Culture"
                title="Our Team {Engineering Culture}"
              />
              <p className="text-neutral-600 text-sm leading-relaxed">
                We foster a culture of technical excellence, structural curiosity, and extreme craftsmanship.
                We believe in standard clean code patterns, automated test coverages, and constant research.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start space-x-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span className="text-neutral-700 text-xs font-sans font-medium">Continuous study sprints</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span className="text-neutral-700 text-xs font-sans font-medium">Automated CI/CD audits</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span className="text-neutral-700 text-xs font-sans font-medium">Clear project transparency</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-600 font-bold">✓</span>
                  <span className="text-neutral-700 text-xs font-sans font-medium">Comfortable ergonomic pacing</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-red-600 rounded-xl rotate-1 translate-x-1 translate-y-1 opacity-10 blur-sm" />
              <div className="relative rounded-xl overflow-hidden border border-neutral-200 aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800"
                  alt="RedFort AI culture"
                  className="w-full h-full object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Office Gallery */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            subtitle="Workspace"
            title="Our {Pakistan Offices}"
            centered
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {galleryImages.map((imgUrl, gIdx) => (
              <motion.div
                key={gIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: gIdx * 0.05 }}
                className="aspect-square rounded-xl overflow-hidden border border-neutral-200 shadow-sm relative group"
              >
                <img
                  src={imgUrl}
                  alt={`RedFort office layout ${gIdx + 1}`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
