import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'assets/logo/source');
const exported = path.join(root, 'assets/logo/export');

describe('brand assets', () => {
  it('keeps SVG logos self-contained and scalable', async () => {
    const files = (await readdir(source)).filter((file) => file.endsWith('.svg'));
    expect(files.length).toBeGreaterThanOrEqual(5);
    for (const file of files) {
      const svg = await readFile(path.join(source, file), 'utf8');
      if (file.startsWith('logo-')) {
        expect(svg, file).toMatch(/viewBox="0 0 512 128"/);
      } else {
        expect(svg, file).toMatch(/viewBox="0 0 128 128"/);
      }
      expect(svg, file).not.toMatch(/<image\b|(?:href|src)=['"]https?:\/\//);
    }
  });

  it('horizontally centers every standalone logo', async () => {
    for (const name of ['mark-color', 'mark-mono-dark', 'mark-mono-light', 'favicon']) {
      const { data, info } = await sharp(path.join(source, `${name}.svg`))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const occupiedColumns = Array.from({ length: info.width }, (_, x) => x).filter((x) =>
        Array.from({ length: info.height }, (_, y) => data[(y * info.width + x) * 4 + 3]).some(
          Boolean,
        ),
      );
      const center = (occupiedColumns[0] + occupiedColumns.at(-1)!) / 2;
      expect(center, name).toBeCloseTo((info.width - 1) / 2, 0);
    }
  });

  it('exports every required PNG size', async () => {
    for (const name of ['mark-color', 'app-icon']) {
      for (const size of [16, 32, 64, 128, 256, 512, 1024]) {
        const metadata = await sharp(path.join(exported, `${name}-${size}.png`)).metadata();
        expect(metadata.width).toBe(size);
        expect(metadata.height).toBe(size);
        expect(metadata.format).toBe('png');
      }
    }
  });
});
