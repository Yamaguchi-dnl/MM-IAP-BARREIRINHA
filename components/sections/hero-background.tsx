import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

import { eventoConfig } from "@/config/evento";

function imagemPrincipalExiste() {
  const caminho = path.join(process.cwd(), "public", eventoConfig.imagemPrincipal);
  return fs.existsSync(caminho);
}

export function HeroBackground() {
  const temFoto = imagemPrincipalExiste();

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-evento-marrom">
      <div className="absolute inset-0 bg-gradient-to-br from-evento-marrom via-evento-vinho to-evento-argila" />

      {temFoto ? (
        <Image
          src={eventoConfig.imagemPrincipal}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-t from-evento-marrom/95 via-evento-marrom/50 to-evento-marrom/30" />
    </div>
  );
}
