const $=id=>document.getElementById(id);
let pdfBytes=null, pdfName="signed-document.pdf", drawing=false, hasDrawing=false;
const canvas=$("signatureCanvas"),ctx=canvas.getContext("2d");
ctx.strokeStyle="#173c83";ctx.lineWidth=5;ctx.lineCap="round";ctx.lineJoin="round";
$("year").textContent=new Date().getFullYear();
$("pdfFile").addEventListener("change",async e=>{
 const file=e.target.files[0]; if(!file)return;
 if(file.type!=="application/pdf" && !file.name.toLowerCase().endsWith(".pdf")){ $("fileStatus").textContent="Please choose a PDF file.";return; }
 if(file.size>15*1024*1024){$("fileStatus").textContent="File is larger than 15 MB.";return;}
 try{pdfBytes=await file.arrayBuffer();pdfName=file.name.replace(/\.pdf$/i,"")+"_signed.pdf";$("fileStatus").textContent="Selected: "+file.name;$("prepareBtn").disabled=false;}
 catch(err){$("fileStatus").textContent="Could not read this file.";}
});
$("typedName").addEventListener("input",()=>{$("prepareBtn").disabled=!pdfBytes;});
$("prepareBtn").addEventListener("click",()=>{$("signSection").classList.remove("hidden");$("signSection").scrollIntoView({behavior:"smooth"});});
function point(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};}
canvas.addEventListener("pointerdown",e=>{drawing=true;hasDrawing=true;canvas.setPointerCapture(e.pointerId);const p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);});
canvas.addEventListener("pointermove",e=>{if(!drawing)return;const p=point(e);ctx.lineTo(p.x,p.y);ctx.stroke();});
["pointerup","pointercancel","lostpointercapture"].forEach(n=>canvas.addEventListener(n,()=>drawing=false));
$("clearBtn").addEventListener("click",()=>{ctx.clearRect(0,0,canvas.width,canvas.height);hasDrawing=false;$("signStatus").textContent="";});
$("backBtn").addEventListener("click",()=>{$("signSection").classList.add("hidden");});
$("downloadBtn").addEventListener("click",async()=>{
 if(!pdfBytes)return;
 const name=$("typedName").value.trim();
 if(!hasDrawing&&!name){$("signStatus").textContent="Please draw your signature or type your name.";return;}
 const btn=$("downloadBtn");btn.disabled=true;btn.textContent="Preparing PDF…";
 try{
  if(!window.PDFLib)throw new Error("PDF library did not load. Check your internet connection and try again.");
  const {PDFDocument,rgb,StandardFonts}=PDFLib;
  const doc=await PDFDocument.load(pdfBytes);
  const pages=doc.getPages(),page=pages[pages.length-1],{width}=page.getSize();
  if(hasDrawing){
   const png=await doc.embedPng(canvas.toDataURL("image/png"));
   const w=Math.min(220,width*.38),h=w*canvas.height/canvas.width;
   page.drawImage(png,{x:45,y:45,width:w,height:h});
  }else{
   const font=await doc.embedFont(StandardFonts.HelveticaOblique);
   page.drawText(name,{x:45,y:65,size:25,font,color:rgb(.09,.22,.48)});
  }
  const bytes=await doc.save(),blob=new Blob([bytes],{type:"application/pdf"}),url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=pdfName;a.click();URL.revokeObjectURL(url);
  $("signStatus").textContent="Your signed PDF has been downloaded.";
 }catch(err){$("signStatus").textContent=err.message||"Unable to create PDF.";}
 finally{btn.disabled=false;btn.textContent="Apply signature & download PDF ↓";}
});
const translations={
 en:{eyebrow:"SIMPLE • SECURE • FREE",headline:"Sign documents.<br><em>Anywhere.</em>",lead:"Add your signature to a PDF in a few simple steps. No Premium plan. No account required for this starter version.",workspace:"YOUR WORKSPACE",create:"Create a signature",uploadTitle:"Choose a PDF document",uploadHint:"PDF files only · Maximum 15 MB",browse:"Browse files",noFile:"No document selected",or:"OR",typedLabel:"Type your name",typedHelp:"This creates a stylized text signature.",prepare:"Continue to sign →",step2:"STEP 2",drawTitle:"Create your signature",clear:"Clear",drawHelp:"Use your finger, mouse, or trackpad to draw. Or use the typed name above.",back:"Back",download:"Apply signature & download PDF ↓",f1:"Sign PDF files",f1d:"Add a handwritten or typed signature to your document.",f2:"Simple workflow",f2d:"Choose a file, create a signature, and download the result.",f3:"Free workspace",f3d:"No Premium plan or payment required.",footer:"Your documents stay in this browser during signing."},
 km:{eyebrow:"សាមញ្ញ • សុវត្ថិភាព • ឥតគិតថ្លៃ",headline:"ចុះហត្ថលេខាលើឯកសារ។<br><em>គ្រប់ទីកន្លែង។</em>",lead:"បន្ថែមហត្ថលេខារបស់អ្នកទៅក្នុង PDF តាមជំហានងាយៗ។ ឥតគិតថ្លៃ និងមិនតម្រូវឱ្យបង្កើតគណនីសម្រាប់កំណែដំបូងនេះ។",workspace:"កន្លែងធ្វើការរបស់អ្នក",create:"បង្កើតហត្ថលេខា",uploadTitle:"ជ្រើសរើសឯកសារ PDF",uploadHint:"ឯកសារ PDF ប៉ុណ្ណោះ · អតិបរមា 15 MB",browse:"ជ្រើសរើសឯកសារ",noFile:"មិនទាន់ជ្រើសរើសឯកសារ",or:"ឬ",typedLabel:"វាយឈ្មោះរបស់អ្នក",typedHelp:"វានឹងបង្កើតហត្ថលេខាជាអក្សរ។",prepare:"បន្តទៅចុះហត្ថលេខា →",step2:"ជំហានទី 2",drawTitle:"បង្កើតហត្ថលេខារបស់អ្នក",clear:"លុប",drawHelp:"ប្រើម្រាមដៃ កណ្ដុរ ឬ Trackpad ដើម្បីគូសហត្ថលេខា។",back:"ត្រឡប់ក្រោយ",download:"ដាក់ហត្ថលេខា និងទាញយក PDF ↓",f1:"ចុះហត្ថលេខាលើ PDF",f1d:"បន្ថែមហត្ថលេខាដោយដៃ ឬជាអក្សរ។",f2:"ដំណើរការងាយស្រួល",f2d:"ជ្រើសឯកសារ បង្កើតហត្ថលេខា និងទាញយក។",f3:"ប្រើប្រាស់ឥតគិតថ្លៃ",f3d:"មិនមានគម្រោង Premium ឬការបង់ប្រាក់ទេ។",footer:"ឯកសាររបស់អ្នកស្ថិតនៅក្នុងកម្មវិធីរុករកនេះក្នុងពេលចុះហត្ថលេខា។"}
};
$("language").addEventListener("change",e=>{const t=translations[e.target.value];document.documentElement.lang=e.target.value;document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(t[k])el.innerHTML=t[k];});});
