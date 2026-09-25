PÉTANQUE OTTAWA-VANIER — SWISS + LIVE SCOREBOARD

WHAT CHANGED
- Professional POV-branded design using the club logo from prior POV tournament artwork.
- English / French.
- Shooter (Tireur) and Pointer (Pointeur) pools.
- Singles, Doubles, Triples.
- Balanced partner draw or fully random team creation.
- Team names use the shooter's name: e.g. Team Senih / Équipe Senih.
- TRUE SWISS FLOW: generate one round at a time from current standings.
- Avoids repeat opponents when possible.
- Odd number of teams: gives a bye to the lowest-ranked team that has not already received one.
- Swiss ranking: Match Points, Buchholz, Point Differential, Points For.
- Optional Top 4 semifinals and final.
- Public spectator page.
- QR code for spectators.
- Live updates use PeerJS browser-to-browser sync: no database account is required.

FILES
index.html   Organizer / admin dashboard
public.html  Read-only spectator scoreboard
app.js       Tournament logic + Swiss pairing + live broadcast
public.js    Spectator live connection
styles.css   Site design
pov-logo.png POV logo

IMPORTANT — QR / LIVE SCORES
The QR/live feature needs the site to have a public HTTPS address. Opening index.html directly from your computer works for tournament management, but other phones cannot access a file:// address.

FREE HOSTING
Netlify Drop is the easiest:
1. Unzip this package.
2. Go to Netlify Drop in your browser.
3. Drag the entire folder onto the page.
4. Netlify gives you a free HTTPS address.
5. Open that address/index.html.
6. Go to Live & QR and press Start Live Board.
7. Spectators scan the QR.
8. Keep the organizer browser tab open during the tournament.

GitHub Pages and Cloudflare Pages also work.

LIVE MODE NOTE
This version intentionally avoids a paid database. The organizer's browser acts as the live source. If the organizer tab closes or loses internet, spectators keep the last received scores and reconnect when the organizer is available again.
