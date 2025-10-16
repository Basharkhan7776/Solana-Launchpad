"use client";


export const Logo = ({textSize}:{textSize?:string}) => (
  <div className={`text-primary font-oswald font-semibold ${"text-"+(textSize?textSize:"xl")}`}>
    SolSoil
  </div>
);
