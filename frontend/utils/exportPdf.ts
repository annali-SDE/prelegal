function getRelativeTop(el: HTMLElement, ancestor: HTMLElement): number {
  let offset = 0;
  let current: HTMLElement | null = el;
  while (current && current !== ancestor) {
    offset += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return offset;
}

// Collect [topPx, bottomPx] ranges (in canvas pixels) for every element that
// carries the pdf-avoid-break class.  Page breaks must not land inside these ranges.
function collectAvoidBreakRanges(
  root: HTMLElement,
  domToCanvas: number,
): Array<[number, number]> {
  const els = root.querySelectorAll<HTMLElement>(".pdf-avoid-break");
  const ranges: Array<[number, number]> = [];
  els.forEach((el) => {
    const top = Math.floor(getRelativeTop(el, root) * domToCanvas);
    const bottom = Math.ceil((getRelativeTop(el, root) + el.offsetHeight) * domToCanvas);
    ranges.push([top, bottom]);
  });
  return ranges;
}

// If proposedBreak falls inside an avoid-break element, return the element's top
// (break before the element). Otherwise return proposedBreak unchanged.
function snapBreak(
  proposedBreak: number,
  ranges: Array<[number, number]>,
): number {
  for (const [top, bottom] of ranges) {
    if (proposedBreak > top && proposedBreak < bottom) {
      return top;
    }
  }
  return proposedBreak;
}

export async function exportNdaToPdf(): Promise<void> {
  return exportDocumentToPdf("nda-preview", "Mutual-NDA.pdf");
}

export async function exportDocumentToPdf(elementId: string, filename: string): Promise<void> {
  const [{ toCanvas }, { jsPDF }] = await Promise.all([
    import("html-to-image"),
    import("jspdf"),
  ]);

  const element = document.getElementById(elementId);
  if (!element) throw new Error("Preview element not found");

  const hadExportClass = element.classList.contains("pdf-export-mode");
  if (!hadExportClass) element.classList.add("pdf-export-mode");

  try {
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
    const domToCanvas = canvas.height / element.offsetHeight;

    const avoidRanges = collectAvoidBreakRanges(element, domToCanvas);

    const pageStartsPx: number[] = [0];

    // Forced break: cover + signatures on page 1, standard terms from page 2
    if (standardTermsDomY !== null) {
      const forcedBreakPx = Math.round(standardTermsDomY * domToCanvas);
      if (forcedBreakPx > 10 && forcedBreakPx < canvas.height) {
        pageStartsPx.push(forcedBreakPx);
      }
    }

    // Automatic breaks: if the computed break falls inside a pdf-avoid-break
    // element, move it to just before that element's top edge.
    const lastForced = pageStartsPx[pageStartsPx.length - 1];
    let cur = lastForced + pageContentPx;
    while (cur < canvas.height) {
      const safeBreak = snapBreak(Math.round(cur), avoidRanges);
      pageStartsPx.push(safeBreak);
      // Advance from the snapped position so we don't drift backward.
      cur = safeBreak + pageContentPx;
    }

    // Render each page slice
    for (let i = 0; i < pageStartsPx.length; i++) {
      if (i > 0) pdf.addPage();

      const srcY = pageStartsPx[i];
      const srcEnd =
        i + 1 < pageStartsPx.length ? pageStartsPx[i + 1] : canvas.height;
      const srcH = Math.max(1, srcEnd - srcY);

      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = srcH;
      slice
        .getContext("2d")!
        .drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

      pdf.addImage(
        slice.toDataURL("image/png"),
        "PNG",
        margin,
        margin,
        contentW,
        srcH * mmPerPx,
      );
    }

    pdf.save(filename);
  } finally {
    if (!hadExportClass) element.classList.remove("pdf-export-mode");
  }
}
