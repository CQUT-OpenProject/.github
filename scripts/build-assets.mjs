import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const logoSource = path.join(root, 'assets/logo/source');
const logoExport = path.join(root, 'assets/logo/export');
const templateSource = path.join(root, 'assets/templates/source');
const templateExport = path.join(root, 'assets/templates/export');
const publicDownloads = path.join(root, 'apps/docs/public/downloads');

await Promise.all([
  rm(logoExport, { recursive: true, force: true }),
  rm(templateExport, { recursive: true, force: true }),
  rm(publicDownloads, { recursive: true, force: true }),
]);
await Promise.all([
  mkdir(logoExport, { recursive: true }),
  mkdir(templateExport, { recursive: true }),
  mkdir(publicDownloads, { recursive: true }),
  mkdir(path.join(root, 'apps/docs/src/assets'), { recursive: true }),
]);

const logoFiles = (await readdir(logoSource)).filter((file) => file.endsWith('.svg'));
for (const file of logoFiles) {
  await cp(path.join(logoSource, file), path.join(logoExport, file));
}

const sizes = [16, 32, 64, 128, 256, 512, 1024];
for (const name of ['mark-color', 'app-icon']) {
  const input = path.join(logoSource, `${name}.svg`);
  for (const size of sizes) {
    await sharp(input)
      .resize(size, size)
      .png()
      .toFile(path.join(logoExport, `${name}-${size}.png`));
  }
}

for (const file of (await readdir(templateSource)).filter((name) => name.endsWith('.svg'))) {
  const input = path.join(templateSource, file);
  const output = path.join(templateExport, file.replace(/\.svg$/, '.png'));
  await cp(input, path.join(templateExport, file));
  await sharp(input).png().toFile(output);
}

await cp(
  path.join(logoSource, 'logo-color.svg'),
  path.join(root, 'apps/docs/src/assets/brand-logo-light.svg'),
);
await cp(
  path.join(logoSource, 'logo-mono-light.svg'),
  path.join(root, 'apps/docs/src/assets/brand-logo-dark.svg'),
);
await cp(path.join(logoSource, 'app-icon.svg'), path.join(root, 'apps/docs/public/favicon.svg'));
await cp(logoExport, path.join(publicDownloads, 'logo'), { recursive: true });
await cp(templateExport, path.join(publicDownloads, 'templates'), { recursive: true });

const manifest = {
  generatedAt: new Date().toISOString(),
  logoSizes: sizes,
  sourceOfTruth: 'assets/logo/source/*.svg',
  templates: (await readdir(templateSource)).sort(),
};
await writeFile(
  path.join(publicDownloads, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(
  `Exported ${logoFiles.length} SVG logos, ${sizes.length * 2} PNG logos and ${manifest.templates.length} templates.`,
);
