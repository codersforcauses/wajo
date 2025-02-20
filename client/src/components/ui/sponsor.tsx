import Image from "next/image";

const images = [
  {
    src: "/sponsor-logos/DoE.svg",
    href: "https://www.education.wa.edu.au/",
    name: "DoE",
  },
  {
    src: "/sponsor-logos/UWA.svg",
    href: "https://www.uwa.edu.au/",
    name: "UWA",
  },
  {
    src: "/sponsor-logos/MAWA.svg",
    href: "https://mawainc.org.au/",
    name: "MAWA",
  },
  {
    src: "/sponsor-logos/ECU.svg",
    href: "https://www.ecu.edu.au/",
    name: "ECU",
  },
  {
    src: "/sponsor-logos/New-Edition.svg",
    href: "https://newedition.com.au",
    name: "NewEdition",
  },
  {
    src: "/sponsor-logos/Murdoch.svg",
    href: "https://www.murdoch.edu.au/",
    name: "Murdoch",
  },
  {
    src: "/sponsor-logos/Casio.svg",
    href: "https://casioeducation.com.au/",
    name: "Casio",
  },
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
            <Image
              src={item.src}
              alt={`Logo of ${item.name}`}
              height={100}
              width={0}
              className="w-auto"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
