import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const ffmpeg = ffmpegInstaller.path;
const assets = resolve("public/assets");
const input = resolve(assets, "hero.mp4");
const desktopOut = resolve(assets, "hero-warehouse.mp4");
const mobileOut = resolve(assets, "hero-mobile.mp4");
const posterOut = resolve(assets, "hero-poster.jpg");
const posterMobileOut = resolve(assets, "hero-poster-mobile.jpg");

if (!existsSync(input)) {
  console.error("Missing input:", input);
  process.exit(1);
}

function run(args) {
  execFileSync(ffmpeg, args, { stdio: "inherit" });
}

console.log("Compressing desktop hero video (2560x1440 landscape, higher quality)...");
run([
  "-y",
  "-i",
  input,
  "-an",
  "-vf",
  "scale=2560:1440:force_original_aspect_ratio=increase:flags=lanczos,crop=2560:1440,unsharp=5:5:0.75:5:5:0.0",
  "-c:v",
  "libx264",
  "-profile:v",
  "high",
  "-preset",
  "slow",
  "-crf",
  "18",
  "-maxrate",
  "8M",
  "-bufsize",
  "16M",
  "-movflags",
  "+faststart",
  "-pix_fmt",
  "yuv420p",
  desktopOut,
]);

// Source is portrait (~834x1112). Encode mobile as portrait so tall phones
// (Pro Max etc.) don't crop the scene into a thin landscape strip.
console.log("Compressing mobile hero video (1080x1920 portrait)...");
run([
  "-y",
  "-i",
  input,
  "-an",
  "-vf",
  "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,unsharp=5:5:0.55:5:5:0.0",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "20",
  "-maxrate",
  "4M",
  "-bufsize",
  "8M",
  "-movflags",
  "+faststart",
  "-pix_fmt",
  "yuv420p",
  mobileOut,
]);

console.log("Generating desktop poster frame...");
run([
  "-y",
  "-i",
  input,
  "-ss",
  "00:00:00.5",
  "-vframes",
  "1",
  "-vf",
  "scale=2560:1440:force_original_aspect_ratio=increase:flags=lanczos,crop=2560:1440",
  "-q:v",
  "2",
  posterOut,
]);

console.log("Generating mobile poster frame...");
run([
  "-y",
  "-i",
  input,
  "-ss",
  "00:00:00.5",
  "-vframes",
  "1",
  "-vf",
  "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920",
  "-q:v",
  "2",
  posterMobileOut,
]);

console.log("Done.");
