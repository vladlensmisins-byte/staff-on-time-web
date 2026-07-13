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

if (!existsSync(input)) {
  console.error("Missing input:", input);
  process.exit(1);
}

function run(args) {
  execFileSync(ffmpeg, args, { stdio: "inherit" });
}

console.log("Compressing desktop hero video...");
run([
  "-y",
  "-i",
  input,
  "-an",
  "-vf",
  "scale=1920:-2:force_original_aspect_ratio=increase,crop=1920:1080,scale=1280:720",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "30",
  "-movflags",
  "+faststart",
  "-pix_fmt",
  "yuv420p",
  desktopOut,
]);

console.log("Compressing mobile hero video...");
run([
  "-y",
  "-i",
  input,
  "-an",
  "-vf",
  "scale=1280:-2:force_original_aspect_ratio=increase,crop=1280:720,scale=960:540",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "31",
  "-movflags",
  "+faststart",
  "-pix_fmt",
  "yuv420p",
  mobileOut,
]);

console.log("Generating poster frame...");
run([
  "-y",
  "-i",
  input,
  "-ss",
  "00:00:00.5",
  "-vframes",
  "1",
  "-vf",
  "scale=1920:-2:force_original_aspect_ratio=increase,crop=1920:1080,scale=1280:720",
  "-q:v",
  "4",
  posterOut,
]);

console.log("Done.");
