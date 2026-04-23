export async function exportNdaToPdf(): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const element = document.getElementById("nda-preview");
  if (!element) throw new Error("Preview element not found");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();  // 210 mm
  const pageH = pdf.internal.pageSize.getHeight(); // 297 mm
  const margin = 10;
  const contentW = pageW - margin * 2; // 190 mm
  const contentH = pageH - margin * 2; // 277 mm

  // mm per canvas pixel (canvas is at 2× scale)
  const mmPerPx = contentW / canvas.width;
  const totalMm = canvas.height * mmPerPx;

  let offsetMm = 0;
  let page = 0;

  while (offsetMm < totalMm) {
    if (page > 0) pdf.addPage();

    const srcY = Math.round(offsetMm / mmPerPx);
    const srcH = Math.min(Math.round(contentH / mmPerPx), canvas.height - srcY);

    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = srcH;
    slice.getContext("2d")!.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

    pdf.addImage(slice.toDataURL("image/png"), "PNG", margin, margin, contentW, srcH * mmPerPx);

    offsetMm += contentH;
    page++;
  }

  pdf.save("Mutual-NDA.pdf");
}
