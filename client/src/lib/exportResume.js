
const FONTS =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Hanken+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Lora:wght@400;500;600;700&family=Lato:wght@400;700&family=Playfair+Display:wght@500;600;700&family=Poppins:wght@400;500;600;700&display=swap";

export function exportPDF() {
  const node = document.getElementById("resume-paper");
  if (!node) { window.print(); return; }

  const win = window.open("", "_blank", "width=900,height=1200");
  if (!win) {
    
    alert("Please allow pop-ups for this site to download the PDF.");
    window.print();
    return;
  }

  win.document.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>Resume</title>` +
    `<link rel="stylesheet" href="${FONTS}">` +
    `<style>` +
      `*{ -webkit-print-color-adjust:exact; print-color-adjust:exact; box-sizing:border-box; }` +
      `html,body{ margin:0; padding:0; background:#fff; }` +
      `@page{ size:auto; margin:0; }` +             
      `body{ padding:10mm; }` +                       
      `#resume-paper{ box-shadow:none!important; border-radius:0!important; min-height:auto!important; }` +
    `</style></head><body>${node.outerHTML}</body></html>`
  );
  win.document.close();
  win.focus();

 
  setTimeout(() => { win.print(); }, 500);
}


export function exportWord(name) {
  const node = document.getElementById("resume-paper");
  if (!node) return;
  const html =
    `<html xmlns:o='urn:schemas-microsoft-com:office:office' ` +
    `xmlns:w='urn:schemas-microsoft-com:office:word' ` +
    `xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'>` +
    `<style>body{font-family:'Hanken Grotesk',Arial,sans-serif;color:#1b1a17} a{color:#15634f}</style>` +
    `</head><body>${node.outerHTML}</body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(name || "resume").replace(/\s+/g, "_")}_Resume.doc`;
  a.click();
  URL.revokeObjectURL(url);
}