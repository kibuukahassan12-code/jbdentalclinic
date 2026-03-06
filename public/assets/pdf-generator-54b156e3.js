import{h as v}from"./html2pdf-ed09852d.js";const r={name:"JB Dental Clinic",tagline:"For All Your Dental Solutions",address:"Makindye, opposite Climax Bar, Kampala, Uganda",phone:"+256 752 001269",email:"info@jbdental.ug",logoUrl:"https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/f51b96d62e1c9d03d4878cf068f6e99e.png"},n=t=>Number(t||0).toLocaleString(),g=t=>t?new Date(t).toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"}):"—",m=`
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:18px;border-bottom:3px solid #7FD856;">
    <div style="flex:1;">
      <img src="${r.logoUrl}" alt="${r.name}" style="height:65px;display:block;" crossorigin="anonymous">
      <p style="margin:6px 0 0 0;font-size:11px;color:#6b7280;">${r.tagline}</p>
    </div>
    <div style="flex:1;text-align:right;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#0F0F0F;">${r.name}</p>
      <p style="margin:2px 0 0 0;font-size:11px;color:#6b7280;">${r.address}</p>
      <p style="margin:2px 0 0 0;font-size:11px;color:#6b7280;">Tel: ${r.phone}</p>
      <p style="margin:2px 0 0 0;font-size:11px;color:#6b7280;">Email: ${r.email}</p>
    </div>
  </div>
`,y=`
  <div style="margin-top:40px;padding-top:18px;border-top:2px solid #7FD856;text-align:center;">
    <p style="margin:0 0 4px 0;font-size:13px;font-weight:600;color:#0F0F0F;">Thank you for choosing ${r.name}!</p>
    <p style="margin:0;font-size:10px;color:#9ca3af;">${r.address} &bull; Tel: ${r.phone} &bull; Email: ${r.email}</p>
  </div>
