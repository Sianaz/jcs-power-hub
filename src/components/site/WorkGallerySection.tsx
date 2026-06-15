import foto2 from "@/assets/jcs_foto_2.jpeg.asset.json";
import foto3 from "@/assets/jcs_foto_3.jpeg.asset.json";
import foto4 from "@/assets/jcs_foto_4.jpeg.asset.json";
import foto5 from "@/assets/jcs_foto_5.jpeg.asset.json";
import foto6 from "@/assets/jcs_foto_6.jpeg.asset.json";
import foto7 from "@/assets/jcs_foto_7.jpeg.asset.json";

const items = [
  { src: foto2.url, label: "Reparación de motor", span: "md:col-span-2 md:row-span-2" },
  { src: foto5.url, label: "Excavadora CAT", span: "" },
  { src: foto6.url, label: "Diagnóstico computarizado", span: "" },
  { src: foto7.url, label: "Bulldozer en sitio", span: "md:col-span-2" },
  { src: foto3.url, label: "Programación de ECU", span: "" },
  { src: foto4.url, label: "Plantas eléctricas", span: "" },
];

export function WorkGallerySection() {
  return (
    <section className="bg-brand-ink py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="font-display text-sm uppercase tracking-widest text-brand-yellow">Nuestro trabajo</p>
          <h2 className="mt-2 font-display text-4xl uppercase leading-tight md:text-5xl">
            En el campo, en el taller, donde sea
          </h2>
          <p className="mt-4 text-white/70">
            Imágenes reales de nuestros técnicos resolviendo fallas en equipos de clientes.
          </p>
        </div>
        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4">
          {items.map((it) => (
            <figure
              key={it.src}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 ${it.span}`}
            >
              <img
                src={it.src}
                alt={it.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-transparent to-transparent" />
              <figcaption className="absolute bottom-3 left-4 right-4 font-display text-sm uppercase tracking-wide text-white">
                {it.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}