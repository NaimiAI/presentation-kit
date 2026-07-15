interface LogoRowProps {
  logos: Array<{ src: string; alt: string }>
  /** Tailwind height class for the images. */
  heightClass?: string
}

/** Row of client/partner logos (ship images as files under src/assets/). */
export default function LogoRow({ logos, heightClass = 'h-8' }: LogoRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-80">
      {logos.map((logo) => (
        <img
          key={logo.src}
          src={logo.src}
          alt={logo.alt}
          draggable={false}
          className={`${heightClass} w-auto object-contain`}
        />
      ))}
    </div>
  )
}
