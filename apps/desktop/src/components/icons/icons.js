// The line icon set and the logo. Matching SVG files live in assets/icons.
const LOGO='<svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#2d6a43"/><path d="M24 38V16M24 16c-5 2-7 6-7 10 5 0 7-4 7-10zM24 16c5 2 7 6 7 10-5 0-7-4-7-10zM24 10c-2 2-2 4 0 6 2-2 2-4 0-6z" fill="none" stroke="#f3d98b" stroke-width="2" stroke-linecap="round"/></svg>';
const sv=(p,x='')=>`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const IC={plus:sv('<path d="M12 5v14M5 12h14"/>'),trash:sv('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),edit:sv('<path d="M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4"/>'),chev:sv('<path d="M6 9l6 6 6-6"/>'),bell:sv('<path d="M6 17v-6a6 6 0 1112 0v6l2 2H4l2-2zM10 21h4"/>'),
egg:sv('<path d="M12 3c4 0 7 6 7 11a7 7 0 01-14 0c0-5 3-11 7-11z"/>'),paw:sv('<circle cx="7" cy="10" r="1.6"/><circle cx="12" cy="7" r="1.6"/><circle cx="17" cy="10" r="1.6"/><path d="M8 17c0-3 2-4 4-4s4 1 4 4c0 2-2 2-4 2s-4 0-4-2z"/>'),fish:sv('<path d="M3 12c4-6 11-6 15 0-4 6-11 6-15 0zM18 12l3-3v6l-3-3z"/>'),wheat:sv('<path d="M12 21V8M12 8c-3-1-4-3-4-5 3 1 4 3 4 5zM12 8c3-1 4-3 4-5-3 1-4 3-4 5zM12 14c-3-1-4-3-4-5M12 14c3-1 4-3 4-5"/>'),leaf:sv('<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8"/>'),drop:sv('<path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z"/>')};
IC.tick=sv('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>');
IC.check=sv('<path d="M5 12.5l4.5 4.5L19 7"/>');
IC.refresh=sv('<path d="M20 11a8 8 0 10-2.3 6M20 4v7h-7"/>');
IC.home=sv('<path d="M4 11l8-7 8 7v9H4zM10 20v-6h4v6"/>');
IC.box=sv('<path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"/>');
IC.flask=sv('<path d="M9 3h6M10 3v6l-5 10a1 1 0 001 1h12a1 1 0 001-1l-5-10V3M8 14h8"/>');
IC.pulse=sv('<path d="M3 12h4l3-7 4 14 3-7h4"/>');
IC.bars=sv('<path d="M5 20V10M12 20V4M19 20v-7"/>');
IC.gear=sv('<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>');
const NI={dashboard:IC.home,animals:IC.paw,inventory:IC.box,formulations:IC.flask,productivity:IC.pulse,reports:IC.bars};
IC.info=sv('<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/>');
IC.print=sv('<path d="M7 9V4h10v5M7 17H5v-6h14v6h-2M7 14h10v6H7z"/>');
IC.download=sv('<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>');
