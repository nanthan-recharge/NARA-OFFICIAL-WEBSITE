import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Fish, Globe, GraduationCap, Waves } from 'lucide-react';

const sriLankanPartners = [
  { name: 'Ministry of Fisheries', href: 'https://www.fisheries.gov.lk', logo: '/logos/SRI LANKA LOGO .png', fallbackIcon: Anchor },
  { name: 'Ocean University', href: '/learning-development-academy', logo: '/logos/Ocean_University_Sri_Lanka_Crest.png', fallbackIcon: GraduationCap, internal: true },
  { name: 'Sri Lanka Coast Guard', href: 'https://coastguard.gov.lk', logo: '/logos/COST GURD BG NO LOGO .png', fallbackIcon: Waves },
  { name: 'NAQDA', href: 'https://naqda.gov.lk/', logo: '/logos/NAAQDA LOGO .gif', fallbackIcon: Fish },
  { name: 'Dialog Axiata', href: 'https://www.dialog.lk/', logo: '/logos/logo.svg', fallbackIcon: Globe },
  { name: 'KDU', href: 'https://kdu.ac.lk/', logo: '/logos/KOTHAWAY UNIVERCITY .png', fallbackIcon: GraduationCap },
];

const internationalPartners = [
  { name: 'FAO', href: 'https://www.fao.org', logo: '/logos/FAO_logo.svg.png', fallbackIcon: Fish },
  { name: 'UNDP', href: 'https://www.undp.org', logo: '/logos/undo big logo.png', fallbackIcon: Globe },
  { name: 'KIOST', href: 'https://www.kiost.ac.kr/eng.do', logo: '/logos/KIOST LOGO .svg', fallbackIcon: Globe },
  { name: 'Norad', href: 'https://www.norad.no/en/', logo: '/logos/Norad_hovedlogo-liggende_green_RGB.png', fallbackIcon: Globe },
  { name: 'Chinese Academy of Sciences', href: 'https://english.cas.cn/', logo: '/logos/CHINES ACADMEY OF SCINES.jpeg', fallbackIcon: Globe },
  { name: 'SIO', href: 'https://www.sio.org.cn/en/', logo: '/logos/SIO LOGO .jpeg', fallbackIcon: Globe },
  { name: 'SCSIO', href: 'http://english.scsio.cas.cn/', logo: '/logos/SOUTH CHINA OCEAN .jpg', fallbackIcon: Globe },
];

const partners = [...sriLankanPartners, ...internationalPartners];

const PartnerLogo = ({ partner }) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const FallbackIcon = partner.fallbackIcon;

  return (
    <span className="partner-logo-mark">
      {partner.logo && !logoFailed ? (
        <img
          src={partner.logo}
          alt=""
          aria-hidden="true"
          className="partner-logo-image"
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <FallbackIcon className="partner-logo-fallback" aria-hidden="true" />
      )}
    </span>
  );
};

const PartnerLogoLink = ({ partner }) => {
  const content = <PartnerLogo partner={partner} />;
  const label = partner.internal ? `Open ${partner.name}` : `Visit ${partner.name} website`;
  const className = 'partner-logo-link';

  if (partner.internal) {
    return (
      <Link to={partner.href} className={className} aria-label={label} title={partner.name}>
        {content}
      </Link>
    );
  }

  return (
    <a href={partner.href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label} title={partner.name}>
      {content}
    </a>
  );
};

const PartnersCollaborators = () => (
  <section className="nara-partners-section" aria-labelledby="nara-partners-heading">
    <style>{`
      .nara-partners-section {
        --partner-blue: #0066cc;
        position: relative;
        overflow: hidden;
        border-top: 1px solid rgba(0, 51, 102, 0.1);
        border-bottom: 1px solid rgba(0, 51, 102, 0.08);
        background:
          linear-gradient(90deg, rgba(248, 251, 255, 0.94) 0%, #ffffff 18%, #ffffff 82%, rgba(248, 251, 255, 0.94) 100%);
        color: #0f172a;
      }

      .nara-partners-section::before {
        content: "";
        position: absolute;
        inset: auto 0 0;
        height: 1px;
        pointer-events: none;
        background: linear-gradient(90deg, transparent, rgba(0, 102, 204, 0.28), transparent);
      }

      .nara-partners-shell {
        position: relative;
        z-index: 1;
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
        padding: 6px 0 5px;
      }

      .nara-partners-heading {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }

      .partner-logo-rail {
        display: flex;
        min-width: 0;
        align-items: center;
        gap: 18px;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 2px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }

      .partner-logo-rail::-webkit-scrollbar {
        display: none;
      }

      .partner-logo-link {
        box-sizing: border-box;
        display: flex;
        width: 86px;
        height: 48px;
        min-height: 0;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        opacity: 0.76;
        outline-offset: 4px;
        padding: 0;
        scroll-snap-align: center;
        text-decoration: none;
        transition: opacity 160ms ease, transform 160ms ease, filter 160ms ease;
      }

      .partner-logo-link:hover {
        opacity: 1;
        filter: saturate(1.04);
        transform: translateY(-1px);
      }

      .partner-logo-link:focus-visible {
        opacity: 1;
        outline: 2px solid var(--partner-blue);
      }

      .partner-logo-mark {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
      }

      .partner-logo-image {
        display: block;
        width: auto;
        height: auto;
        min-height: 0 !important;
        max-width: 82px;
        max-height: 42px;
        object-fit: contain;
      }

      .partner-logo-fallback {
        width: 24px;
        height: 24px;
        color: var(--partner-blue);
      }

      @media (max-width: 560px) {
        .nara-partners-shell {
          width: min(100% - 24px, 1180px);
          padding: 5px 0 4px;
        }

        .partner-logo-rail {
          gap: 14px;
        }

        .partner-logo-link {
          width: 72px;
          height: 42px;
        }

        .partner-logo-image {
          max-width: 68px;
          max-height: 36px;
        }

        .partner-logo-fallback {
          width: 21px;
          height: 21px;
        }
      }
    `}</style>

    <div className="nara-partners-shell">
      <h2 id="nara-partners-heading" className="nara-partners-heading">
        Institutional network partners and collaborators
      </h2>

      <div className="partner-logo-rail" role="list" aria-label="NARA partners and collaborators">
        {partners.map((partner) => (
          <div key={partner.name} role="listitem">
            <PartnerLogoLink partner={partner} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PartnersCollaborators;
