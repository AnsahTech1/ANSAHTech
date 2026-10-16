import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Clock, Key } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message text is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Specification: submit action logs form data to console
    console.log('--- ANSAH Technology Contact Form Submission ---');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Name:', formData.name);
    console.log('Email:', formData.email);
    console.log('Subject:', formData.subject);
    console.log('Message:', formData.message);
    console.log('------------------------------------------------');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});
    }, 600);
  };

  return (
    <section id="contact" className="py-20 sm:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="w-1.5 h-1.5 bg-neutral-900 dark:bg-cyan-400" />
            <span>Inquiries &amp; Consultations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
            Contact &amp; Engineering Consultation
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
            Open for contract systems engineering, commercial solar installation commissioning, and surveillance infrastructure planning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details & Direct Transmission (5 columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border border-neutral-200 dark:border-neutral-800 p-6 bg-neutral-50/50 dark:bg-[#0e0e0e]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-4">
                ANSAH Technology Headquarters
              </h3>
              
              <ul className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-neutral-900 dark:text-white">Direct Inquiries</span>
                    <a href="mailto:ansahmbanginu@gmail.com" className="hover:text-cyan-600 dark:hover:text-cyan-400 underline underline-offset-2">
                      ansahmbanginu@gmail.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-neutral-900 dark:text-white">Physical Territory</span>
                    <span>Pacific Northwest / Available for global remote &amp; on-site commissioning</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-neutral-900 dark:text-white">Operating Hours</span>
                    <span className="font-mono">08:00 – 18:00 PST (Mon–Fri)</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Key className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-neutral-900 dark:text-white">GPG Public Fingerprint</span>
                    <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 break-all">
                      4F92 B81A 302C 97ED 41E8 0321
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-4 border-l-2 border-neutral-900 dark:border-cyan-400 bg-neutral-50 dark:bg-[#0e0e0e] text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              All infrastructure deployments adhere strictly to NEC Article 690 electrical codes and NDA security clearance guidelines.
            </div>
          </div>

          {/* Minimalist Contact Form (7 columns) */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0e0e0e] p-8 sm:p-10 text-center">
                <CheckCircle2 className="w-10 h-10 text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Message Dispatched</h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto mb-6">
                  Thank you for reaching out. The transmission has been recorded and will be addressed shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 bg-white dark:bg-[#0e0e0e] space-y-6">
                
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                      Full Name <span className="text-cyan-600 dark:text-cyan-400">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Marcus Reid"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#161616] border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 transition-colors ${
                        errors.name
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-neutral-300 dark:border-neutral-700 focus:border-cyan-500 focus:ring-cyan-500'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                      Email Address <span className="text-cyan-600 dark:text-cyan-400">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. m.reid@enterprise.com"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#161616] border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 transition-colors ${
                        errors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-neutral-300 dark:border-neutral-700 focus:border-cyan-500 focus:ring-cyan-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Subject / Project Scope <span className="text-cyan-600 dark:text-cyan-400">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Commercial 32-Camera CCTV Commissioning Consultation"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#161616] border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 transition-colors ${
                      errors.subject
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-neutral-300 dark:border-neutral-700 focus:border-cyan-500 focus:ring-cyan-500'
                    }`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.subject}</span>
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Technical Specifications / Message <span className="text-cyan-600 dark:text-cyan-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your architecture requirements, site location, timeline, or inquiries..."
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#161616] border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 transition-colors resize-y ${
                      errors.message
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-neutral-300 dark:border-neutral-700 focus:border-cyan-500 focus:ring-cyan-500'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                    Direct terminal dispatch &middot; Standard NDA response within 24h
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
                    <Send className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-600" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
