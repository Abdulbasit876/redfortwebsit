import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { LucideIcon } from "./LucideIcon";

interface ContactFormData {
  name: string;
  email: string;
  phoneNumber?: string | null;
  subject: string;
  message: string;
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const BASE_URL = "http://localhost:5000/api/v1/public"; // use `/contacts` for submissions

  const onSubmit = async (data: ContactFormData) => {
    console.log("Submitting contact form data:", data);
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber && data.phoneNumber.trim() !== "" ? data.phoneNumber : null,
        subject: data.subject,
        message: data.message,
      };

      const res = await axios.post(`${BASE_URL}/contacts`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Contact submitted:", res);
      setSubmitSuccess(true);
      reset();
    } catch (err: any) {
      console.error("Contact submit error:", err);
      const msg = err?.response?.data?.message || err?.message || "Submission failed.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-8 md:p-10 shadow-lg relative overflow-hidden">
      
      <AnimatePresence>
        {submitSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8"
          >
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-6">
              <LucideIcon name="Check" className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-black font-sans mb-3">
              Message Transmitted
            </h3>
            <p className="text-neutral-500 text-sm max-w-sm leading-relaxed mb-8">
              Thank you for contacting RedFort AI. A senior solutions architect will review your
              requirements and follow up within 1 business hour.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-sans text-xs tracking-widest px-8 py-3 rounded transition-colors duration-200 font-bold"
            >
              SEND ANOTHER MESSAGE
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-xs font-body uppercase tracking-wider text-neutral-400 font-medium">
              Your Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Alexander Sterling"
              {...register("name", { required: "Name is required." })}
              className={`w-full bg-neutral-50 border ${
                errors.name ? "border-red-600" : "border-neutral-200 focus:border-red-600"
              } text-black px-4 py-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600 transition-colors duration-200 font-sans`}
            />
            {errors.name && (
              <p className="text-xs text-red-600 font-body mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-body uppercase tracking-wider text-neutral-400 font-medium">
              Your Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g. sterling@apex.com"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address."
                }
              })}
              className={`w-full bg-neutral-50 border ${
                errors.email ? "border-red-600" : "border-neutral-200 focus:border-red-600"
              } text-black px-4 py-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600 transition-colors duration-200 font-sans`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 font-body mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-xs font-body uppercase tracking-wider text-neutral-400 font-medium">
              Phone Number <span className="text-neutral-400">(Optional)</span>
            </label>
            <input
              type="tel"
              placeholder="e.g. +1 (512) 555-0192"
              {...register("phoneNumber")}
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-red-600 text-black px-4 py-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600 transition-colors duration-200 font-sans"
            />
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label className="block text-xs font-body uppercase tracking-wider text-neutral-400 font-medium">
              Subject <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Enterprise AI Custom Model Scoping"
              {...register("subject", { required: "Subject is required." })}
              className={`w-full bg-neutral-50 border ${
                errors.subject ? "border-red-600" : "border-neutral-200 focus:border-red-600"
              } text-black px-4 py-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600 transition-colors duration-200 font-sans`}
            />
            {errors.subject && (
              <p className="text-xs text-red-600 font-body mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <label className="block text-xs font-body uppercase tracking-wider text-neutral-400 font-medium">
            Your Message <span className="text-red-600">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Please detail your project parameters, technology needs, or scheduling deadlines..."
            {...register("message", { required: "Message content is required." })}
            className={`w-full bg-neutral-50 border ${
              errors.message ? "border-red-600" : "border-neutral-200 focus:border-red-600"
            } text-black px-4 py-3 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600 transition-colors duration-200 font-sans resize-none`}
          />
          {errors.message && (
            <p className="text-xs text-red-600 font-body mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-sans text-xs tracking-widest py-4 rounded font-bold transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>TRANSMITTING ENCRYPTED PAYLOAD...</span>
            </>
          ) : (
            <>
              <span>TRANSMIT REQUISITION</span>
              <span>→</span>
            </>
          )}
        </button>
        {submitError ? (
          <p className="text-xs text-red-600 font-body mt-2 text-center">{submitError}</p>
        ) : null}
      </form>
    </div>
  );
}