`,h="padding:40px;font-family:'Segoe UI',Arial,sans-serif;max-width:800px;margin:0 auto;background:white;color:#1f2937;";function u(t,p){const o=document.createElement("div");document.body.appendChild(o),o.innerHTML=t;const a={margin:5,filename:p,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,allowTaint:!0},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}};return v().set(a).from(o).save().then(()=>document.body.removeChild(o)).catch(l=>{console.error("PDF generation failed:",l),document.body.removeChild(o)})}function w({invoice:t,patient:p,payments:o=[],treatments:a=[]}){const l=Number(t.total_amount)||0,i=Number(t.discount)||0,s=Number(t.tax)||0,c=l-i+s,f=o.reduce((x,F)=>x+Number(F.amount||0),0),e=c-f;let d="";a.length>0?a.forEach(x=>{d+=`
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">${x.treatment_name||"Treatment"}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;">${x.quantity||1}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">UGX ${n(x.price||x.cost||0)}</td>
        </tr>`}):d=`
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">Dental Services</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;">1</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">UGX ${n(l)}</td>
      </tr>`;let b="";o.length>0&&o.forEach(x=>{b+=`
        <tr>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;">${g(x.paid_at)}</td>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;">${x.payment_method||"—"}</td>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;text-align:right;">UGX ${n(x.amount)}</td>
        </tr>`});const $=`
    <div style="${h}">
      ${m}

      <!-- Title -->
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="margin:0 0 4px 0;font-size:26px;font-weight:700;color:#0F0F0F;letter-spacing:2px;">INVOICE</h1>
        <p style="margin:0;font-size:13px;color:#6b7280;">INV-${t.id} &bull; ${g(t.created_at)}</p>
        <span style="display:inline-block;margin-top:8px;padding:3px 14px;border-radius:20px;font-size:11px;font-weight:600;
          background:${e<=0?"#dcfce7":"#fef3c7"};color:${e<=0?"#15803d":"#b45309"};">
          ${e<=0?"PAID":t.status||"PENDING"}
        </span>
      </div>

      <!-- Bill To -->
      <div style="background:#f9fafb;padding:16px 20px;border-radius:10px;border-left:4px solid #7FD856;margin-bottom:24px;">
        <p style="margin:0 0 6px 0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Bill To</p>
        <p style="margin:0 0 3px 0;font-size:15px;font-weight:600;color:#0F0F0F;">${(p==null?void 0:p.full_name)||"N/A"}</p>
        ${p!=null&&p.phone?`<p style="margin:0 0 2px 0;font-size:12px;color:#4b5563;">${p.phone}</p>`:""}
        ${p!=null&&p.email?`<p style="margin:0;font-size:12px;color:#6b7280;">${p.email}</p>`:""}
      </div>

      <!-- Items Table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#7FD856;">
            <th style="padding:10px 8px;text-align:left;color:#0F0F0F;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Description</th>
            <th style="padding:10px 8px;text-align:center;color:#0F0F0F;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
            <th style="padding:10px 8px;text-align:right;color:#0F0F0F;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Amount (UGX)</th>
          </tr>
        </thead>
        <tbody>${d}</tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex;justify-content:flex-end;">
        <div style="width:280px;">
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e5e7eb;">
            <span style="color:#4b5563;font-size:12px;">Subtotal</span>
            <span style="color:#0F0F0F;font-size:12px;font-weight:500;">UGX ${n(l)}</span>
          </div>
          ${i>0?`
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e5e7eb;">
            <span style="color:#4b5563;font-size:12px;">Discount</span>
            <span style="color:#16a34a;font-size:12px;font-weight:500;">-UGX ${n(i)}</span>
          </div>`:""}
          ${s>0?`
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e5e7eb;">
            <span style="color:#4b5563;font-size:12px;">Tax</span>
            <span style="color:#0F0F0F;font-size:12px;font-weight:500;">UGX ${n(s)}</span>
          </div>`:""}
          <div style="display:flex;justify-content:space-between;padding:10px 12px;background:#7FD856;border-radius:8px;margin-top:8px;">
            <span style="color:#0F0F0F;font-size:13px;font-weight:700;">Total Due</span>
            <span style="color:#0F0F0F;font-size:15px;font-weight:700;">UGX ${n(c)}</span>
          </div>
          ${f>0?`
          <div style="display:flex;justify-content:space-between;padding:7px 0;margin-top:6px;border-bottom:1px solid #e5e7eb;">
            <span style="color:#4b5563;font-size:12px;">Amount Paid</span>
            <span style="color:#16a34a;font-size:12px;font-weight:500;">UGX ${n(f)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:10px 12px;background:${e<=0?"#dcfce7":"#fef3c7"};border-radius:8px;margin-top:6px;">
            <span style="color:#0F0F0F;font-size:13px;font-weight:700;">${e<=0?"Paid in Full":"Balance Due"}</span>
            <span style="color:${e<=0?"#15803d":"#b45309"};font-size:15px;font-weight:700;">UGX ${n(Math.abs(e))}</span>
          </div>`:""}
        </div>
      </div>

      <!-- Payment History -->
      ${o.length>0?`
      <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e5e7eb;">
        <p style="margin:0 0 10px 0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Payment History</p>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:7px 8px;text-align:left;font-size:10px;color:#6b7280;text-transform:uppercase;">Date</th>
              <th style="padding:7px 8px;text-align:left;font-size:10px;color:#6b7280;text-transform:uppercase;">Method</th>
              <th style="padding:7px 8px;text-align:right;font-size:10px;color:#6b7280;text-transform:uppercase;">Amount</th>
            </tr>
          </thead>
          <tbody>${b}</tbody>
        </table>
      </div>`:""}

      ${y}
    </div>`;return u($,`Invoice-INV-${t.id}-${new Date().toISOString().slice(0,10)}.pdf`)}function D({payment:t,invoice:p,patient:o,allPayments:a=[]}){const l=p?(Number(p.total_amount)||0)-(Number(p.discount)||0)+(Number(p.tax)||0):0,i=a.reduce((e,d)=>e+Number(d.amount||0),0),s=l-i;let c="";a.length>0&&a.forEach(e=>{c+=`
        <tr>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;">${g(e.paid_at)}</td>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;">${e.payment_method||"—"}</td>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;text-align:right;">UGX ${n(e.amount)}</td>
        </tr>`});const f=`
    <div style="${h}">
      ${m}

      <!-- Title -->
      <div style="text-align:center;margin-bottom:28px;">
        <h1 style="margin:0 0 4px 0;font-size:26px;font-weight:700;color:#0F0F0F;letter-spacing:2px;">RECEIPT</h1>
        <p style="margin:0;font-size:13px;color:#6b7280;">RCP-${t.id} &bull; ${g(t.paid_at)}</p>
        <span style="display:inline-block;margin-top:8px;padding:3px 14px;border-radius:20px;font-size:11px;font-weight:600;background:#dcfce7;color:#15803d;">
          PAID
        </span>
      </div>

      <!-- Received From -->
      <div style="background:#f9fafb;padding:16px 20px;border-radius:10px;border-left:4px solid #7FD856;margin-bottom:24px;">
        <p style="margin:0 0 6px 0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Received From</p>
        <p style="margin:0 0 3px 0;font-size:15px;font-weight:600;color:#0F0F0F;">${(o==null?void 0:o.full_name)||"N/A"}</p>
        ${o!=null&&o.phone?`<p style="margin:0 0 2px 0;font-size:12px;color:#4b5563;">${o.phone}</p>`:""}
        ${o!=null&&o.email?`<p style="margin:0;font-size:12px;color:#6b7280;">${o.email}</p>`:""}
      </div>

      <!-- Items Table (same layout as invoice) -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#7FD856;">
            <th style="padding:10px 8px;text-align:left;color:#0F0F0F;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Description</th>
            <th style="padding:10px 8px;text-align:center;color:#0F0F0F;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
            <th style="padding:10px 8px;text-align:right;color:#0F0F0F;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Amount (UGX)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">Payment for INV-${t.invoice_id} (${t.payment_method||"Cash"})</td>
            <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;">1</td>
            <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">UGX ${n(t.amount)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals (same layout as invoice) -->
      <div style="display:flex;justify-content:flex-end;">
        <div style="width:280px;">
          ${p?`
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e5e7eb;">
            <span style="color:#4b5563;font-size:12px;">Invoice Total</span>
            <span style="color:#0F0F0F;font-size:12px;font-weight:500;">UGX ${n(l)}</span>
          </div>`:""}
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e5e7eb;">
            <span style="color:#4b5563;font-size:12px;">This Payment</span>
            <span style="color:#16a34a;font-size:12px;font-weight:600;">UGX ${n(t.amount)}</span>
          </div>
          ${p?`
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e5e7eb;">
            <span style="color:#4b5563;font-size:12px;">Total Paid to Date</span>
            <span style="color:#16a34a;font-size:12px;font-weight:600;">UGX ${n(i)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:10px 12px;background:${s<=0?"#dcfce7":"#fef3c7"};border-radius:8px;margin-top:8px;">
            <span style="color:#0F0F0F;font-size:13px;font-weight:700;">${s<=0?"Paid in Full":"Balance Due"}</span>
            <span style="color:${s<=0?"#15803d":"#b45309"};font-size:15px;font-weight:700;">UGX ${n(Math.abs(s))}</span>
          </div>`:""}
        </div>
      </div>

      <!-- Payment History -->
      ${a.length>0?`
      <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e5e7eb;">
        <p style="margin:0 0 10px 0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Payment History</p>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:7px 8px;text-align:left;font-size:10px;color:#6b7280;text-transform:uppercase;">Date</th>
              <th style="padding:7px 8px;text-align:left;font-size:10px;color:#6b7280;text-transform:uppercase;">Method</th>
              <th style="padding:7px 8px;text-align:right;font-size:10px;color:#6b7280;text-transform:uppercase;">Amount</th>
            </tr>
          </thead>
          <tbody>${c}</tbody>
        </table>
      </div>`:""}

      ${y}
    </div>`;return u(f,`Receipt-RCP-${t.id}-${new Date().toISOString().slice(0,10)}.pdf`)}function T({title:t,period:p,data:o,columns:a,summary:l}){let i="";(o||[]).forEach(e=>{i+="<tr>",a.forEach(d=>{const b=d.render?d.render(e):e[d.key]??"—";i+=`<td style="padding:8px;border-bottom:1px solid #f3f4f6;font-size:12px;color:#374151;text-align:${d.align||"left"};">${b}</td>`}),i+="</tr>"});let s="";l&&l.length>0&&l.forEach(e=>{s+=`
        <div style="flex:1;background:${e.bg||"#f9fafb"};padding:14px 18px;border-radius:10px;text-align:center;border:1px solid ${e.border||"#e5e7eb"};">
          <p style="margin:0 0 4px 0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">${e.label}</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:${e.color||"#0F0F0F"};">${e.value}</p>
        </div>`});const c=`
    <div style="${h}">
      ${m}

      <!-- Title -->
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="margin:0 0 4px 0;font-size:22px;font-weight:700;color:#0F0F0F;">${t}</h1>
        ${p?`<p style="margin:0;font-size:12px;color:#6b7280;">${p}</p>`:""}
        <p style="margin:4px 0 0 0;font-size:11px;color:#9ca3af;">Generated: ${g(new Date().toISOString())}</p>
      </div>

      <!-- Summary Cards -->
      ${s?`<div style="display:flex;gap:12px;margin-bottom:24px;">${s}</div>`:""}

      <!-- Data Table -->
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#7FD856;">
            ${a.map(e=>`<th style="padding:10px 8px;text-align:${e.align||"left"};color:#0F0F0F;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">${e.label}</th>`).join("")}
          </tr>
        </thead>
        <tbody>${i}</tbody>
      </table>

      ${y}
    </div>`,f=t.replace(/[^a-zA-Z0-9]/g,"-");return u(c,`${f}-${new Date().toISOString().slice(0,10)}.pdf`)}export{D as a,T as b,w as g};
