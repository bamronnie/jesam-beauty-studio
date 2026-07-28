import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const DOWNLOADS_DIR = 'C:\\Users\\blu\\Downloads';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'videos');

// Verify output folder exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Mappings of product IDs to their corresponding downloaded video files
const videoMappings = [
  { id: 'p1', filename: '7185821_Woman_Portrait_2160x3840.mp4' },
  { id: 'p2', filename: '6922999-uhd_2160_3840_24fps.mp4' },
  { id: 'p3', filename: '4783721_Woman_Head_And_Shoulders_1920x1080.mp4' },
  { id: 'p4', filename: '5e9260a9-addb-4f7d-a5e7-d1db0c188e96.mp4' },
  { id: 'p5', filename: '13191186_1920_1080_60fps.mp4' },
  { id: 'p6', filename: '3888254-uhd_2160_4096_25fps.mp4' },
  { id: 'p7', filename: '6144280-uhd_4096_2160_25fps.mp4' },
  { id: 'p8', filename: '8328450-uhd_3840_2160_25fps.mp4' },
  { id: 'p9', filename: '463524_Woman_Smile_1920x1080.mp4' },
  { id: 'p10', filename: '1475126_People_Family_3840x2160.mp4' },
  { id: 'p11', filename: 'WhatsApp Video 2026-07-09 at 6.11.15 AM.mp4' },
  { id: 'p12', filename: '240_F_652418797_1tC4OZ5bvqLwhJZptgLpNOgDqHZAdNhI_ST.mp4' },
  { id: 'hero-bg', filename: '8431525-uhd_4096_2160_25fps.mp4' }
];

console.log('🎬 Starting video processing pipeline...');

// Check if ffmpeg is available
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
  console.log('✔️ ffmpeg detected on system PATH.');
} catch (err) {
  console.error('❌ Error: ffmpeg is not available on your system path. Please install it first.');
  process.exit(1);
}

videoMappings.forEach((mapping) => {
  const inputPath = path.join(DOWNLOADS_DIR, mapping.filename);
  const outputVideoPath = path.join(OUTPUT_DIR, `${mapping.id}.mp4`);
  const outputPosterPath = path.join(OUTPUT_DIR, `${mapping.id}-poster.jpg`);

  console.log(`\n----------------------------------------`);
  console.log(`Processing: ${mapping.filename} -> ${mapping.id}`);

  if (!fs.existsSync(inputPath)) {
    console.warn(`⚠️ Warning: Source file not found: ${inputPath}. Skipping.`);
    return;
  }

  // Get source size
  const sourceStats = fs.statSync(inputPath);
  const sourceMB = (sourceStats.size / (1024 * 1024)).toFixed(2);
  console.log(`Source file size: ${sourceMB} MB`);

  // Detect orientation using ffprobe (if possible) to set scale filters properly
  let scaleFilter = 'scale=-2:720'; // horizontal default
  try {
    const ffprobeOut = execSync(
      `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${inputPath}"`,
      { encoding: 'utf8' }
    ).trim();
    const [width, height] = ffprobeOut.split('x').map(Number);
    console.log(`Resolution: ${width}x${height}`);
    if (height > width) {
      // vertical video scale to 720p height, ensure even dimensions
      scaleFilter = 'scale=-2:720'; 
    }
  } catch (err) {
    console.log('Unable to detect resolution with ffprobe, falling back to default scaling.');
  }

  // Step 1: Compress video using ffmpeg
  const ffmpegVideoCmd = `ffmpeg -y -i "${inputPath}" -vf "${scaleFilter}" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 96k -movflags +faststart "${outputVideoPath}"`;

  try {
    console.log('Running video compression...');
    execSync(ffmpegVideoCmd, { stdio: 'inherit' });
    
    // Get output size
    const outStats = fs.statSync(outputVideoPath);
    const outMB = (outStats.size / (1024 * 1024)).toFixed(2);
    const savings = ((1 - outStats.size / sourceStats.size) * 100).toFixed(1);
    console.log(`✔️ Compressed video saved: ${outMB} MB (Saved ${savings}%)`);
  } catch (err) {
    console.error(`❌ Failed to compress video ${mapping.filename}:`, err.message);
  }

  // Step 2: Extract poster image
  const ffmpegPosterCmd = `ffmpeg -y -ss 00:00:00 -i "${inputPath}" -vframes 1 -q:v 2 "${outputPosterPath}"`;

  try {
    console.log('Extracting poster thumbnail...');
    execSync(ffmpegPosterCmd, { stdio: 'inherit' });
    console.log(`✔️ Extracted poster saved to: ${outputPosterPath}`);
  } catch (err) {
    console.error(`❌ Failed to extract poster for ${mapping.filename}:`, err.message);
  }
});

console.log('\n🏁 Video processing pipeline completed!');
