(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[951],{3334:function(e,t,r){Promise.resolve().then(r.bind(r,192)),Promise.resolve().then(r.bind(r,8098))},6463:function(e,t,r){"use strict";var n=r(1169);r.o(n,"useRouter")&&r.d(t,{useRouter:function(){return n.useRouter}})},192:function(e,t,r){"use strict";r.d(t,{CreateItinerary:function(){return N}});var n=r(7437),a=r(4662),s=r(9733),i=r(7209),l=r(2265),o=r(2157),d=r(9772),c=r(4157),u=r(6460),m=r(4241),h=r(9354),g=r(9081),x=r(1413);function j(e){var t,r;let{className:a,field:i}=e;return(0,n.jsx)("div",{className:(0,h.cn)("grid gap-2",a),children:(0,n.jsxs)(x.J2,{children:[(0,n.jsx)(x.xo,{asChild:!0,children:(0,n.jsxs)(s.z,{id:"date",variant:"outline",className:(0,h.cn)("justify-start text-left font-normal",!i.value&&"text-muted-foreground"),children:[(0,n.jsx)(m.Z,{className:"mr-2 h-4 w-4"}),(null===(t=i.value)||void 0===t?void 0:t.from)?i.value.to?(0,n.jsxs)(n.Fragment,{children:[(0,u.WU)(i.value.from,"LLL dd, y")," -"," ",(0,u.WU)(i.value.to,"LLL dd, y")]}):(0,u.WU)(i.value.from,"LLL dd, y"):(0,n.jsx)("span",{children:"Pick a date"})]})}),(0,n.jsx)(x.yk,{className:"w-auto p-0",align:"start",children:(0,n.jsx)(g.f,{initialFocus:!0,mode:"range",defaultMonth:null===(r=i.value)||void 0===r?void 0:r.from,selected:i.value,onSelect:i.onChange,numberOfMonths:2})})]})})}var f=r(2781),p=r(9343),v=r(1014),_=r(3363),y=r(771),w=r(8068);let N=e=>{let t=(0,o.e)(),[r,u]=(0,l.useState)(!1),m=d.z.object({itinerary_name:d.z.string().min(1,{message:"Name cannot be empty"}),itinerary_dates:d.z.object({from:d.z.date(),to:d.z.date()}).refine(e=>e.from>(0,f.E)(new Date,-1),{message:"Start date must be in the future",path:["from"]}).refine(e=>e.to>e.from,{message:"End date must be after start date",path:["to"]}),itinerary_notes:d.z.string().optional()}),h=(0,p.cI)({resolver:(0,v.F)(m),defaultValues:{itinerary_dates:{from:new Date,to:(0,f.E)(new Date,7)},itinerary_notes:""}}),[g,x]=(0,l.useState)({}),N=async e=>{(0,c.z)({onError:x,data:e,onSuccess:e=>{b(e)},schema:m})};async function b(e){var r;let n=await t.auth.getUser(),{data:a,error:s}=await t.rpc("CreateItinerary",{itinerary_end_date:e.itinerary_dates.to.toISOString(),itinerary_name:e.itinerary_name,itinerary_notes:e.itinerary_notes,itinerary_start_date:e.itinerary_dates.from.toISOString(),owner_uuid:null===(r=n.data.user)||void 0===r?void 0:r.id});if(s){console.log(s),(0,w.Am)({title:"Error Creating Itinerary",description:"Something went wrong, please try again later."});return}u(!1)}return(0,n.jsxs)(a.Vq,{open:r,onOpenChange:u,children:[(0,n.jsx)(a.hg,{asChild:!0,children:(0,n.jsx)(s.z,{className:"h-10 rounded-md bg-slate-900 hover:bg-slate-800 hover:text-slate-100 text-slate-50 px-5",children:"Plan new trip"})}),(0,n.jsxs)(a.cZ,{className:"sm:max-w-[425px]",children:[(0,n.jsx)(a.fK,{children:(0,n.jsx)(a.$N,{children:"New Itinerary"})}),(0,n.jsx)("div",{className:"grid gap-4 py-4",children:(0,n.jsx)(_.l0,{...h,children:(0,n.jsxs)("form",{className:"space-y-8",onSubmit:h.handleSubmit(N),children:[(0,n.jsx)("div",{className:"grid grid-cols-1 items-center gap-4",children:(0,n.jsx)(_.Wi,{control:h.control,name:"itinerary_name",render:e=>{let{field:t}=e;return(0,n.jsxs)(_.xJ,{children:[(0,n.jsx)(_.lX,{children:"Name"}),(0,n.jsx)(i.I,{...t,name:"name",placeholder:"Where are you going?",type:"text",id:"name"}),(0,n.jsx)(_.zG,{})]})}})},"name"),(0,n.jsx)("div",{className:"grid grid-cols-1 items-center gap-4",children:(0,n.jsx)(_.Wi,{control:h.control,name:"itinerary_dates",render:e=>{let{field:t}=e;return(0,n.jsxs)(_.xJ,{children:[(0,n.jsx)(_.lX,{children:"Dates"}),(0,n.jsx)(j,{field:t}),(0,n.jsx)(_.zG,{})]})}})},"dates"),(0,n.jsx)("div",{className:"grid grid-cols-1 items-center gap-4",children:(0,n.jsx)(_.Wi,{control:h.control,name:"itinerary_notes",render:e=>{let{field:t}=e;return(0,n.jsxs)(_.xJ,{children:[(0,n.jsx)(_.lX,{children:"Notes"}),(0,n.jsx)(i.I,{...t,name:"notes",placeholder:"Additional Info...",type:"text",id:"notes"}),(0,n.jsx)(_.zG,{})]})}})},"notes"),(0,n.jsx)("div",{className:"grid-rows-1 items-center gap-4",children:(0,n.jsx)(s.z,{className:"float-right",children:"Create"})})]})})})]}),(0,n.jsx)(y.x,{})]})}},8098:function(e,t,r){"use strict";r.d(t,{default:function(){return h}});var n=r(7437),a=r(2265),s=r(2157),i=r(8185),l=r(624);function o(e){let{start_date_string:t,end_date_string:r}=e,a=(0,l.D)(t),s=(0,l.D)(r),i="",o="";i+=a.toLocaleString("default",{month:"long"})+" "+a.getDate(),a.getMonth()==s.getMonth()?o+=s.getDate():o+=s.toLocaleString("default",{month:"long"})+" "+s.getDate(),a.getFullYear()==new Date().getFullYear()&&a.getFullYear()!=s.getFullYear()&&(o+=" "+s.getFullYear(),i+=" "+a.getFullYear()),a.getFullYear()!=new Date().getFullYear()&&(a.getFullYear()==s.getFullYear()&&(o+=", "+s.getFullYear()),a.getFullYear()!=s.getFullYear()&&(i+=", "+a.getFullYear()));let d=i+" - "+o;return(0,n.jsx)("time",{children:d})}var d=r(6463);function c(e){let t=(0,d.useRouter)();return(0,n.jsxs)(i.Zb,{className:"shadow-sm hover:shadow-md hover:cursor-pointer",onClick:()=>{t.push("/plan/".concat(e.id))},children:[(0,n.jsxs)(i.Ol,{children:[(0,n.jsx)(i.ll,{children:e.name}),(0,n.jsx)(i.SZ,{children:"Card Description"})]}),(0,n.jsx)(i.aY,{children:(0,n.jsx)("p",{children:"Card Content"})}),(0,n.jsx)(i.eW,{children:(0,n.jsx)("div",{className:"grid-rows-1 items-center gap-4 text-sm",children:(0,n.jsx)(o,{start_date_string:e.start_date,end_date_string:e.end_date})})})]})}var u=r(402);function m(e){let{itineraries:t}=e,r=Array.from(t.entries());return(0,n.jsxs)("div",{children:[(0,n.jsx)(u.Label,{className:"text-4xl font-semibold",children:"Your Itineraries"}),(0,n.jsx)("div",{className:"grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl w-full mt-10",children:r.map(e=>{let[t,r]=e;return(0,n.jsx)(c,{id:r.id,name:r.name,start_date:r.start_date,end_date:r.end_date,notes:r.notes,owner_uuid:r.owner_uuid,role:r.role},r.id)})})]})}function h(e){let{initialItineraries:t,userId:r}=e,[i,l]=(0,a.useState)(new Map(t)),o=(0,s.e)();return(0,a.useEffect)(()=>{let e=o.channel("table-db-changes").on("postgres_changes",{event:"INSERT",schema:"public",table:"itineraries",filter:"owner_uuid=eq.".concat(r)},e=>{l(t=>{let r=new Map(t),n=e.new;return r.set(n.id,n),r})}).on("postgres_changes",{event:"DELETE",schema:"public",table:"itineraries",filter:"owner_uuid=eq.".concat(r)},e=>{l(t=>{let r=new Map(t),n=e.old;return r.delete(n.id),r})}).subscribe();return()=>{o.removeChannel(e)}},[o,r]),(0,n.jsx)(m,{itineraries:i},i.size)}}},function(e){e.O(0,[203,52,854,1,971,23,744],function(){return e(e.s=3334)}),_N_E=e.O()}]);