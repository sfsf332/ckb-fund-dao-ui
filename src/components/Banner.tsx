"use client";

import React from "react";
import Image from "next/image";

export default function Banner() {

  return (
    <div className="banner">
      <Image src="/slogan.svg" alt="banner" width={1104} height={100} />
    </div>
  );
}
