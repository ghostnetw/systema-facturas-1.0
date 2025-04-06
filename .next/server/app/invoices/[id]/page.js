(()=>{var e={};e.id=783,e.ids=[783],e.modules={2882:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>w});var i=t(60687),r=t(43210),a=t(16189),d=t(27553),n=t(24934),l=t(55192),o=t(96752),c=t(59821),x=t(78377),h=t(28559),m=t(71444),p=t(31158),u=t(63143),v=t(88233),j=t(85814),f=t.n(j),g=t(83544),b=t(95033),N=t(70333),y=t(23217);function w(){(0,a.useParams)();let e=(0,a.useRouter)(),{invoices:s,deleteInvoice:t,getInvoiceById:j}=(0,d.U)(),[w,A]=(0,r.useState)(null),[C,P]=(0,r.useState)(!0);return C?(0,i.jsx)(g.b,{children:(0,i.jsx)("div",{className:"flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8",children:(0,i.jsxs)("div",{className:"flex items-center gap-4",children:[(0,i.jsx)(n.$,{variant:"outline",size:"icon",asChild:!0,children:(0,i.jsx)(f(),{href:"/invoices",children:(0,i.jsx)(h.A,{className:"h-4 w-4"})})}),(0,i.jsx)("h1",{className:"text-2xl font-bold",children:"Cargando factura..."})]})})}):w?(0,i.jsx)(g.b,{children:(0,i.jsxs)("div",{className:"flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8",children:[(0,i.jsxs)("div",{className:"flex items-center justify-between",children:[(0,i.jsxs)("div",{className:"flex items-center gap-4",children:[(0,i.jsx)(n.$,{variant:"outline",size:"icon",asChild:!0,children:(0,i.jsx)(f(),{href:"/invoices",children:(0,i.jsx)(h.A,{className:"h-4 w-4"})})}),(0,i.jsxs)("h1",{className:"text-2xl font-bold",children:["Factura ",w.id]}),(0,i.jsx)(c.E,{variant:"Pagada"===w.status?"success":"Pendiente"===w.status?"outline":"destructive",className:"Pagada"===w.status?"bg-green-100 text-green-800 hover:bg-green-100":"Pendiente"===w.status?"bg-yellow-100 text-yellow-800 hover:bg-yellow-100":"bg-red-100 text-red-800 hover:bg-red-100",children:w.status})]}),(0,i.jsxs)("div",{className:"flex gap-2",children:[(0,i.jsxs)(n.$,{variant:"outline",size:"sm",onClick:()=>{if(w)try{let e=window.open("","_blank");if(!e){(0,N.o)({title:"Error",description:"No se pudo abrir la ventana de impresi\xf3n. Comprueba que no est\xe9 bloqueada por el navegador.",variant:"destructive"});return}e.document.write(`
          <html>
            <head>
              <title>Factura ${w.id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .company { font-size: 24px; font-weight: bold; }
                .invoice-info { text-align: right; }
                .client-info { margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .totals { text-align: right; margin-bottom: 30px; }
                .total { font-weight: bold; font-size: 18px; }
                .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #666; }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <div class="company">RESINA ROSARIO, S.L.</div>
                  <div>CIF: B12345678</div>
                  <div>Calle Ejemplo, 123</div>
                  <div>28001 Madrid</div>
                </div>
                <div class="invoice-info">
                  <div><strong>Factura:</strong> ${w.id}</div>
                  <div><strong>Fecha:</strong> ${w.date}</div>
                  <div><strong>Vencimiento:</strong> ${w.dueDate}</div>
                  <div><strong>Estado:</strong> ${w.status}</div>
                </div>
              </div>
              
              <div class="client-info">
                <h3>Cliente:</h3>
                <div>${w.client}</div>
                <div>CIF: ${w.cif}</div>
              </div>
              
              <h3>Conceptos:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Descripci\xf3n</th>
                    <th>Precio (€)</th>
                    <th>IVA (%)</th>
                    <th>Total (€)</th>
                  </tr>
                </thead>
                <tbody>
                  ${w.items?w.items.map(e=>`
                      <tr>
                        <td>${e.description}</td>
                        <td>${e.price.toFixed(2)}</td>
                        <td>${e.tax}%</td>
                        <td>${(e.price*(1+e.tax/100)).toFixed(2)}</td>
                      </tr>
                    `).join(""):`<tr>
                      <td colspan="4">No hay conceptos disponibles</td>
                    </tr>`}
                </tbody>
              </table>
              
              <div class="totals">
                <div>Base Imponible: ${w.amount}</div>
                <div>IVA: ${w.tax}</div>
                <div class="total">Total: ${w.total}</div>
              </div>
              
              <div>
                <div>Forma de pago: Transferencia Bancaria</div>
                <div>IBAN: ES12 3456 7890 1234 5678 9012</div>
              </div>
              
              <div class="footer">
                Gracias por confiar en RESINA ROSARIO, S.L.
              </div>
            </body>
          </html>
        `),e.document.close(),e.focus(),setTimeout(()=>{e.print()},500)}catch(e){console.error("Error al imprimir:",e),(0,N.o)({title:"Error",description:"Ha ocurrido un error al preparar la impresi\xf3n.",variant:"destructive"})}},children:[(0,i.jsx)(m.A,{className:"mr-2 h-4 w-4"}),"Imprimir"]}),(0,i.jsxs)(n.$,{variant:"outline",size:"sm",onClick:()=>{if(w)try{(0,y.E)(w),(0,N.o)({title:"PDF generado",description:`La factura ${w.id} se ha descargado correctamente.`})}catch(e){console.error("Error al generar el PDF:",e),(0,N.o)({title:"Error",description:"Ha ocurrido un error al generar el PDF.",variant:"destructive"})}},children:[(0,i.jsx)(p.A,{className:"mr-2 h-4 w-4"}),"Descargar PDF"]}),(0,i.jsx)(n.$,{variant:"outline",size:"sm",asChild:!0,children:(0,i.jsxs)(f(),{href:`/invoices/${w.id}/edit`,children:[(0,i.jsx)(u.A,{className:"mr-2 h-4 w-4"}),"Editar"]})}),(0,i.jsxs)(b.Lt,{children:[(0,i.jsx)(b.tv,{asChild:!0,children:(0,i.jsxs)(n.$,{variant:"destructive",size:"sm",children:[(0,i.jsx)(v.A,{className:"mr-2 h-4 w-4"}),"Eliminar"]})}),(0,i.jsxs)(b.EO,{children:[(0,i.jsxs)(b.wd,{children:[(0,i.jsx)(b.r7,{children:"\xbfEst\xe1s seguro?"}),(0,i.jsxs)(b.$v,{children:["Esta acci\xf3n no se puede deshacer. Esto eliminar\xe1 permanentemente la factura ",w.id," y no podr\xe1 ser recuperada."]})]}),(0,i.jsxs)(b.ck,{children:[(0,i.jsx)(b.Zr,{children:"Cancelar"}),(0,i.jsx)(b.Rx,{onClick:()=>{w&&(t(w.id),(0,N.o)({title:"Factura eliminada",description:`La factura ${w.id} ha sido eliminada correctamente.`}),e.push("/invoices"))},className:"bg-red-600 hover:bg-red-700",children:"Eliminar"})]})]})]})]})]}),(0,i.jsxs)("div",{className:"grid gap-6 md:grid-cols-2",children:[(0,i.jsxs)(l.Zp,{children:[(0,i.jsx)(l.aR,{children:(0,i.jsx)(l.ZB,{children:"Datos de Facturaci\xf3n"})}),(0,i.jsxs)(l.Wu,{className:"space-y-4",children:[(0,i.jsxs)("div",{className:"space-y-2",children:[(0,i.jsx)("h3",{className:"text-sm font-medium",children:"Datos de tu empresa"}),(0,i.jsxs)("div",{className:"rounded-md border p-4 bg-gray-50",children:[(0,i.jsx)("p",{className:"font-medium",children:"RESINA ROSARIO, S.L."}),(0,i.jsx)("p",{className:"text-sm text-muted-foreground",children:"CIF: B12345678"}),(0,i.jsx)("p",{className:"text-sm text-muted-foreground",children:"Calle Ejemplo, 123"}),(0,i.jsx)("p",{className:"text-sm text-muted-foreground",children:"28001 Madrid"})]})]}),(0,i.jsx)(x.w,{}),(0,i.jsxs)("div",{className:"space-y-2",children:[(0,i.jsx)("h3",{className:"text-sm font-medium",children:"Datos del cliente"}),(0,i.jsxs)("div",{className:"rounded-md border p-4 bg-gray-50",children:[(0,i.jsx)("p",{className:"font-medium",children:w.client}),(0,i.jsxs)("p",{className:"text-sm text-muted-foreground",children:["CIF: ",w.cif]})]})]})]})]}),(0,i.jsxs)(l.Zp,{children:[(0,i.jsx)(l.aR,{children:(0,i.jsx)(l.ZB,{children:"Detalles de la Factura"})}),(0,i.jsxs)(l.Wu,{className:"space-y-4",children:[(0,i.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"text-sm font-medium",children:"N\xfamero de Factura"}),(0,i.jsx)("p",{children:w.id})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"text-sm font-medium",children:"Fecha de Emisi\xf3n"}),(0,i.jsx)("p",{children:w.date})]})]}),(0,i.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"text-sm font-medium",children:"Fecha de Vencimiento"}),(0,i.jsx)("p",{children:w.dueDate})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"text-sm font-medium",children:"Estado"}),(0,i.jsx)(c.E,{variant:"Pagada"===w.status?"success":"Pendiente"===w.status?"outline":"destructive",className:"Pagada"===w.status?"bg-green-100 text-green-800 hover:bg-green-100":"Pendiente"===w.status?"bg-yellow-100 text-yellow-800 hover:bg-yellow-100":"bg-red-100 text-red-800 hover:bg-red-100",children:w.status})]})]})]})]})]}),(0,i.jsxs)(l.Zp,{children:[(0,i.jsx)(l.aR,{children:(0,i.jsx)(l.ZB,{children:"Conceptos"})}),(0,i.jsx)(l.Wu,{children:(0,i.jsx)("div",{className:"rounded-md border",children:(0,i.jsxs)(o.XI,{children:[(0,i.jsx)(o.A0,{children:(0,i.jsxs)(o.Hj,{children:[(0,i.jsx)(o.nd,{className:"w-[60%]",children:"Descripci\xf3n"}),(0,i.jsx)(o.nd,{children:"Precio (€)"}),(0,i.jsx)(o.nd,{children:"IVA (%)"}),(0,i.jsx)(o.nd,{children:"Total"})]})}),(0,i.jsx)(o.BF,{children:w.items?w.items.map(e=>{let s=e.price,t=e.tax;return(0,i.jsxs)(o.Hj,{children:[(0,i.jsx)(o.nA,{children:e.description}),(0,i.jsxs)(o.nA,{children:["€",s.toFixed(2)]}),(0,i.jsxs)(o.nA,{children:[t,"%"]}),(0,i.jsxs)(o.nA,{className:"font-medium",children:["€",(s*(1+t/100)).toFixed(2)]})]},e.id)}):(0,i.jsx)(o.Hj,{children:(0,i.jsx)(o.nA,{colSpan:4,className:"text-center",children:"No hay conceptos disponibles"})})})]})})}),(0,i.jsxs)(l.wL,{className:"flex justify-between",children:[(0,i.jsx)("div",{}),(0,i.jsxs)("div",{className:"space-y-2 text-right",children:[(0,i.jsxs)("div",{className:"text-sm",children:["Subtotal: ",(0,i.jsx)("span",{className:"font-medium",children:w.amount})]}),(0,i.jsxs)("div",{className:"text-sm",children:["IVA: ",(0,i.jsx)("span",{className:"font-medium",children:w.tax})]}),(0,i.jsxs)("div",{className:"text-lg font-bold",children:["Total: ",w.total]})]})]})]})]})}):(0,i.jsx)(g.b,{children:(0,i.jsxs)("div",{className:"flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8",children:[(0,i.jsxs)("div",{className:"flex items-center gap-4",children:[(0,i.jsx)(n.$,{variant:"outline",size:"icon",asChild:!0,children:(0,i.jsx)(f(),{href:"/invoices",children:(0,i.jsx)(h.A,{className:"h-4 w-4"})})}),(0,i.jsx)("h1",{className:"text-2xl font-bold",children:"Factura no encontrada"})]}),(0,i.jsx)(l.Zp,{children:(0,i.jsxs)(l.Wu,{className:"pt-6",children:[(0,i.jsx)("p",{children:"La factura que est\xe1s buscando no existe o ha sido eliminada."}),(0,i.jsx)("div",{className:"mt-4",children:(0,i.jsx)(n.$,{asChild:!0,children:(0,i.jsx)(f(),{href:"/invoices",children:"Volver a facturas"})})})]})})]})})}},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},8086:e=>{"use strict";e.exports=require("module")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},28559:(e,s,t)=>{"use strict";t.d(s,{A:()=>i});let i=(0,t(62688).A)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},35898:(e,s,t)=>{Promise.resolve().then(t.bind(t,40208))},40208:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>i});let i=(0,t(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"C:\\\\Users\\\\admin\\\\Desktop\\\\facturaciondev2.0\\\\facturacion2.0\\\\app\\\\invoices\\\\[id]\\\\page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"C:\\Users\\admin\\Desktop\\facturaciondev2.0\\facturacion2.0\\app\\invoices\\[id]\\page.tsx","default")},47607:(e,s,t)=>{"use strict";t.r(s),t.d(s,{GlobalError:()=>d.a,__next_app__:()=>x,pages:()=>c,routeModule:()=>h,tree:()=>o});var i=t(65239),r=t(48088),a=t(88170),d=t.n(a),n=t(30893),l={};for(let e in n)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);t.d(s,l);let o={children:["",{children:["invoices",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,40208)),"C:\\Users\\admin\\Desktop\\facturaciondev2.0\\facturacion2.0\\app\\invoices\\[id]\\page.tsx"]}]},{}]},{loading:[()=>Promise.resolve().then(t.bind(t,54005)),"C:\\Users\\admin\\Desktop\\facturaciondev2.0\\facturacion2.0\\app\\invoices\\loading.tsx"]}]},{layout:[()=>Promise.resolve().then(t.bind(t,58014)),"C:\\Users\\admin\\Desktop\\facturaciondev2.0\\facturacion2.0\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,57398,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(t.t.bind(t,89999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(t.t.bind(t,65284,23)),"next/dist/client/components/unauthorized-error"]}]}.children,c=["C:\\Users\\admin\\Desktop\\facturaciondev2.0\\facturacion2.0\\app\\invoices\\[id]\\page.tsx"],x={require:t,loadChunk:()=>Promise.resolve()},h=new i.AppPageRouteModule({definition:{kind:r.RouteKind.APP_PAGE,page:"/invoices/[id]/page",pathname:"/invoices/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:o}})},62369:(e,s,t)=>{"use strict";t.d(s,{b:()=>o});var i=t(43210),r=t(14163),a=t(60687),d="horizontal",n=["horizontal","vertical"],l=i.forwardRef((e,s)=>{var t;let{decorative:i,orientation:l=d,...o}=e,c=(t=l,n.includes(t))?l:d;return(0,a.jsx)(r.sG.div,{"data-orientation":c,...i?{role:"none"}:{"aria-orientation":"vertical"===c?c:void 0,role:"separator"},...o,ref:s})});l.displayName="Separator";var o=l},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},63143:(e,s,t)=>{"use strict";t.d(s,{A:()=>i});let i=(0,t(62688).A)("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]])},71444:(e,s,t)=>{"use strict";t.d(s,{A:()=>i});let i=(0,t(62688).A)("Printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]])},76066:(e,s,t)=>{Promise.resolve().then(t.bind(t,2882))},78377:(e,s,t)=>{"use strict";t.d(s,{w:()=>n});var i=t(60687),r=t(43210),a=t(62369),d=t(96241);let n=r.forwardRef(({className:e,orientation:s="horizontal",decorative:t=!0,...r},n)=>(0,i.jsx)(a.b,{ref:n,decorative:t,orientation:s,className:(0,d.cn)("shrink-0 bg-border","horizontal"===s?"h-[1px] w-full":"h-full w-[1px]",e),...r}));n.displayName=a.b.displayName}};var s=require("../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),i=s.X(0,[447,840,814,794,310,451,918,12],()=>t(47607));module.exports=i})();