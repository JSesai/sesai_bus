export const waitingRoomPageHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sala de Espera - Salidas</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'DM Sans',sans-serif; background:#0a0f1a; color:white; }
        .mono { font-family:'JetBrains Mono',monospace; }

        .header { display:flex; align-items:center; justify-content:space-between; padding:2rem 3rem; border-bottom:1px solid rgba(51,65,85,0.5); }
        .logo { width:5rem; height:5rem; border-radius:1rem; background:linear-gradient(135deg,#06b6d4,#2563eb); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 30px rgba(6,182,212,0.25); animation:glow 3s ease-in-out infinite; flex-shrink:0; }
        .logo span { color:white; font-size:2.5rem; font-weight:700; text-shadow:0 2px 8px rgba(0,0,0,0.3); user-select:none; }
        .title { font-size:2.75rem; font-weight:700; background:linear-gradient(90deg,#22d3ee,#3b82f6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height:1.1; }
        .subtitle { font-size:1rem; color:#94a3b8; margin-top:4px; }
        .clock { font-size:3.5rem; font-weight:700; letter-spacing:0.05em; text-align:right; line-height:1; }
        .clock-date { font-size:1rem; color:#94a3b8; margin-top:4px; }

        .col-header { display:grid; grid-template-columns:140px 1fr 160px 130px 160px 170px; gap:1.25rem; padding:1rem 3rem; border-bottom:2px solid #475569; margin-bottom:4px; }
        .col-header span { font-size:0.875rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:#94a3b8; }

        .row { display:grid; grid-template-columns:140px 1fr 160px 130px 160px 170px; gap:1.25rem; padding:1.25rem 3rem; border-bottom:1px solid rgba(51,65,85,0.5); transition:background 0.2s; }
        .row:hover { background:rgba(30,41,59,0.4); }
        .row:nth-child(even) { background:rgba(15,23,42,0.3); }
        .row:nth-child(even):hover { background:rgba(30,41,59,0.5); }
        .row-hidden { opacity:0; transform:translateY(16px); }
        .row-visible { opacity:1; transform:translateY(0); transition:all 0.4s ease-out; }
        .salido { opacity:0.4; }
        .salido .dest-text { text-decoration:line-through; }
        .salido .time-text { text-decoration:line-through; }

        .badge { padding:0.375rem 1rem; border-radius:9999px; font-size:0.875rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; }
        .pulse { animation:pulse-badge 2s ease-in-out infinite; }
        @keyframes pulse-badge { 0%,100%{opacity:1;} 50%{opacity:0.45;} }
        .dot-pulse { animation:dot-blink 1.5s ease-in-out infinite; }
        @keyframes dot-blink { 0%,100%{opacity:1;} 50%{opacity:0.25;} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(6,182,212,0.3);} 50%{box-shadow:0 0 40px rgba(6,182,212,0.55);} }

        .footer { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 3rem; border-top:1px solid rgba(51,65,85,0.5); background:rgba(2,6,23,0.5); }
        .footer span { font-size:0.875rem; color:#94a3b8; }
    </style>
</head>
<body>
    <div style="min-height:100vh; background:linear-gradient(135deg,#0a0f1a,#111827,#0f172a); display:flex; flex-direction:column;">
        <header class="header">
            <div style="display:flex; align-items:center; gap:1.25rem;">
                <div class="logo"><span>S</span></div>
                <div>
                    <h1 class="title">Salidas del Día</h1>
                    <p class="subtitle">Terminal de Autobuses</p>
                </div>
            </div>
            <div>
                <div id="clock" class="mono clock"></div>
                <div id="date" class="clock-date" style="text-align:right;"></div>
            </div>
        </header>
        <main style="flex:1; overflow-y:auto; padding:2rem 3rem;">
            <div class="col-header">
                <span>Hora</span>
                <span>Destino</span>
                <span style="text-align:center;">Unidad</span>
                <span style="text-align:center;">Asientos</span>
                <span>Chofer</span>
                <span style="text-align:right;">Estado</span>
            </div>
            <div id="board"></div>
            <div id="empty" style="display:none; text-align:center; padding:6rem 0;">
                <svg style="margin:0 auto 1.5rem; opacity:0.3;" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/><path d="M18 18H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z"/><path d="M6 18v3"/><path d="M18 18v3"/><circle cx="8" cy="18" r="1"/><circle cx="16" cy="18" r="1"/></svg>
                <p style="font-size:1.5rem; color:#64748b;">No hay salidas programadas para hoy</p>
            </div>
        </main>
        <footer class="footer">
            <div style="display:flex; align-items:center; gap:0.75rem;">
                <div class="dot-pulse" style="width:10px; height:10px; border-radius:50%; background:#34d399;"></div>
                <span>Actualizado: <span id="lastUpdate">--:--</span></span>
            </div>
            <span>Sistema de Taquilla SESAI</span>
        </footer>
    </div>
    <script>
        function getStatus(dep) {
            var now = new Date();
            var parts = dep.departure_time.split(':');
            var h = parseInt(parts[0]), m = parseInt(parts[1]);
            var d = new Date(); d.setHours(h,m,0,0);
            var diff = (d - now) / 60000;
            if (dep.status === 'disabled' || dep.status === 'removed') return { label:'Cancelado', color:'#f87171', bg:'rgba(239,68,68,0.1)', pulse:false };
            if (diff < -5) return { label:'Salido', color:'#64748b', bg:'rgba(100,116,139,0.1)', pulse:false };
            if (diff >= -5 && diff < 0) return { label:'Abordando', color:'#60a5fa', bg:'rgba(59,130,246,0.15)', pulse:true };
            if (diff >= 0 && diff <= 15) return { label:'Próxima', color:'#fbbf24', bg:'rgba(251,191,36,0.15)', pulse:true };
            if (diff > 15 && diff <= 30) return { label:'A Tiempo', color:'#34d399', bg:'rgba(52,211,153,0.1)', pulse:false };
            return { label:'Programado', color:'#cbd5e1', bg:'rgba(100,116,139,0.1)', pulse:false };
        }
        function renderRow(dep, i) {
            var s = getStatus(dep);
            var avail = dep.seatingCapacity - dep.occupied_seats;
            var isSalido = s.label === 'Salido';
            var row = document.createElement('div');
            row.className = 'row row-hidden' + (isSalido ? ' salido' : '');
            row.style.animationDelay = (i * 80) + 'ms';
            var textColor = isSalido ? '#64748b' : 'white';
            row.innerHTML =
                '<div class="mono time-text" style="font-size:2.5rem; font-weight:700; color:' + textColor + ';">' + dep.departure_time + '</div>' +
                '<div><div class="dest-text" style="font-size:1.5rem; font-weight:600; color:' + textColor + ';">' + dep.city_destination + '</div><div style="font-size:0.875rem; color:#94a3b8; margin-top:2px;">' + dep.terminal_destination + '</div></div>' +
                '<div style="text-align:center;"><span style="display:inline-flex; padding:0.375rem 1rem; border-radius:9999px; background:rgba(51,65,85,0.5); font-size:1.125rem; font-weight:600; color:#e2e8f0;">#' + dep.vehicle_number + '</span></div>' +
                '<div style="text-align:center;"><span class="mono" style="font-size:1.5rem; font-weight:700; color:' + (avail <= 5 ? '#f87171' : '#34d399') + ';">' + avail + '</span><span style="font-size:1rem; color:#64748b;"> / ' + dep.seatingCapacity + '</span></div>' +
                '<div style="font-size:1rem; color:#94a3b8; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + dep.driver_name + '</div>' +
                '<div style="display:flex; justify-content:flex-end;"><span class="badge' + (s.pulse ? ' pulse' : '') + '" style="color:' + s.color + '; background:' + s.bg + ';">' + s.label + '</span></div>';
            setTimeout(function() { row.classList.remove('row-hidden'); row.classList.add('row-visible'); }, 50 + i * 80);
            return row;
        }
        async function fetchData() {
            try {
                var r = await fetch('/api/departures');
                var j = await r.json();
                var board = document.getElementById('board');
                var empty = document.getElementById('empty');
                if (!j.ok || !j.data || j.data.length === 0) { board.innerHTML = ''; empty.style.display = 'block'; return; }
                empty.style.display = 'none';
                board.innerHTML = '';
                j.data.forEach(function(dep, i) { board.appendChild(renderRow(dep, i)); });
                document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' });
            } catch(e) { console.error('Error:', e); }
        }
        function updateClock() {
            var now = new Date();
            document.getElementById('clock').textContent = now.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true });
            document.getElementById('date').textContent = now.toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
        }
        setInterval(fetchData, 15000);
        setInterval(updateClock, 1000);
        fetchData();
        updateClock();
    </script>
</body>
</html>`;
