import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PageBanner } from "../components/PageBanner";
import { SectionTitle } from "../components/SectionTitle";
import { LucideIcon } from "../components/LucideIcon";
import { CTA } from "../components/CTA";

interface JobRole {
  id: string;
  title: string;
  department: "Engineering" | "Research" | "Product" | "Operations";
  location: string;
  type: string;
  experience: string;
  shortDesc: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  technologies: string[];
}

const jobOpenings: JobRole[] = [
  {
    id: "sr-full-stack",
    title: "Senior Full-Stack Engineer (Vite / NestJS)",
    department: "Engineering",
    location: "Islamabad, Pakistan (Hybrid) or Remote",
    type: "Full-time",
    experience: "5+ Years",
    shortDesc: "Orchestrate premium enterprise cloud platforms using Vite/React, TypeScript, NestJS, and PostgreSQL.",
    description: "We are seeking a senior full-stack pioneer who believes in extreme craftsmanship, automated test coverages, and pristine ESM configurations. In this role, you will lead the architecture of auto-scaling SaaS endpoints and integrate multi-modal AI systems securely.",
    responsibilities: [
      "Architect scalable client interfaces using modern React patterns, Framer Motion, and Tailwind CSS.",
      "Build secure, modular RESTful APIs and WebSocket backends with NestJS and TypeScript.",
      "Model, optimize, and maintain robust databases using PostgreSQL, Drizzle ORM, or Prisma.",
      "Orchestrate Docker-based container pipelines and automated GitHub Actions CI/CD workflows.",
      "Conduct strict, detailed peer reviews focused on semantic cleanliness and type safety."
    ],
    requirements: [
      "Strong background in React, Node.js, and TypeScript in production environments.",
      "Experience configuring Vite, Esbuild, and Node ESM modules without breaking module boundary rules.",
      "Proven track record designing database schemas and optimizing complex SQL queries.",
      "Strong understanding of browser rendering lifecycle, rendering bottlenecks, and memory management.",
      "Excellent communication skills and an absolute obsession with technical details."
    ],
    technologies: ["React", "TypeScript", "NestJS", "PostgreSQL", "Tailwind CSS", "Docker", "GCP"]
  },
  {
    id: "ai-researcher",
    title: "Lead AI Systems Researcher (LLMs & RAG)",
    department: "Research",
    location: "Wah Cantt, Pakistan (In-office)",
    type: "Full-time",
    experience: "4+ Years",
    shortDesc: "Deploy high-volume retrieval-augmented generation pipelines, fine-tune open weights models, and optimize inference speeds.",
    description: "Join our core research division to spearhead our cognitive agent framework. You will optimize local vector search layouts, structure multi-turn memory buffers, and orchestrate low-latency model inference setups.",
    responsibilities: [
      "Design and evaluate custom multi-agent execution frameworks using @google/genai SDKs.",
      "Optimize local vector indexing algorithms and vector database layouts (e.g. Pinecone, pgvector).",
      "Benchmark and fine-tune open-weights models (such as Llama-3 or Gemma) for custom enterprise verticals.",
      "Conduct research on robust prompt injection defense lines and semantic guardrails.",
      "Collaborate with backend engineers to transition prototype notebooks into production-ready pipelines."
    ],
    requirements: [
      "M.S. or Ph.D. in Computer Science, Mathematics, or a highly quantitative field.",
      "Demonstrated experience with PyTorch, Hugging Face Hub, and vector-search mathematics.",
      "Deep understanding of Transformer attention mechanisms, prompt orchestration, and semantic analysis.",
      "Experience with structured data generation systems and routing flows.",
      "Published research work or complex productionized ML models are highly preferred."
    ],
    technologies: ["PyTorch", "Python", "Gemini API", "Pinecone", "HuggingFace", "Langchain", "FastAPI"]
  },
  {
    id: "devops-lead",
    title: "Senior DevOps & Infrastructure Architect",
    department: "Engineering",
    location: "Remote (US/Canada)",
    type: "Full-time",
    experience: "6+ Years",
    shortDesc: "Manage auto-scaling Google Cloud Run clusters, secure VPC perimeters, and automate infrastructure using Terraform.",
    description: "We are hiring an infrastructure veteran to handle zero-downtime deployments, strict network security access, and cost-effective scale-to-zero server instances across GCP and AWS.",
    responsibilities: [
      "Manage Cloud Run deployments, GKE Kubernetes clusters, and reverse proxy layers.",
      "Write, dry, and apply clean infrastructure-as-code modules using Terraform.",
      "Harden network boundaries with custom VPCs, IAM roles, and secret managers.",
      "Optimize telemetry collection pipelines (e.g. Prometheus, Grafana, OpenTelemetry).",
      "Provide technical strategy for zero-downtime migrations of high-volume client databases."
    ],
    requirements: [
      "GCP Professional Cloud DevOps Engineer or AWS DevOps Engineer Professional certification.",
      "Extensive experience working with Docker containers, Kubernetes, and reverse proxies (Nginx/Envoy).",
      "Strong scripting skills in Bash, Python, or Go for automated cloud scheduling.",
      "Proficient with secure database clustering, read replicas, and disaster recovery plans.",
      "Experience managing production SLAs with strict high-availability requirements."
    ],
    technologies: ["GCP", "Kubernetes", "Terraform", "Nginx", "Docker", "Prometheus", "CI/CD"]
  },
  {
    id: "product-manager",
    title: "Enterprise Product Manager (AI Products)",
    department: "Product",
    location: "Islamabad, Pakistan (Hybrid)",
    type: "Full-time",
    experience: "4+ Years",
    shortDesc: "Bridge client business priorities with engineering cells, mapping functional scope and managing product lifecycles.",
    description: "RedFort AI is seeking an technical-minded Product Manager who can translate complex cognitive architecture capabilities into elegant, highly intuitive enterprise control dashboards.",
    responsibilities: [
      "Translate vague corporate goals into precise, actionable technical product specifications.",
      "Coordinate with senior engineering leads and designers to plan weekly sprint objectives.",
      "Maintain the technical product roadmap, balancing rapid prototype delivery with long-term code stability.",
      "Lead weekly demo sessions and discovery workshops directly with client stakeholders.",
      "Conduct telemetry analyses to optimize user interaction friction and feature engagement."
    ],
    requirements: [
      "Technical background (BS in CS, Engineering, or equivalent practical experience).",
      "Prior experience managing AI-powered SaaS dashboards or developer-facing products.",
      "Outstanding technical documentation habits (writing perfect, unambiguous PRDs and technical guides).",
      "Familiarity with agile methodologies, JIRA/linear structures, and scope constraint tracking.",
      "Natural ability to communicate clear architectural tradeoffs to non-technical partners."
    ],
    technologies: ["Linear", "Figma", "Amplitude", "Notion", "Git", "Markdown", "Jira"]
  }
];

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [appliedRole, setAppliedRole] = useState<JobRole | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    portfolio: "",
    experience: "1-3 Years",
    resumeUrl: "",
    coverLetter: ""
  });

  const departments = ["All", "Engineering", "Research", "Product"];

  const filteredJobs = selectedDept === "All"
    ? jobOpenings
    : jobOpenings.filter(job => job.department === selectedDept);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyClick = (job: JobRole) => {
    setAppliedRole(job);
    setFormSubmitted(false);
    setFormData({
      name: "",
      email: "",
      linkedin: "",
      portfolio: "",
      experience: "1-3 Years",
      resumeUrl: "",
      coverLetter: ""
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please enter both your name and email address.");
      return;
    }
    // Simulate API registration
    setFormSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* 1. Page Banner */}
      <PageBanner
        title="Careers at RedFort AI"
        subtitle="Build the future of enterprise intelligence. Collaborate with world-class engineers, work with an advanced tech stack, and deliver high-impact digital solutions."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Careers" }
        ]}
      />

      {/* 2. Core Culture & Benefits Section */}
      <section className="py-20 md:py-28 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <SectionTitle
                subtitle="Why RedFort AI"
                title="A Culture of {Extreme Craftsmanship}"
              />
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-body">
                At RedFort AI, we operate with a philosophy of absolute technical excellence. 
                We skip bloated meetings and corporate jargon to focus on what truly matters: 
                writing pristine code, resolving scaling limits, and researching cutting-edge cognitive systems.
              </p>
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-body">
                We believe that premium quality is built by talented, autonomous individuals who are 
                fully supported. We offer spacious hybrid pacing, robust healthcare, and dedicated study sprints 
                to keep you ahead of the technical curve.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: "Cpu",
                  title: "Advanced AI Core",
                  desc: "Work with real-world LLMs, private embedding layers, and low-latency agent architectures."
                },
                {
                  icon: "Code",
                  title: "Technical Autonomy",
                  desc: "Say goodbye to micromanagement. Our engineers have total authority over their modules."
                },
                {
                  icon: "GraduationCap",
                  title: "Study Sprints",
                  desc: "We sponsor constant research, offering dedicated weekly hours to learn new technologies."
                },
                {
                  icon: "Sparkles",
                  title: "Premium Pacing",
                  desc: "Enjoy comfortable, ergonomic hybrid structures and comprehensive insurance plans."
                }
              ].map((val, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-neutral-50 border border-neutral-100 rounded-xl space-y-4 hover:border-neutral-200 hover:shadow-sm transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-red-600/5 text-red-600 rounded-lg flex items-center justify-center">
                    <LucideIcon name={val.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans font-bold text-neutral-900 text-base">{val.title}</h3>
                  <p className="font-body text-xs text-neutral-500 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. Open Roles Directory */}
      <section className="py-20 md:py-28 bg-neutral-50" id="open-roles">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-body tracking-widest text-red-600 uppercase font-semibold">
              CURRENT RECRUITMENT
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-black tracking-tight">
              Open Positions
            </h2>
            <p className="text-neutral-500 text-sm max-w-xl mx-auto leading-relaxed">
              We are constantly seeking senior developers, systems architects, and research minds. 
              Explore our current open positions below.
            </p>

            {/* Department Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    setSelectedDept(dept);
                    setExpandedRole(null);
                  }}
                  className={`px-4 py-2 text-xs font-mono tracking-wider uppercase rounded transition-all duration-300 ${
                    selectedDept === dept
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Openings List */}
          <div className="space-y-6">
            {filteredJobs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-neutral-200">
                <LucideIcon name="Briefcase" className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm font-body">No open roles found in this category.</p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isExpanded = expandedRole === job.id;
                return (
                  <motion.div
                    key={job.id}
                    layout
                    className={`bg-white border transition-all duration-300 rounded-xl overflow-hidden ${
                      isExpanded ? "border-red-600 shadow-md shadow-red-600/5" : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Header Row */}
                    <div
                      className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                      onClick={() => setExpandedRole(isExpanded ? null : job.id)}
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono tracking-wider text-red-600 uppercase bg-red-600/5 px-2.5 py-1 rounded font-bold">
                            {job.department}
                          </span>
                          <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase bg-neutral-100 px-2.5 py-1 rounded">
                            {job.type}
                          </span>
                        </div>
                        <h3 className="text-lg md:text-xl font-sans font-extrabold text-black hover:text-red-600 transition-colors duration-200">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 font-body">
                          <span className="flex items-center space-x-1.5">
                            <LucideIcon name="MapPin" className="w-3.5 h-3.5" />
                            <span>{job.location}</span>
                          </span>
                          <span className="flex items-center space-x-1.5">
                            <LucideIcon name="Calendar" className="w-3.5 h-3.5" />
                            <span>Experience: {job.experience}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 self-start md:self-center shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyClick(job);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold tracking-widest px-5 py-2.5 rounded transition-all duration-200"
                        >
                          APPLY NOW
                        </button>
                        <div className="p-2 text-neutral-400 hover:text-neutral-600 hidden md:block">
                          <LucideIcon
                            name={isExpanded ? "ChevronUp" : "ChevronDown"}
                            className="w-5 h-5 transition-transform duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-neutral-100 bg-neutral-50/50"
                        >
                          <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                            
                            {/* Short Description */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">Role Overview</h4>
                              <p className="text-neutral-600 text-sm leading-relaxed font-body">
                                {job.description}
                              </p>
                            </div>

                            {/* Responsibilities */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">Key Responsibilities</h4>
                              <ul className="space-y-2">
                                {job.responsibilities.map((resp, i) => (
                                  <li key={i} className="flex items-start space-x-2.5 text-xs text-neutral-600 leading-relaxed font-body">
                                    <span className="text-red-600 font-bold shrink-0 mt-0.5">▪</span>
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Requirements */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">What We're Looking For</h4>
                              <ul className="space-y-2">
                                {job.requirements.map((req, i) => (
                                  <li key={i} className="flex items-start space-x-2.5 text-xs text-neutral-600 leading-relaxed font-body">
                                    <span className="text-red-600 font-bold shrink-0 mt-0.5">▪</span>
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Technologies */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">Core Tech Stack</h4>
                              <div className="flex flex-wrap gap-2">
                                {job.technologies.map((tech) => (
                                  <span key={tech} className="text-[10px] font-mono font-medium bg-neutral-100 border border-neutral-200 text-neutral-600 px-2.5 py-1 rounded">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Apply row inside expand */}
                            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                              <span className="text-xs font-mono text-neutral-400">Ready to build?</span>
                              <button
                                onClick={() => handleApplyClick(job)}
                                className="bg-black hover:bg-neutral-950 text-white font-sans text-xs font-bold tracking-widest px-6 py-3 rounded transition-all duration-200"
                              >
                                APPLICAITON FORM
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 4. Application Form Modal/Section */}
      <AnimatePresence>
        {appliedRole && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAppliedRole(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 border border-neutral-200"
            >
              {/* Header */}
              <div className="bg-black text-white p-6 relative">
                <button
                  onClick={() => setAppliedRole(null)}
                  className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors duration-200"
                >
                  <LucideIcon name="X" className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-mono text-red-600 tracking-wider uppercase font-bold block mb-1">
                  Applying for {appliedRole.department}
                </span>
                <h3 className="text-xl font-sans font-extrabold tracking-tight">
                  {appliedRole.title}
                </h3>
              </div>

              {/* Form Content */}
              <div className="p-6 md:p-8 overflow-y-auto flex-grow space-y-6">
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100">
                      <LucideIcon name="Check" className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-sans font-extrabold text-neutral-900">Application Submitted!</h4>
                    <p className="text-neutral-500 text-xs font-body max-w-sm mx-auto leading-relaxed">
                      Thank you for applying, <span className="font-semibold text-black">{formData.name}</span>. 
                      Our engineering recruitment team has received your application and will review your 
                      LinkedIn and details shortly.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => setAppliedRole(null)}
                        className="bg-black text-white text-xs font-mono tracking-widest uppercase px-6 py-3 rounded hover:bg-neutral-900 transition-colors"
                      >
                        CLOSE WINDOW
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-red-600 focus:bg-white px-4 py-2.5 text-xs rounded-lg text-black outline-none transition-all duration-200"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-red-600 focus:bg-white px-4 py-2.5 text-xs rounded-lg text-black outline-none transition-all duration-200"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                          LinkedIn Profile Link
                        </label>
                        <input
                          type="url"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-red-600 focus:bg-white px-4 py-2.5 text-xs rounded-lg text-black outline-none transition-all duration-200"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                          Portfolio or GitHub Link
                        </label>
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleInputChange}
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-red-600 focus:bg-white px-4 py-2.5 text-xs rounded-lg text-black outline-none transition-all duration-200"
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                          Years of Experience
                        </label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-red-600 focus:bg-white px-4 py-2.5 text-xs rounded-lg text-neutral-800 outline-none transition-all duration-200"
                        >
                          <option>1-3 Years</option>
                          <option>3-5 Years</option>
                          <option>5-8 Years</option>
                          <option>8+ Years</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                          Resume URL
                        </label>
                        <input
                          type="url"
                          name="resumeUrl"
                          value={formData.resumeUrl}
                          onChange={handleInputChange}
                          className="w-full bg-neutral-50 border border-neutral-200 focus:border-red-600 focus:bg-white px-4 py-2.5 text-xs rounded-lg text-black outline-none transition-all duration-200"
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                        Brief Cover Letter / Comments
                      </label>
                      <textarea
                        name="coverLetter"
                        rows={4}
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-50 border border-neutral-200 focus:border-red-600 focus:bg-white px-4 py-3 text-xs rounded-lg text-black outline-none transition-all duration-200 resize-none"
                        placeholder="Tell us why you are a perfect fit for this engineering role at RedFort AI..."
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setAppliedRole(null)}
                        className="border border-neutral-200 hover:border-neutral-300 text-neutral-600 text-xs font-mono tracking-wider uppercase px-5 py-2.5 rounded transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-sans font-bold tracking-widest px-8 py-3 rounded shadow-md shadow-red-600/10 transition-all duration-200"
                      >
                        SUBMIT APPLICATION
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. CTA Section */}
      <CTA
        title="Can't Find Your Perfect Role?"
        description="We are always looking for exceptional, forward-thinking people. Send us your CV, and let us know how you can contribute to the RedFort AI mission."
        buttonText="CONTACT RECRUITMENT"
      />
    </div>
  );
}
