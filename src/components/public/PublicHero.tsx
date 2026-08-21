import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { HeroSection } from '../../types';
import { useTenant } from '../../context/TenantContext';

interface PublicHeroProps {
  hero: HeroSection;
}

export const PublicHero: React.FC<PublicHeroProps> = ({ hero }) => {
  const { siteSettings, themeSettings } = useTenant();

  const primaryColor = themeSettings?.primary_color || '#0284c7';
  const accentColor = themeSettings?.accent_color || '#f59e0b';
  const buttonStyle = themeSettings?.button_style || 'rounded-full';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-12 lg:py-20 border-b border-slate-100">
      {/* Subtle decorative background circle */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sky-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {hero.badge_text && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{hero.badge_text}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {hero.candidate_name || siteSettings?.candidate_name}
                </h2>
                {siteSettings?.candidate_number && (
                  <span
                    className="px-3 py-1 text-sm sm:text-base font-extrabold text-white rounded-lg shadow-sm"
                    style={{ backgroundColor: accentColor }}
                  >
                    {siteSettings.candidate_number}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                {hero.title}
              </h1>
            </div>

            {hero.subtitle && (
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {hero.subtitle}
              </p>
            )}

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              {hero.primary_button_text && (
                <Link
                  to={hero.primary_button_url || '/propostas'}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 ${buttonStyle}`}
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>{hero.primary_button_text}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {hero.secondary_button_text && (
                <Link
                  to={hero.secondary_button_url || '/contato'}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:shadow transition-all ${buttonStyle}`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{hero.secondary_button_text}</span>
                </Link>
              )}
            </div>

            {/* Candidate Metadata Summary */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs font-semibold text-slate-500">
              {siteSettings?.party && (
                <span>Partido: <strong className="text-slate-800">{siteSettings.party}</strong></span>
              )}
              {siteSettings?.municipality && (
                <span>Região: <strong className="text-slate-800">{siteSettings.municipality} ({siteSettings.state})</strong></span>
              )}
              {siteSettings?.position && (
                <span>Cargo: <strong className="text-slate-800">{siteSettings.position}</strong></span>
              )}
            </div>
          </div>

          {/* Right Column: Hero Image with High Contrast Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer decorative card shadow */}
              <div
                className="absolute -inset-1.5 rounded-3xl opacity-20 blur-xl"
                style={{ backgroundColor: primaryColor }}
              />

              <div className="relative rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-xl aspect-[4/5]">
                {hero.image_url ? (
                  <img
                    src={hero.image_url}
                    alt={hero.candidate_name}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-slate-400 p-6 text-center">
                    <p className="font-semibold text-sm">Foto Oficial da Campanha</p>
                  </div>
                )}

                {/* Bottom Overlay Label with Candidate Number */}
                {siteSettings?.candidate_number && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{hero.candidate_name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{siteSettings.position}</p>
                    </div>
                    <div
                      className="px-2.5 py-1 rounded-lg text-white font-extrabold text-sm"
                      style={{ backgroundColor: accentColor }}
                    >
                      {siteSettings.candidate_number}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
