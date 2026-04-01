import { THEME_COLORS } from '../constants/rune';

/**
 * Downloads an SVGSVGElement as a file.
 * Clones the element to ensure any inline styles or CSS variables
 * are resolved before serialization.
 *
 * @param svgElement - The SVG element to download.
 * @param fileName   - Desired filename (without extension if preferred).
 */
export function downloadSvgBlob(svgElement: SVGSVGElement, fileName: string): void {
  // Clone element to manipulate safely
  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  // Crucially reinforce namespace for standalone viewers
  if (!clone.hasAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  // Handle CSS variable replacement by finding elements with stroke
  // instead of a blanket string replace on the whole XML (which can be fragile)
  // or just perform the string replace on the serialized output with more robust regex.
  let svgStr = new XMLSerializer().serializeToString(clone);

  // Robustly replace CSS variable placeholders
  svgStr = svgStr
    .replace(/var\(--accent-color\)/g, THEME_COLORS.ACCENT)
    .replace(/var\(--error-color\)/g, THEME_COLORS.ERROR);

  // Prepend XML declaration if not present
  if (!svgStr.includes('<?xml')) {
    svgStr = '<?xml version="1.0" standalone="no"?>\r\n' + svgStr;
  }

  // Create and trigger download
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName.endsWith('.svg') ? fileName : `${fileName}.svg`;

  document.body.appendChild(anchor);
  anchor.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 100);
}
