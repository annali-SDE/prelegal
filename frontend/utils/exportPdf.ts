function getRelativeTop(el: HTMLElement, ancestor: HTMLElement): number {
  let offset = 0;
  let current: HTMLElement | null = el;
  while (current && current !== ancestor) {
    offset += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return offset;
}

export async function exportNdaToPdf(): Promise<void> {
  const [{ toCanvas }, { jsPDF }] = await Promise.all([
    import("html-to-image"),
    import("jspdf"),
  ]);

  const element = document.getElementById("nda-preview");
  if (!element) throw new Error("Preview element not found");

  const hadExportClass = element.classList.contains("pdf-export-mode");
  if (!hadExportClass) element.classList.add("pdf-export-mode");

  try {
    // Locate where standard terms start so page 1 = cover + signatures
    const standardTermsEl = document.getElementById("pdf-standard-terms");
    const standardTermsDomY = standardTermsEl
      ? getRelativeTop(standardTermsEl, element)
      : null;

    const canvas = await toCanvas(element, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentW = pageW - margin * 2;
    const contentH = pageH - margin * 2;

    const mmPerPx = contentW / canvas.width;
    const pageContentPx = contentH / mmPerPx;

    // Scale from DOM pixels → canvas pixels
    const domToCanvas = canvas.height / element.offsetHeight;

    // Build explicit page-break positions (in canvas px from top)
    const pageStartsPx: number[] = [0];

    // Forced break: right at the start of the standard terms section
    if (standardTermsDomY !== null) {
      const forcedBreakPx = Math.round(standardTermsDomY * domToCanvas);
      if (forcedBreakPx > 10 && forcedBreakPx < canvas.height) {
        pageStartsPx.push(forcedBreakPx);
      }
    }

    // Regular height-based breaks for remaining content
    const lastBreak = pageStartsPx[pageStartsPx.length - 1];
    let cur = lastBreak + pageContentPx;
    while (cur < canvas.height) {
      pageStartsPx.push(Math.round(cur));
      cur += pageContentPx;
    }

    // Render each page slice
    for (let i = 0; i < pageStartsPx.length; i++) {
      if (i > 0) pdf.addPage();

      const srcY = pageStartsPx[i];
      const srcEnd = i + 1 < pageStartsPx.length ? pageStartsPx[i + 1] : canvas.height;
      const srcH = Math.max(1, srcEnd - srcY);

      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = srcH;
      slice.getContext("2d")!.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

      pdf.addImage(slice.toDataURL("image/png"), "PNG", margin, margin, contentW, srcH * mmPerPx);
    }

    pdf.save("Mutual-NDA.pdf");
  } finally {
    if (!hadExportClass) element.classList.remove("pdf-export-mode");
  }
}
