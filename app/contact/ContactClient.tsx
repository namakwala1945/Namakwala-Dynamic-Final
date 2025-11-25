"use client";
import { useState } from "react";
import PageBanner from "@/components/PageBanner";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { isValidPhoneNumber, parsePhoneNumberFromString, AsYouType  } from "libphonenumber-js";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "";


type FormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export default function ContactClient({ pageData }: { pageData: any }) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  if (!pageData)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600">
        ⚠️ Contact data not found. Please check Strapi.
      </div>
    );

  const banner = pageData.pagebanner;
  const addresses = pageData.Address || [];

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone || !isValidPhoneNumber(formData.phone)) {
      setError("❌ Please enter a valid phone number");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("❌ Please enter a valid email");
      return;
    }

    setError("");
    setSending(true);

    try {
      const res = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setShowPopup(true);
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (err: any) {
      setError(err.message || "❌ Failed to send message. Try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative bg-[#fdf2df] poppins">
      {/* Banner */}
      <PageBanner
        title={banner?.title || "Contact Us"}
        image={
          banner?.image?.url
            ? `${STRAPI_URL}${banner.image.url}`
            : "/optimized/fallback-image.jpg"
        }
        category={banner?.heading || "We’d love to hear from you"}
      />

      <div className="container mx-auto px-6 py-12">
        <p className="text-lg text-center max-w-3xl mx-auto text-gray-600 mb-12">
          {pageData.title || "Get in touch with us..."}
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left - Form */}
          <div className="bg-white shadow-lg p-2">
            <div className="flex flex-wrap text-white justify-between px-6 py-4 items-center gap-6 bg-[#d2ab67]">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <p className="text-sm">{pageData.Number || "+91-98290-39590"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <p className="text-sm">{pageData.Email || "info@namakwala.com"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <p className="text-sm">{pageData.WorkingTime || "Mon-Fri 24 HRS IST"}</p>
              </div>
            </div>

            <div className="w-full m-auto p-6 mt-5">
              <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border p-3 focus:ring-2 focus:ring-gray-500 outline-none"
                  required
                />
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value || "" })}

                  className="border p-3 focus:ring-2 focus:ring-gray-500 outline-none w-full"
                  required
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-3 focus:ring-2 focus:ring-gray-500 outline-none"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="border p-3 focus:ring-2 focus:ring-gray-500 outline-none"
                  rows={5}
                  required
                />
                <button
                  type="submit"
                  disabled={sending}
                  className={`px-6 py-3 gy-bg text-white font-medium shadow hover:gy-bg transition ${
                    sending ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>

          {/* Right - Address Section */}
          <div className="overflow-hidden px-6 py-3">
            <div className="flex flex-col justify-between gap-4">
              {addresses.length > 0 ? (
                addresses.map((addr: any, idx: number) => {
                  const lines =
                    addr.Address?.map((a: any) => a.children?.[0]?.text || "") || [];
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-border shadow-lg p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-xl hover:border-primary cursor-pointer"
                    >
                      <MapPin className="w-6 h-6 text-primary mb-2" />
                      <h5 className="font-bold text-sm text-gradient mb-1 text-center playfair">
                        {addr.Title}
                      </h5>
                      <p className="text-sm text-muted-foreground leading-relaxed text-center">
                        {lines.map((line: string, i: number) => (
                          <span key={i}>
                            {line.split(",").map((part, j) => (
                              <span key={j}>
                                {part.trim()}
                                <br />
                              </span>
                            ))}
                          </span>
                        ))}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center">No address data found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Thank you for connecting!</h2>
            <p className="text-gray-700 mb-4">Our team will get back to you soon.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-primary text-white rounded hover:gy-bg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
