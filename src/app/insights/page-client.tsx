"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  SiteSettings, Insight, D, DEFAULT_INSIGHTS, INSIGHT_IMAGES,
  fadeUp, staggerContainer, staggerItem,
  Navbar, Footer, PageHero, urlFor,
} from "../components";

interface InsightsPageClientProps {
  settings: SiteSettings | null;
  insights: Insight[];
}

export default function InsightsPageClient({ settings, insights }: InsightsPageClientProps) {
  const s = settings || D;

  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden">
      <Navbar />
      <PageHero
        label="Perspectives"
        title="Insights & Research"
        subtitle="Our latest thinking on energy infrastructure, market dynamics, and the forces reshaping the industry."
      />
      <InsightsList insights={insights} />
      <Footer settings={s} />
    </div>
  );
}

// ============================================================================
// INSIGHTS LIST
// ============================================================================

function InsightsList({ insights }: { insights: Insight[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<Insight | null>(null);
  const list = insights.length > 0 ? insights : DEFAULT_INSIGHTS;

  const renderBody = (body: any[]) => {
    if (!body) return null;
    return body.map((block, index) => {
      if (block._type === "block") {
        const text = block.children?.map((c: any) => c.text).join("") || "";
        switch (block.style) {
          case "h2": return <h2 key={index} className="text-xl font-serif text-primary mt-8 mb-3">{text}</h2>;
          case "h3": return <h3 key={index} className="text-lg font-serif text-primary mt-6 mb-2">{text}</h3>;
          case "blockquote": return <blockquote key={index} className="border-l-2 border-accent-400 pl-5 italic text-gray-400 my-5">{text}</blockquote>;
          default: return <p key={index} className="text-gray-500 leading-relaxed mb-4 text-[15px]">{text}</p>;
        }
      }
      if (block._type === "image") {
        const imgUrl = urlFor(block)?.width(800).url();
        return imgUrl ? (
          <div key={index} className="my-6"><img src={imgUrl} alt={block.alt || ""} className="w-full rounded-sm" /></div>
        ) : null;
      }
      return null;
    });
  };

  return (
    <>
      <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12 xl:px-16">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {list.map((item, i) => {
              const img = item.coverImage
                ? urlFor(item.coverImage)?.width(600).height(400).url()
                : INSIGHT_IMAGES[i % INSIGHT_IMAGES.length];
              return (
                <motion.article
                  key={item._id}
                  variants={staggerItem}
                  className="group cursor-pointer bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-2xl hover:border-gray-200 transition-all duration-500 hover:-translate-y-1"
                  onClick={() => setSelected(item)}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={img || ""}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-semibold text-accent-500 tracking-[0.15em] uppercase">{item.category}</span>
                      <span className="text-[11px] text-gray-300">{item.date}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-serif text-primary group-hover:text-accent-600 transition-colors duration-300 leading-snug">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="mt-2 text-[13px] text-gray-400 line-clamp-2">{item.excerpt}</p>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Insight Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-sm shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-4"
              onClick={(e) => e.stopPropagation()}
            >
              {selected.coverImage && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={urlFor(selected.coverImage)?.width(1200).height(675).url() || ""}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="text-[10px] font-semibold text-accent-500 tracking-[0.15em] uppercase">{selected.category}</span>
                  <span className="text-[11px] text-gray-300">{selected.date}</span>
                  {selected.readTime && <span className="text-[11px] text-gray-300">{selected.readTime}</span>}
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-primary leading-snug">{selected.title}</h2>
                {selected.excerpt && (
                  <p className="mt-4 text-gray-400 text-[15px] leading-relaxed">{selected.excerpt}</p>
                )}
                {selected.body && <div className="mt-8">{renderBody(selected.body)}</div>}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setSelected(null)}
                    className="text-xs text-gray-400 hover:text-primary transition-colors uppercase tracking-[0.1em] font-medium"
                  >
                    ← Back to Insights
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
