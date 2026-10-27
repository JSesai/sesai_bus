export const boardingPageHtml = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Abordaje</title>
<script src="/jsqr.js"></script>
<style>
* { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
body { font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background:#0a0f1a; color:#fff; min-height:100vh; }
.topbar { position:sticky; top:0; z-index:20; display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:#0d1526; border-bottom:1px solid rgba(51,65,85,.5); }
.topbar .brand { display:flex; align-items:center; gap:10px; font-weight:700; font-size:16px; }
.logo { width:34px; height:34px; border-radius:9px; background:linear-gradient(135deg,#06b6d4,#2563eb); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:18px; }
.icon-btn { background:rgba(51,65,85,.4); border:1px solid rgba(71,85,105,.6); color:#e2e8f0; border-radius:10px; width:38px; height:38px; font-size:18px; display:flex; align-items:center; justify-content:center; }
.screen { padding:16px; }
.hidden { display:none !important; }

.card { background:#111a2e; border:1px solid rgba(51,65,85,.55); border-radius:14px; padding:14px; margin-bottom:12px; }
.card h2 { font-size:15px; margin-bottom:10px; }
.input { width:100%; background:#0d1526; border:1px solid rgba(71,85,105,.6); color:#fff; border-radius:10px; padding:13px; font-size:16px; outline:none; }
.input:focus { border-color:#22d3ee; }
.btn { width:100%; background:linear-gradient(135deg,#06b6d4,#2563eb); border:none; color:#fff; border-radius:12px; padding:14px; font-size:16px; font-weight:700; }
.btn.secondary { background:rgba(51,65,85,.5); }
.row { display:flex; gap:10px; margin-top:10px; }
.row .grow { flex:1; }

.dep { background:#111a2e; border:1px solid rgba(51,65,85,.55); border-radius:14px; padding:14px; margin-bottom:10px; }
.dep .t1 { display:flex; align-items:center; justify-content:space-between; }
.dep .time { font-family:ui-monospace,Menlo,monospace; font-size:22px; font-weight:800; }
.dep .unit { background:rgba(51,65,85,.5); padding:4px 10px; border-radius:999px; font-size:12px; color:#e2e8f0; }
.dep .route { margin-top:6px; font-weight:700; font-size:16px; }
.dep .meta { margin-top:8px; display:flex; gap:16px; font-size:13px; color:#94a3b8; }
.badge { padding:3px 10px; border-radius:999px; font-size:12px; font-weight:700; }
.badge.ok { background:rgba(52,211,153,.15); color:#34d399; }
.badge.wait { background:rgba(251,191,36,.15); color:#fbbf24; }

.pax { background:#111a2e; border:1px solid rgba(51,65,85,.55); border-radius:14px; padding:13px; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between; gap:10px; }
.pax .name { font-weight:700; font-size:15px; }
.pax .phone { font-size:12px; color:#94a3b8; margin-top:2px; }
.seats { display:flex; flex-wrap:wrap; gap:5px; margin-top:8px; }
.seat { font-family:ui-monospace,Menlo,monospace; font-size:12px; font-weight:700; padding:3px 8px; border-radius:7px; }
.seat.ok { background:rgba(52,211,153,.15); color:#34d399; }
.seat.wait { background:rgba(251,191,36,.15); color:#fbbf24; }
.pax-right { text-align:right; flex-shrink:0; }

.subtotal { display:flex; gap:10px; margin-bottom:12px; }
.subtotal div { flex:1; text-align:center; padding:10px; border-radius:12px; font-weight:700; font-size:14px; }
.subtotal .b1 { background:rgba(52,211,153,.12); color:#34d399; }
.subtotal .b2 { background:rgba(251,191,36,.12); color:#fbbf24; }

.overlay { position:fixed; inset:0; background:rgba(2,6,23,.92); z-index:50; display:flex; flex-direction:column; }
.overlay .head { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; }
.overlay .body { flex:1; padding:0 16px 16px; overflow-y:auto; }
.overlay .foot { padding:14px 16px; display:flex; gap:10px; }
.overlay .foot .btn { flex:1; }
#scanVideo { width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:14px; background:#000; }
#scanFrame { position:relative; }
#scanFrame .frame { position:absolute; inset:22%; border:3px solid rgba(255,255,255,.8); border-radius:16px; pointer-events:none; }

#toast { position:fixed; left:50%; bottom:24px; transform:translateX(-50%) translateY(20px); background:#0d1526; border:1px solid rgba(71,85,105,.6); color:#fff; padding:11px 18px; border-radius:10px; font-size:14px; opacity:0; transition:all .25s; z-index:100; max-width:88vw; text-align:center; }
#toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
.empty { text-align:center; color:#64748b; padding:40px 0; font-size:14px; }
.pin-wrap { max-width:340px; margin:20vh auto 0; padding:24px; background:#111a2e; border:1px solid rgba(51,65,85,.55); border-radius:16px; }
.pin-wrap h1 { font-size:20px; margin-bottom:6px; }
.pin-wrap p { color:#94a3b8; font-size:13px; margin-bottom:16px; }
.mono { font-family:ui-monospace,Menlo,monospace; letter-spacing:.2em; font-size:24px; text-align:center; }
</style>
</head>
<body>

<div class="topbar">
  <div class="brand"><div class="logo">S</div><span>Abordaje</span></div>
  <div style="display:flex; gap:8px;">
    <button class="icon-btn" id="refreshBtn" title="Actualizar">&#8635;</button>
    <button class="icon-btn" id="homeBtn" title="Salidas" style="display:none;">&#8962;</button>
  </div>
</div>

<!-- PIN -->
<div class="screen" id="screenPin">
  <div class="pin-wrap">
    <h1>Acceso seguro</h1>
    <p>Ingresa el PIN que muestra la pantalla de Abordaje de la PC.</p>
    <input class="input mono" id="pinInput" inputmode="numeric" maxlength="6" placeholder="&#9679;&#9679;&#9679;&#9679;" autocomplete="off">
    <button class="btn" id="pinBtn" style="margin-top:14px;">Entrar</button>
  </div>
</div>

<!-- Fecha / salidas -->
<div class="screen hidden" id="screenMain">
  <div class="row">
    <div class="grow"><input class="input" type="date" id="dateInput"></div>
  </div>
  <div style="height:12px;"></div>
  <div id="departuresList"></div>
</div>

<!-- Manifiesto -->
<div class="screen hidden" id="screenDetail">
  <div id="detailHeader"></div>
  <div class="subtotal" id="detailTotals"></div>
  <button class="btn" id="scanBtn" style="margin-bottom:12px;">&#128247; Escanear boleto</button>
  <div class="row">
    <div class="grow"><input class="input" id="manualInput" placeholder="Código manual (opcional)"></div>
    <button class="btn secondary" id="manualBtn" style="width:auto; padding:13px 16px;">OK</button>
  </div>
  <div style="height:12px;"></div>
  <div id="manifestList"></div>
</div>

<!-- Escáner -->
<div class="overlay hidden" id="scanModal">
  <div class="head"><strong>Escaneando...</strong><button class="icon-btn" id="scanCancel">&#10005;</button></div>
  <div class="body" id="scanFrame">
    <video id="scanVideo" autoplay playsinline muted></video>
    <div class="frame"></div>
  </div>
  <div class="foot"><button class="btn secondary" id="scanCancel2">Cancelar</button></div>
</div>

<!-- Confirmación -->
<div class="overlay hidden" id="confirmModal">
  <div class="head"><strong>Confirmar abordaje</strong><button class="icon-btn" id="confirmCancel">&#10005;</button></div>
  <div class="body" id="confirmBody"></div>
  <div class="foot">
    <button class="btn secondary" id="confirmCancel2">Cancelar</button>
    <button class="btn" id="confirmOk">Registrar abordaje</button>
  </div>
</div>

<div id="toast"></div>

<script>
"use strict";
var state = { pin:null, date:today(), departures:[], scheduleId:null, manifest:[] };
var scanActive = false, scanRaf = 0, scanStream = null, scanDetector = null, scanTick = 0;
var scanCanvas = document.createElement('canvas');
var scanCanvasFull = document.createElement('canvas');
var pendingTickets = [];

function today(){
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function el(id){ return document.getElementById(id); }
function show(id){ el(id).classList.remove('hidden'); }
function hide(id){ el(id).classList.add('hidden'); }

var toastTimer = null;
function toast(msg){
  var t = el('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2600);
}

async function api(path, opts){
  var cfg = { method: (opts && opts.method) || 'GET', headers: { 'Content-Type':'application/json' } };
  if (opts && opts.body) cfg.body = JSON.stringify(opts.body);
  var res = await fetch(path, cfg);
  var j;
  try { j = await res.json(); } catch(e){ j = { ok:false, error:{ detail:'Respuesta inválida del servidor' } }; }
  if (!j.ok) throw new Error((j.error && (j.error.detail || j.error.message)) || 'Error');
  return j.data;
}

function buildManifest(data){
  var map = {};
  (data || []).forEach(function(r){
    if (!map[r.customer_id]) map[r.customer_id] = { customer_id:r.customer_id, customer_name:r.customer_name, customer_phone:r.customer_phone, seats:[] };
    map[r.customer_id].seats.push(r);
  });
  var groups = [];
  Object.keys(map).forEach(function(k){
    var g = map[k];
    g.anyBoarded = g.seats.some(function(s){ return s.boarded_at; });
    g.allBoarded = g.seats.every(function(s){ return s.boarded_at; });
    groups.push(g);
  });
  return groups;
}

async function enterPin(){
  var p = el('pinInput').value.trim();
  if (!p) { toast('Escribe el PIN'); return; }
  try {
    await api('/api/boarding/check-pin?pin=' + encodeURIComponent(p));
    state.pin = p;
    hide('screenPin');
    show('screenMain');
    await loadDepartures();
  } catch(e){
    toast(e.message || 'PIN incorrecto');
  }
}

async function loadDepartures(){
  try {
    var data = await api('/api/boarding/departures?date=' + encodeURIComponent(state.date) + '&pin=' + encodeURIComponent(state.pin));
    state.departures = data || [];
    renderDepartures();
  } catch(e){ toast(e.message); }
}

function renderDepartures(){
  var box = el('departuresList');
  if (!state.departures.length){
    box.innerHTML = '<div class="empty">No hay salidas para esta fecha</div>';
    return;
  }
  var html = '';
  state.departures.forEach(function(d){
    html += '<div class="dep" data-schedule="' + d.id + '">'
      + '<div class="t1"><span class="time">' + d.departure_time + '</span><span class="unit">Unidad ' + d.vehicle_number + '</span></div>'
      + '<div class="route">' + d.city_origin + ' &#8594; ' + d.city_destination + '</div>'
      + '<div class="meta"><span><span class="badge ok">&#10003; ' + d.boarded_seats + '</span></span><span>Vendidos: ' + d.occupied_seats + '</span></div>'
      + '</div>';
  });
  box.innerHTML = html;
  Array.prototype.forEach.call(box.children, function(card){
    card.addEventListener('click', function(){ openManifest(parseInt(card.getAttribute('data-schedule'), 10)); });
  });
}

async function openManifest(scheduleId){
  state.scheduleId = scheduleId;
  var dep = null;
  state.departures.forEach(function(d){ if (d.id === scheduleId) dep = d; });
  if (dep){
    el('detailHeader').innerHTML = '<h2 style="font-size:18px; margin-bottom:4px;">' + dep.city_origin + ' &#8594; ' + dep.city_destination + '</h2>'
      + '<p style="color:#94a3b8; font-size:13px; margin-bottom:12px;">' + dep.departure_time + ' hrs &middot; Unidad ' + dep.vehicle_number + '</p>';
  }
  hide('screenMain');
  show('screenDetail');
  el('homeBtn').style.display = 'flex';
  await loadManifest();
}

function goHome(){
  hide('screenDetail');
  el('homeBtn').style.display = 'none';
  show('screenMain');
}

async function loadManifest(){
  try {
    var data = await api('/api/boarding/manifest?scheduleId=' + state.scheduleId + '&pin=' + encodeURIComponent(state.pin));
    state.manifest = data || [];
    renderManifest();
  } catch(e){ toast(e.message); }
}

function renderManifest(){
  var groups = buildManifest(state.manifest);
  var boarded = 0;
  state.manifest.forEach(function(r){ if (r.boarded_at) boarded++; });
  var pending = state.manifest.length - boarded;
  el('detailTotals').innerHTML = '<div class="b1">&#10003; ' + boarded + ' abordados</div><div class="b2">Pendientes: ' + pending + '</div>';

  var box = el('manifestList');
  if (!state.manifest.length){
    box.innerHTML = '<div class="empty">No hay boletos vendidos o reservados</div>';
    return;
  }
  var html = '';
  groups.forEach(function(g, i){
    var label = g.allBoarded ? 'Abordado' : (g.anyBoarded ? 'Parcial' : 'Pendiente');
    var cls = g.allBoarded ? 'ok' : 'wait';
    var seatsHtml = '';
    g.seats.forEach(function(s){
      seatsHtml += '<span class="seat ' + (s.boarded_at ? 'ok' : 'wait') + '">' + s.seat_number + (s.boarded_at ? ' &#10003;' : '') + '</span>';
    });
    html += '<div class="pax" data-group="' + i + '">'
      + '<div><div class="name">' + g.customer_name + '</div><div class="phone">' + (g.customer_phone || '') + '</div>'
      + '<div class="seats">' + seatsHtml + '</div></div>'
      + '<div class="pax-right"><span class="badge ' + cls + '">' + label + '</span></div>'
      + '</div>';
  });
  box.innerHTML = html;
  Array.prototype.forEach.call(box.children, function(card){
    card.addEventListener('click', function(){
      var g = groups[parseInt(card.getAttribute('data-group'), 10)];
      toggleGroup(g);
    });
  });
}

async function toggleGroup(g){
  var ids = g.seats.map(function(s){ return s.ticket_id; });
  if (g.allBoarded){
    if (!confirm('Revertir el abordaje de ' + g.customer_name + '?')) return;
    try {
      await api('/api/boarding/unmark', { method:'POST', body:{ ticketIds:ids, pin:state.pin } });
      await loadManifest();
      toast('Abordaje revertido');
    } catch(e){ toast(e.message); }
  } else {
    if (!confirm('Registrar abordaje de ' + g.customer_name + '?')) return;
    try {
      await api('/api/boarding/mark', { method:'POST', body:{ ticketIds:ids, pin:state.pin } });
      await loadManifest();
      toast('Abordaje registrado');
    } catch(e){ toast(e.message); }
  }
}

/* ---------- Escáner ---------- */
function hasBarcodeDetector(){ return typeof window.BarcodeDetector === 'function'; }

async function applyCameraFocus(stream){
  try {
    var track = stream.getVideoTracks && stream.getVideoTracks()[0];
    if (!track || !track.getCapabilities) return;
    var caps = track.getCapabilities() || {};
    var modes = caps.focusMode || [];
    if (modes.indexOf('continuous') !== -1){
      try { await track.applyConstraints({ focusMode:'continuous' }); }
      catch(e){ await track.applyConstraints({ advanced:[{ focusMode:'continuous' }] }); }
    }
  } catch(e){}
}

async function startScan(){
  try {
    scanStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 }
      }
    });
    const track = scanStream.getVideoTracks()[0];

    console.log('Cámara seleccionada:', track.label);
    console.log('Configuración real:', track.getSettings());
    console.log('Capacidades:', track.getCapabilities?.());

  } catch(e){
    toast('No se pudo acceder a la cámara. Usa el código manual.');
    return;
  }
  var video = el('scanVideo');
  video.srcObject = scanStream;
  await video.play();
  await applyCameraFocus(scanStream);
  show('scanModal');
  scanActive = true;
  requestAnimationFrame(scanLoop);
}

function stopScan(){
  scanActive = false;
  cancelAnimationFrame(scanRaf);
  if (scanStream){
    scanStream.getTracks().forEach(function(t){ t.stop(); });
    scanStream = null;
  }
  hide('scanModal');
}

function grabFrame(video){
  var vw = video.videoWidth, vh = video.videoHeight;
  if (!vw || !vh) return null;
  var f = 0.6;
  var cw = Math.round(vw * f), ch = Math.round(vh * f);
  var sx = Math.round((vw - cw) / 2), sy = Math.round((vh - ch) / 2);
  scanCanvas.width = cw;
  scanCanvas.height = ch;
  var ctx = scanCanvas.getContext('2d');
  ctx.drawImage(video, sx, sy, cw, ch, 0, 0, cw, ch);
  return scanCanvas;
}

async function decodeFromVideo(video){
  scanTick++;
  var canvas = grabFrame(video);
  if (!canvas) return null;
  if (hasBarcodeDetector()){
    if (!scanDetector) scanDetector = new BarcodeDetector({ formats:['qr_code'] });
    var codes = await scanDetector.detect(canvas);
    if (codes && codes.length && codes[0].rawValue) return codes[0].rawValue;
    codes = await scanDetector.detect(video);
    if (codes && codes.length && codes[0].rawValue) return codes[0].rawValue;
    return null;
  }
  var raw = jsqrDecode(canvas);
  if (raw) return raw;
  if (scanTick % 3 === 0){
    var vw = video.videoWidth, vh = video.videoHeight;
    scanCanvasFull.width = vw;
    scanCanvasFull.height = vh;
    scanCanvasFull.getContext('2d').drawImage(video, 0, 0, vw, vh);
    return jsqrDecode(scanCanvasFull);
  }
  return null;
}

function jsqrDecode(canvas){
  var ctx = canvas.getContext('2d');
  var img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var r = window.jsQR(img.data, img.width, img.height, { inversionAttempts:'attemptBoth' });
  return r ? r.data : null;
}

async function scanLoop(){
  if (!scanActive) return;
  var video = el('scanVideo');
  if (video.readyState >= 2){
    var raw = null;
    try {
      raw = await decodeFromVideo(video);
    } catch(e){
      console.log('error al leer el qr', e);
    }
    if (raw){
      stopScan();
      await identify(raw);
      return;
    }
  }
  scanRaf = requestAnimationFrame(scanLoop);
}

async function identify(raw){
  toast('Identificando...');
  try {
    var tickets = await api('/api/boarding/identify', { method:'POST', body:{ code: raw, pin: state.pin } });
    if (!tickets || !tickets.length){ toast('Boleto no válido o cancelado'); return; }
    pendingTickets = tickets;
    renderConfirm();
    show('confirmModal');
  } catch(e){ toast(e.message); }
}

function renderConfirm(){
  var html = '';
  pendingTickets.forEach(function(t){
    html += '<div style="display:flex; justify-content:space-between; align-items:center; background:#111a2e; border:1px solid rgba(51,65,85,.55); border-radius:12px; padding:12px; margin-bottom:8px;">'
      + '<div><div style="font-weight:700;">' + t.customer_name + '</div><div style="font-size:12px; color:#94a3b8;">' + t.city_origin + ' &#8594; ' + t.city_destination + '</div></div>'
      + '<div style="text-align:right;"><div style="font-family:ui-monospace,monospace; font-weight:800;">Asiento ' + t.seat_number + '</div>'
      + '<div style="font-size:12px; color:#94a3b8;">' + t.dateDeparture + ' &middot; ' + t.departure_time + '</div></div>'
      + '</div>';
  });
  var already = pendingTickets.some(function(t){ return t.boarded_at; });
  if (already) html += '<div style="background:rgba(251,191,36,.1); color:#fbbf24; padding:10px; border-radius:10px; font-size:13px;">Uno o más asientos ya estaban abordados.</div>';
  el('confirmBody').innerHTML = html;
}

async function confirmMark(){
  try {
    var ids = pendingTickets.map(function(t){ return t.ticket_id; });
    await api('/api/boarding/mark', { method:'POST', body:{ ticketIds:ids, pin:state.pin } });
    hide('confirmModal');
    pendingTickets = [];
    toast('Abordaje registrado');
    if (el('screenDetail').classList.contains('hidden') === false) await loadManifest();
  } catch(e){ toast(e.message); }
}

function cancelConfirm(){
  hide('confirmModal');
  pendingTickets = [];
}

/* ---------- Eventos ---------- */
el('pinBtn').addEventListener('click', enterPin);
el('pinInput').addEventListener('keydown', function(e){ if (e.key === 'Enter') enterPin(); });
el('dateInput').addEventListener('change', function(e){ state.date = e.target.value || today(); loadDepartures(); });
el('refreshBtn').addEventListener('click', function(){
  if (el('screenDetail').classList.contains('hidden') === false){ loadManifest(); } else { loadDepartures(); }
});
el('homeBtn').addEventListener('click', goHome);
el('scanBtn').addEventListener('click', startScan);
el('manualBtn').addEventListener('click', function(){
  var v = el('manualInput').value.trim();
  if (v) identify(v);
});
el('manualInput').addEventListener('keydown', function(e){ if (e.key === 'Enter'){ var v = el('manualInput').value.trim(); if (v) identify(v); } });
el('scanCancel').addEventListener('click', stopScan);
el('scanCancel2').addEventListener('click', stopScan);
el('confirmCancel').addEventListener('click', cancelConfirm);
el('confirmCancel2').addEventListener('click', cancelConfirm);
el('confirmOk').addEventListener('click', confirmMark);

el('dateInput').value = state.date;
</script>
</body>
</html>
`;
