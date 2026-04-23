export async function exportNdaToPdf() {
  const { default: html2canvas } = await import("html2canvas");
  const { default: jsPDF } = await import("jspdf");

  const element = document.getElementById("nda-preview");
  if (!element) throw new Error("NDA preview element not found");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const usableWidth = pageWidth - margin * 2;

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = usableWidth / (imgWidth / 2); // divide by scale factor
  const totalHeight = (imgHeight / 2) * ratio;

  let yOffset = 0;
  let pageCount = 0;

  while (yOffset < totalHeight) {
    if (pageCount > 0) pdf.addPage();

    const sourceY = (yOffset / ratio) * 2;
    const sourceHeight = Math.min((pageHeight / ratio) * 2, imgHeight - sourceY);

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = imgWidth;
    pageCanvas.height = sourceHeight;
    const ctx = pageCanvas.getContext("2d")!;
    ctx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);

    const pageImgData = pageCanvas.toDataURL("image/png");
    const renderedHeight = (sourceHeight / 2) * ratio;
    pdf.addImage(pageImgData, "PNG", margin, margin, usableWidth, renderedHeight);

    yOffset += pageHeight - margin * 2;
    pageCount++;
  }

  pdf.save("Mutual-NDA.pdf");
}
