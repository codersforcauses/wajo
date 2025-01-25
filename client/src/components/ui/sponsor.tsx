import Image from "next/image";

import Casio from "../../../public/sponsor-logos/Casio.svg";
import DoE from "../../../public/sponsor-logos/DoE.svg";
import ECU from "../../../public/sponsor-logos/ECU.svg";
import MAWA from "../../../public/sponsor-logos/MAWA.svg";
import Murdoch from "../../../public/sponsor-logos/Murdoch.svg";
import NewEdition from "../../../public/sponsor-logos/New-Edition.svg";
import UWA from "../../../public/sponsor-logos/UWA.svg";

const images = [
  { src: DoE, href: "https://www.education.wa.edu.au/", name: "DoE" },
  { src: UWA, href: "https://www.uwa.edu.au/", name: "UWA" },
  { src: MAWA, href: "https://mawainc.org.au/", name: "MAWA" },
  { src: ECU, href: "https://www.ecu.edu.au/", name: "ECU" },
  { src: NewEdition, href: "https://newedition.com.au", name: "NewEdition" },
  { src: Murdoch, href: "https://www.murdoch.edu.au/", name: "Murdoch" },
  { src: Casio, href: "https://casioeducation.com.au/", name: "Casio" },
];

export default function Sponsor() {
  return (
    <div className="overflow-x-hidden">
      <div className="flex w-full animate-slide list-none flex-nowrap items-center gap-9">
        {[...images, ...images].map((item, index) => (
          <a
            href={item.href}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
            className="h-28 flex-shrink-0"
          >
            <Image src={item.src} alt={`Logo of ${item.name}`} height={100} />
          </a>
        ))}
      </div>
    </div>
  );
}
