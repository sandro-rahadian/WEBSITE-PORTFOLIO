export interface CertCard {
  /** short name shown under the preview */
  label: string;
  /** issuer + date line under the preview */
  meta: string;
  /** long description, used as the image alt text */
  alt: string;
  image: string;
  /** intrinsic size of the processed scan, so the preview reserves no shift */
  width: number;
  height: number;
}

export const CERT_TILES: CertCard[] = [
  {
    label: "Backend Developer — Next.js & NestJS",
    meta: "Sertifikat Kompetensi · SMK Telkom Malang · 2026",
    alt: "Sertifikat Kompetensi Telkom untuk Pengembangan Aplikasi Web Menggunakan Framework Next.js dan NestJS, diterbitkan SMK Telkom Malang.",
    image: "/certificates/telekom-kompetensi-nextjs-nestjs.jpg",
    width: 1200,
    height: 848,
  },
  {
    label: "Belajar Dasar Cloud dan Gen AI di AWS",
    meta: "Dicoding Academy · 21 Juli 2026",
    alt: "Sertifikat Kelulusan Dicoding untuk Belajar Dasar Cloud dan Gen AI di AWS.",
    image: "/certificates/dicoding-aws-cloud-gen-ai.jpg",
    width: 1200,
    height: 848,
  },
  {
    label: "JavaScript (Intermediate)",
    meta: "HackerRank · 07 Agustus 2026",
    alt: "HackerRank Certificate of Accomplishment untuk JavaScript, level Intermediate.",
    image: "/certificates/hackerrank-javascript-intermediate.jpg",
    width: 1200,
    height: 914,
  },
  {
    label: "Node.js (Intermediate)",
    meta: "HackerRank · 06 Agustus 2026",
    alt: "HackerRank Certificate of Accomplishment untuk Node.js, level Intermediate.",
    image: "/certificates/hackerrank-nodejs-intermediate.jpg",
    width: 1200,
    height: 914,
  },
  {
    label: "Spec-Driven Development dengan Kiro",
    meta: "Dicoding Academy · 21 Juli 2026",
    alt: "Sertifikat Kelulusan Dicoding untuk Spec-Driven Development dengan Kiro.",
    image: "/certificates/dicoding-kiro-spec-driven.jpg",
    width: 1200,
    height: 848,
  },
  {
    label: "Python Programming",
    meta: "Samsung Innovation Campus · Batch 7",
    alt: "Certificate of Completion Samsung Innovation Campus untuk Python Programming, Batch 7.",
    image: "/certificates/samsung-innovation-python.jpg",
    width: 1200,
    height: 848,
  },
];
