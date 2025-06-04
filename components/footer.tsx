"use client"

import Image from "next/image"
import Link from "next/link"
import { WhatsApp, Discord, Telegram, TikTok, Facebook, Twitter, CoinMarketCap, Instagram, YouTube, Reddit, SubDirect } from "./svg"

export default function Footer() {
  const socialLinks = [
    { icon: <Discord />, href: "#" },
    { icon: <Telegram />, href: "#" },
    { icon: <TikTok />, href: "#" },
    { icon: <Facebook />, href: "#" },
    { icon: <Twitter />, href: "#" },
    { icon: <Reddit />, href: "#" },
    { icon: <Instagram />, href: "#" },
    { icon: <YouTube />, href: "#" },
    { icon: <CoinMarketCap />, href: "#" },
    { icon: <WhatsApp />, href: "#" },
  ]

  return (
    <footer className="border-t border-[#1f2128]">
      <div className="container mx-auto px-4 py-10 flex flex-col items-center">

        {/* Logo */}
        <Image
          src="/logo.svg"
          alt="KGC Trading"
          width={160}
          height={70}
          className="mb-8"
        />

        {/* Subscribe Now and Input */}
        <h3 className="text-lg font-semibold text-[#edb546] mb-2">Subscribe Now</h3>

        <div className="flex w-full max-w-sm items-center border-b border-gray-600 mb-6">
          <input
            type="email"
            placeholder="E-mail Address"
            className="flex-1 ml-[10px] bg-transparent text-center text-white placeholder-white placeholder:text-base outline-none py-2 text-sm border-none"
          />
          <button className="ml-2">
            <SubDirect />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6 mb-6">
          <Link href="/buy-crypto" className="text-[#edb546] text-sm hover:opacity-80">
            Buy Crypto
          </Link>
          <Link href="/markets" className="text-[#edb546] text-sm hover:opacity-80">
            Markets
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {socialLinks.map((social, index) => (
            <Link
              key={index}
              href={social.href}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1f2128] hover:bg-[#1f2128]/80"
            >
              {social.icon}
            </Link>
          ))}
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-[#1f2128] my-4"></div>

        {/* Copyright */}
        <div className="text-xs text-center mb-4">
          Copyright © 2025 KGC - All Rights Reserved.
        </div>

      </div>
    </footer>
  )
}
