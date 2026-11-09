/* @ds-bundle: {"format":4,"namespace":"Spatium","components":[{"name":"Button"},{"name":"ToolButton"},{"name":"Toolbar"},{"name":"NumberField"},{"name":"TextField"},{"name":"Select"},{"name":"SegmentedControl"},{"name":"MeasureMode"},{"name":"Switch"},{"name":"SaveStatus"},{"name":"InspectorSection"},{"name":"FloorTabs"},{"name":"Dialog"},{"name":"Diagnostic"},{"name":"Tooltip"},{"name":"CatalogItem"},{"name":"ZoomControl"},{"name":"CategoryRail"},{"name":"ContextMenu"},{"name":"InlineEditor"},{"name":"Picker"},{"name":"ScrollArea"},{"name":"InputGroup"},{"name":"StageNav"},{"name":"FileDrop"},{"name":"Toast"},{"name":"PlanGrid"},{"name":"PlanWall"},{"name":"PlanOpening"},{"name":"PlanDimension"},{"name":"PlanRoom"},{"name":"PlanFurniture"},{"name":"PlanSelection"},{"name":"PlanSnap"},{"name":"PlanCalibration"}]} */
/* Spatium design system: framework-neutral DOM factories + Canvas 2D plan renderers.
   Every factory returns a plain HTMLElement; every Plan* function draws into a CanvasRenderingContext2D
   in SCREEN pixels (apply your view transform to geometry first; strokes and hatches do not scale). */
(function () {
  'use strict';
  var ICONS = {"mouse-pointer-2":"<path d=\"M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z\"/>","hand":"<path d=\"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2\"/> <path d=\"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2\"/> <path d=\"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8\"/> <path d=\"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15\"/>","undo-2":"<path d=\"M9 14 4 9l5-5\"/> <path d=\"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11\"/>","redo-2":"<path d=\"m15 14 5-5-5-5\"/> <path d=\"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13\"/>","trash-2":"<path d=\"M3 6h18\"/> <path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\"/> <path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"/> <line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\"/> <line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\"/>","copy":"<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"/> <path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"/>","chevron-down":"<path d=\"m6 9 6 6 6-6\"/>","chevron-right":"<path d=\"m9 18 6-6-6-6\"/>","chevron-left":"<path d=\"m15 18-6-6 6-6\"/>","plus":"<path d=\"M5 12h14\"/> <path d=\"M12 5v14\"/>","minus":"<path d=\"M5 12h14\"/>","search":"<circle cx=\"11\" cy=\"11\" r=\"8\"/> <path d=\"m21 21-4.3-4.3\"/>","x":"<path d=\"M18 6 6 18\"/> <path d=\"m6 6 12 12\"/>","check":"<path d=\"M20 6 9 17l-5-5\"/>","cloud":"<path d=\"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z\"/>","cloud-off":"<path d=\"m2 2 20 20\"/> <path d=\"M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193\"/> <path d=\"M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07\"/>","loader-circle":"<path d=\"M21 12a9 9 0 1 1-6.219-8.56\"/>","triangle-alert":"<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/> <path d=\"M12 9v4\"/> <path d=\"M12 17h.01\"/>","circle-alert":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\"/> <line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\"/>","git-compare-arrows":"<circle cx=\"5\" cy=\"6\" r=\"3\"/> <path d=\"M12 6h5a2 2 0 0 1 2 2v7\"/> <path d=\"m15 9-3-3 3-3\"/> <circle cx=\"19\" cy=\"18\" r=\"3\"/> <path d=\"M12 18H7a2 2 0 0 1-2-2V9\"/> <path d=\"m9 15 3 3-3 3\"/>","lock":"<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/> <path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>","lock-open":"<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/> <path d=\"M7 11V7a5 5 0 0 1 9.9-1\"/>","eye":"<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"/> <circle cx=\"12\" cy=\"12\" r=\"3\"/>","eye-off":"<path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49\"/> <path d=\"M14.084 14.158a3 3 0 0 1-4.242-4.242\"/> <path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143\"/> <path d=\"m2 2 20 20\"/>","image":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\"/> <circle cx=\"9\" cy=\"9\" r=\"2\"/> <path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\"/>","layers":"<path d=\"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z\"/> <path d=\"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65\"/> <path d=\"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65\"/>","sofa":"<path d=\"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3\"/> <path d=\"M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\"/> <path d=\"M4 18v2\"/> <path d=\"M20 18v2\"/> <path d=\"M12 4v9\"/>","maximize":"<path d=\"M8 3H5a2 2 0 0 0-2 2v3\"/> <path d=\"M21 8V5a2 2 0 0 0-2-2h-3\"/> <path d=\"M3 16v3a2 2 0 0 0 2 2h3\"/> <path d=\"M16 21h3a2 2 0 0 0 2-2v-3\"/>","scan":"<path d=\"M3 7V5a2 2 0 0 1 2-2h2\"/> <path d=\"M17 3h2a2 2 0 0 1 2 2v2\"/> <path d=\"M21 17v2a2 2 0 0 1-2 2h-2\"/> <path d=\"M7 21H5a2 2 0 0 1-2-2v-2\"/>","grid-3x3":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/> <path d=\"M3 9h18\"/> <path d=\"M3 15h18\"/> <path d=\"M9 3v18\"/> <path d=\"M15 3v18\"/>","magnet":"<path d=\"m6 15-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15\"/> <path d=\"m5 8 4 4\"/> <path d=\"m12 15 4 4\"/>","ruler":"<path d=\"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z\"/> <path d=\"m14.5 12.5 2-2\"/> <path d=\"m11.5 9.5 2-2\"/> <path d=\"m8.5 6.5 2-2\"/> <path d=\"m17.5 15.5 2-2\"/>","settings-2":"<path d=\"M20 7h-9\"/> <path d=\"M14 17H5\"/> <circle cx=\"17\" cy=\"17\" r=\"3\"/> <circle cx=\"7\" cy=\"7\" r=\"3\"/>","ellipsis":"<circle cx=\"12\" cy=\"12\" r=\"1\"/> <circle cx=\"19\" cy=\"12\" r=\"1\"/> <circle cx=\"5\" cy=\"12\" r=\"1\"/>","log-in":"<path d=\"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4\"/> <polyline points=\"10 17 15 12 10 7\"/> <line x1=\"15\" x2=\"3\" y1=\"12\" y2=\"12\"/>","history":"<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/> <path d=\"M3 3v5h5\"/> <path d=\"M12 7v5l4 2\"/>","rotate-cw":"<path d=\"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8\"/> <path d=\"M21 3v5h-5\"/>","crosshair":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <line x1=\"22\" x2=\"18\" y1=\"12\" y2=\"12\"/> <line x1=\"6\" x2=\"2\" y1=\"12\" y2=\"12\"/> <line x1=\"12\" x2=\"12\" y1=\"6\" y2=\"2\"/> <line x1=\"12\" x2=\"12\" y1=\"22\" y2=\"18\"/>","info":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"M12 16v-4\"/> <path d=\"M12 8h.01\"/>","circle-help":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"/> <path d=\"M12 17h.01\"/>","type":"<polyline points=\"4 7 4 4 20 4 20 7\"/> <line x1=\"9\" x2=\"15\" y1=\"20\" y2=\"20\"/> <line x1=\"12\" x2=\"12\" y1=\"4\" y2=\"20\"/>","clipboard-paste":"<path d=\"M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z\"/> <path d=\"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10\"/> <path d=\"m17 10 4 4-4 4\"/>","refresh-cw":"<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"/> <path d=\"M21 3v5h-5\"/> <path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"/> <path d=\"M8 16H3v5\"/>","flip-horizontal-2":"<path d=\"m3 7 5 5-5 5V7\"/> <path d=\"m21 7-5 5 5 5V7\"/> <path d=\"M12 20v2\"/> <path d=\"M12 14v2\"/> <path d=\"M12 8v2\"/> <path d=\"M12 2v2\"/>","bed-double":"<path d=\"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8\"/> <path d=\"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4\"/> <path d=\"M12 4v6\"/> <path d=\"M2 18h20\"/>","bath":"<path d=\"M10 4 8 6\"/> <path d=\"M17 19v2\"/> <path d=\"M2 12h20\"/> <path d=\"M7 19v2\"/> <path d=\"M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5\"/>","cooking-pot":"<path d=\"M2 12h20\"/> <path d=\"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\"/> <path d=\"m4 8 16-4\"/> <path d=\"m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8\"/>","armchair":"<path d=\"M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3\"/> <path d=\"M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\"/> <path d=\"M5 18v2\"/> <path d=\"M19 18v2\"/>","list-tree":"<path d=\"M21 12h-8\"/> <path d=\"M21 6H8\"/> <path d=\"M21 18h-8\"/> <path d=\"M3 6v4c0 1.1.9 2 2 2h3\"/> <path d=\"M3 10v6c0 1.1.9 2 2 2h3\"/>","download":"<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/> <polyline points=\"7 10 12 15 17 10\"/> <line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\"/>","share-2":"<circle cx=\"18\" cy=\"5\" r=\"3\"/> <circle cx=\"6\" cy=\"12\" r=\"3\"/> <circle cx=\"18\" cy=\"19\" r=\"3\"/> <line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\"/> <line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\"/>","layout-grid":"<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"/> <rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"/> <rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\"/> <rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"/>","archive":"<rect width=\"20\" height=\"5\" x=\"2\" y=\"3\" rx=\"1\"/> <path d=\"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8\"/> <path d=\"M10 12h4\"/>","washing-machine":"<path d=\"M3 6h3\"/> <path d=\"M17 6h.01\"/> <rect width=\"18\" height=\"20\" x=\"3\" y=\"2\" rx=\"2\"/> <circle cx=\"12\" cy=\"13\" r=\"5\"/> <path d=\"M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5\"/>","scissors":"<circle cx=\"6\" cy=\"6\" r=\"3\"/> <path d=\"M8.12 8.12 12 12\"/> <path d=\"M20 4 8.12 15.88\"/> <circle cx=\"6\" cy=\"18\" r=\"3\"/> <path d=\"M14.8 14.8 20 20\"/>","pencil":"<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"/> <path d=\"m15 5 4 4\"/>","arrow-up":"<path d=\"m5 12 7-7 7 7\"/> <path d=\"M12 19V5\"/>","arrow-down":"<path d=\"M12 5v14\"/> <path d=\"m19 12-7 7-7-7\"/>","utensils-crossed":"<path d=\"m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8\"/> <path d=\"M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7\"/> <path d=\"m2.1 21.8 6.4-6.3\"/> <path d=\"m19 5-7 7\"/>","scan-line":"<path d=\"M3 7V5a2 2 0 0 1 2-2h2\"/> <path d=\"M17 3h2a2 2 0 0 1 2 2v2\"/> <path d=\"M21 17v2a2 2 0 0 1-2 2h-2\"/> <path d=\"M7 21H5a2 2 0 0 1-2-2v-2\"/> <path d=\"M7 12h10\"/>","hammer":"<path d=\"m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9\"/> <path d=\"m18 15 4-4\"/> <path d=\"m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5\"/>","brick-wall":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/> <path d=\"M12 9v6\"/> <path d=\"M16 15v6\"/> <path d=\"M16 3v6\"/> <path d=\"M3 15h18\"/> <path d=\"M3 9h18\"/> <path d=\"M8 15v6\"/> <path d=\"M8 3v6\"/>","zap":"<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\"/>","droplets":"<path d=\"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z\"/> <path d=\"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97\"/>","heater":"<path d=\"M11 8c2-3-2-3 0-6\"/> <path d=\"M15.5 8c2-3-2-3 0-6\"/> <path d=\"M6 10h.01\"/> <path d=\"M6 14h.01\"/> <path d=\"M10 16v-4\"/> <path d=\"M14 16v-4\"/> <path d=\"M18 16v-4\"/> <path d=\"M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3\"/> <path d=\"M5 20v2\"/> <path d=\"M19 20v2\"/>","fan":"<path d=\"M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z\"/> <path d=\"M12 12v.01\"/>","grid-2x2":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/> <path d=\"M3 12h18\"/> <path d=\"M12 3v18\"/>","paint-roller":"<rect width=\"16\" height=\"6\" x=\"2\" y=\"2\" rx=\"2\"/> <path d=\"M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2\"/> <rect width=\"4\" height=\"6\" x=\"8\" y=\"16\" rx=\"1\"/>","lamp-ceiling":"<path d=\"M12 2v5\"/> <path d=\"M6 7h12l4 9H2l4-9Z\"/> <path d=\"M9.17 16a3 3 0 1 0 5.66 0\"/>","door-open":"<path d=\"M13 4h3a2 2 0 0 1 2 2v14\"/> <path d=\"M2 20h3\"/> <path d=\"M13 20h9\"/> <path d=\"M10 12v.01\"/> <path d=\"M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z\"/>","image-up":"<path d=\"M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21\"/> <path d=\"m14 19.5 3-3 3 3\"/> <path d=\"M17 22v-5.5\"/> <circle cx=\"9\" cy=\"9\" r=\"2\"/>","file-up":"<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/> <path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/> <path d=\"M12 12v6\"/> <path d=\"m15 15-3-3-3 3\"/>","file":"<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/> <path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/>","file-x":"<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/> <path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/> <path d=\"m14.5 12.5-5 5\"/> <path d=\"m9.5 12.5 5 5\"/>","circle-check":"<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"m9 12 2 2 4-4\"/>","tool-calibrate":"<circle cx=\"5\" cy=\"18\" r=\"2\"/><circle cx=\"19\" cy=\"6\" r=\"2\"/><path d=\"M6.5 16.7 17.5 7.3\"/><path d=\"M9 17.5l1.5 1.5M12.5 14.5l1.5 1.5M16 11.5l1.5 1.5\"/>","tool-door":"<path d=\"M2 20h5M19 20h3\"/><path d=\"M7 20V8\"/><path d=\"M7 8a12 12 0 0 1 12 12\" stroke-dasharray=\"2 2\"/>","tool-flip-swing":"<path d=\"M4 20h16\"/><path d=\"M12 20V9\"/><path d=\"M12 9a11 11 0 0 0-8 11M12 9a11 11 0 0 1 8 11\" stroke-dasharray=\"2 2\"/>","tool-join":"<path d=\"M2 9h7v6H2M22 9h-7v6h7\"/><path d=\"M9 12h6M11 10l-2 2 2 2M13 10l2 2-2 2\"/>","tool-measure-centerline":"<path d=\"M5 2v20M19 2v20\" stroke-dasharray=\"5 2.5 1 2.5\"/><path d=\"M5 12h14M8 9l-3 3 3 3M16 9l3 3-3 3\"/>","tool-measure-interior":"<path d=\"M2.5 3.5h3.5v17H2.5zM18 3.5h3.5v17H18z\" fill=\"currentColor\" fill-opacity=\".25\"/><path d=\"M6 12h12M9 9l-3 3 3 3M15 9l3 3-3 3\"/>","tool-room":"<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"1\"/><rect x=\"6.5\" y=\"6.5\" width=\"11\" height=\"11\"/>","tool-split":"<path d=\"M2 9h8v6H2M22 9h-8v6h8\"/><path d=\"M12 4v16\" stroke-dasharray=\"2 2\"/>","tool-trace":"<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"1\" stroke-dasharray=\"2 2\"/><path d=\"M7 16V8h10v4\"/><circle cx=\"17\" cy=\"12\" r=\"1.5\" fill=\"currentColor\"/>","tool-wall":"<path d=\"M3 21V3h18v4H7v14H3z\"/><path d=\"M3 9l4-4M3 14l4-4M3 19l4-4M10 7l4-4M15 7l4-4\"/>","tool-window":"<path d=\"M2 8h5v8H2M22 8h-5v8h5\"/><path d=\"M7 8h10M7 16h10M7 12h10\"/>","dot":"<circle cx=\"12\" cy=\"12\" r=\"2.5\" fill=\"currentColor\" stroke=\"none\"/>"};
  var DEF = {"surface-canvas":"#f7f7f5","surface-panel":"#ffffff","surface-sunken":"#f1f1ef","surface-pressed":"#e6e6e3","surface-inverse":"#1f1f1d","line-subtle":"#ececea","line":"#dcdcd8","line-control":"#8a8a85","ink":"#1c1c1a","ink-secondary":"#51514d","ink-muted":"#63635e","ink-disabled":"#a9a9a4","ink-inverse":"#f7f7f5","accent":"#1f5ad6","accent-hover":"#1849b4","accent-soft":"#e8eefc","accent-ink":"#1747ad","on-accent":"#ffffff","focus-ring":"#1f5ad6","accent-on-inverse":"#9ab8f7","success":"#1b7748","success-soft":"#e5f3eb","warning":"#8f5400","warning-mark":"#c27a08","warning-soft":"#fcf1dc","danger":"#c21f37","danger-hover":"#a11a2e","danger-soft":"#fbe8eb","on-danger":"#ffffff","scroll-thumb":"rgba(28, 28, 26, 0.24)","scroll-thumb-active":"rgba(28, 28, 26, 0.42)","snap":"#c4168a","plan-paper":"#f7f7f5","plan-grid-minor":"#ebebe7","plan-grid-major":"#dcdbd5","plan-grid-metre":"#c8c7c0","plan-room":"rgba(255, 255, 255, 0.78)","plan-ink":"#232321","plan-ink-secondary":"#55554f","plan-ink-tertiary":"#7d7d77","plan-furniture":"#ffffff","plan-opening":"#f7f7f5","wall-concrete":"#7a7a74","wall-concrete-hatch":"#2e2e2b","wall-brick":"#b5b3ac","wall-brick-hatch":"#4a4945","wall-block":"#d9d7d0","wall-block-hatch":"#77766f","wall-drywall":"#ffffff","wall-drywall-hatch":"#8c8b85","wall-timber":"#e8e1d1","wall-timber-hatch":"#86795e","wall-generic":"#c3c2bc","plan-select":"#1f5ad6","plan-select-fill":"rgba(31, 90, 214, 0.14)","plan-hover":"#1f5ad6","plan-preview":"#1f5ad6","plan-affected":"#5b86e0","plan-fixed":"#232321","plan-invalid":"#c21f37","plan-invalid-fill":"rgba(194, 31, 55, 0.16)","plan-warning":"#c27a08","plan-snap":"#c4168a","plan-handle":"#ffffff","plan-face":"#1f5ad6","line-wall":1.25,"line-leaf":2,"line-arc":1,"line-furniture":1,"line-dimension":1,"line-extension":0.75,"line-grid":1,"line-select":1.5,"line-preview":2,"hatch-pitch-dense":4,"hatch-pitch":6,"hatch-pitch-wide":9,"hatch-line":1,"handle-size":8,"snap-marker":10,"snap-distance":10,"dim-offset":20,"dim-tick":7,"label-halo":3,"underlay-opacity":0.45,"disabled-opacity":0.4};
  var S = {};

  /* ---------------------------------------------------------------- DOM helpers */
  function h(tag, props, kids) {
    var el = document.createElement(tag);
    if (props) {
      for (var k in props) {
        var v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'style') el.style.cssText = v;
        else if (k === 'text') el.textContent = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
        else el.setAttribute(k, v === true ? '' : String(v));
      }
    }
    add(el, kids);
    return el;
  }
  function add(el, kids) {
    if (kids == null) return;
    if (!Array.isArray(kids)) kids = [kids];
    kids.forEach(function (k) {
      if (k == null || k === false) return;
      el.appendChild(typeof k === 'string' || typeof k === 'number' ? document.createTextNode(String(k)) : k);
    });
  }
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  function icon(name, size) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    size = size || 16;
    svg.setAttribute('width', size); svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('class', 'sp-icon');
    svg.innerHTML = ICONS[name] || '';
    return svg;
  }
  S.icon = icon;
  S.iconNames = Object.keys(ICONS);
  S.h = h;

  /* ---------------------------------------------------------------- i18n */
  var STR = {
    en: {
      saved: 'Saved', unsaved: 'Unsaved changes', saving: 'Saving…', failed: 'Save failed', conflict: 'Conflict',
      signedOut: 'Signed out', recovered: 'Recovered draft',
      savedDetail: 'All changes are saved to the cloud.', unsavedDetail: 'Your latest changes will save in a moment.',
      savingDetail: 'Sending your changes to the server.', failedDetail: 'Your work is kept in this browser. Retrying automatically.',
      conflictDetail: 'This layout was changed somewhere else. Your draft is kept and nothing was overwritten.',
      signedOutDetail: 'Sign in again to keep saving. Your draft is kept in this browser.',
      recoveredDetail: 'Restored from this browser after an interrupted session.',
      retry: 'Retry', resolve: 'Resolve', signIn: 'Sign in', review: 'Review',
      modeInterior: 'Interior faces', modeCenterline: 'Wall centerlines', modeLabel: 'Measure',
      clearWidth: 'Clear width', clearDepth: 'Clear depth', centerlineLength: 'Centerline length',
      thickness: 'Thickness', clearDistance: 'Clear distance', openingWidth: 'Opening width', offsetAlong: 'Distance from start',
      parseError: 'Enter a length, e.g. 380 or 3.8 m', mixed: 'Mixed',
      floorN: 'Floor {n}', addFloor: 'Add floor', maxFloors: 'A layout can have up to {n} floors',
      zoomIn: 'Zoom in', zoomOut: 'Zoom out', fit: 'Fit floor',
      numberError: 'Enter a number', rangeError: 'Use a value from {min} to {max}',
      pickSearch: 'Search', pickRecent: 'Recent', pickAll: 'All', pickNone: 'Nothing matches “{q}”', pickNoneHint: 'Try another word or a different filter.', pickClear: 'Clear search', pickLoading: 'Loading…', pickMore: 'Showing {n} of {total}. Type to narrow it down.', pickCount: '{n} of {total}', pickPlaceholder: 'Choose…',
      stages: 'Stages', stageNotStarted: 'Not started', stageInProgress: 'In progress', stageDone: 'Done', stageNotNeeded: 'Not needed', stageLater: 'Coming later', stagePrev: 'Previous stage', stageNext: 'Next stage', stageOf: 'Stage {n} of {total}', issues_one: '{n} issue', issues_other: '{n} issues', stagesDone: '{n} of {total} done',
      errors_one: '{n} error', errors_other: '{n} errors',
      dropTitle: 'Drop a file here', dropTitleImage: 'Drop a plan image here', dropBrowse: 'or choose a file', dropPaste: 'You can also paste an image', dropOver: 'Release to upload', dropBadType: 'This file type isn’t supported', dropTypes: '{types}, up to {max}', errType: '“{name}” isn’t a supported file. Use {types}.', errSize: '“{name}” is {size}; the limit is {max}.', errMany: 'Choose one file at a time.', errUpload: 'Upload failed. Your file wasn’t changed.', dropUploading: 'Uploading… {p}%', dropProcessing: 'Uploading…', dropReplace: 'Replace…', dropRemove: 'Remove', dropRetry: 'Try again', dropCancel: 'Cancel upload', unit_kb: 'KB', unit_mb: 'MB', undo: 'Undo',
      applyHint: 'Enter to apply · Esc to cancel', moreInInspector: 'More in inspector',
      unit_mm: 'mm', unit_cm: 'cm', unit_m: 'm', unit_m2: 'm²'
    },
    ru: {
      saved: 'Сохранено', unsaved: 'Не сохранено', saving: 'Сохранение…', failed: 'Ошибка сохранения', conflict: 'Конфликт версий',
      signedOut: 'Вы вышли', recovered: 'Черновик восстановлен',
      savedDetail: 'Все изменения сохранены в облаке.', unsavedDetail: 'Последние изменения сохранятся через пару секунд.',
      savingDetail: 'Отправляем изменения на сервер.', failedDetail: 'Работа сохранена в этом браузере. Повторяем попытку автоматически.',
      conflictDetail: 'Эту планировку изменили в другом месте. Ваш черновик сохранён, ничего не перезаписано.',
      signedOutDetail: 'Войдите снова, чтобы продолжить сохранение. Черновик сохранён в этом браузере.',
      recoveredDetail: 'Восстановлено из браузера после прерванной сессии.',
      retry: 'Повторить', resolve: 'Решить', signIn: 'Войти', review: 'Посмотреть',
      modeInterior: 'По внутренним граням', modeCenterline: 'По осям стен', modeLabel: 'Размеры',
      clearWidth: 'Ширина в чистоте', clearDepth: 'Глубина в чистоте', centerlineLength: 'Длина по оси',
      thickness: 'Толщина', clearDistance: 'Расстояние в чистоте', openingWidth: 'Ширина проёма', offsetAlong: 'Отступ от начала',
      parseError: 'Введите длину, например 380 или 3,8 м', mixed: 'Разные',
      floorN: 'Этаж {n}', addFloor: 'Добавить этаж', maxFloors: 'В планировке может быть до {n} этажей',
      zoomIn: 'Приблизить', zoomOut: 'Отдалить', fit: 'Показать этаж целиком',
      numberError: 'Введите число', rangeError: 'Допустимо от {min} до {max}',
      pickSearch: 'Поиск', pickRecent: 'Недавние', pickAll: 'Все', pickNone: 'Ничего не нашлось по запросу «{q}»', pickNoneHint: 'Попробуйте другое слово или другой фильтр.', pickClear: 'Очистить поиск', pickLoading: 'Загрузка…', pickMore: 'Показано {n} из {total}. Уточните запрос.', pickCount: '{n} из {total}', pickPlaceholder: 'Выберите…',
      stages: 'Этапы', stageNotStarted: 'Не начат', stageInProgress: 'В работе', stageDone: 'Готово', stageNotNeeded: 'Не нужен', stageLater: 'Скоро появится', stagePrev: 'Предыдущий этап', stageNext: 'Следующий этап', stageOf: 'Этап {n} из {total}', issues_one: '{n} проблема', issues_few: '{n} проблемы', issues_many: '{n} проблем', issues_other: '{n} проблемы', stagesDone: 'Готово {n} из {total}',
      errors_one: '{n} ошибка', errors_few: '{n} ошибки', errors_many: '{n} ошибок', errors_other: '{n} ошибки',
      dropTitle: 'Перетащите файл сюда', dropTitleImage: 'Перетащите изображение плана сюда', dropBrowse: 'или выберите файл', dropPaste: 'Можно и вставить изображение', dropOver: 'Отпустите, чтобы загрузить', dropBadType: 'Такой тип файла не поддерживается', dropTypes: '{types}, до {max}', errType: '«{name}» — неподдерживаемый файл. Используйте {types}.', errSize: '«{name}» весит {size}; предел — {max}.', errMany: 'Выберите один файл.', errUpload: 'Не удалось загрузить. Файл не изменён.', dropUploading: 'Загрузка… {p}%', dropProcessing: 'Загрузка…', dropReplace: 'Заменить…', dropRemove: 'Удалить', dropRetry: 'Повторить', dropCancel: 'Отменить загрузку', unit_kb: 'КБ', unit_mb: 'МБ', undo: 'Отменить',
      applyHint: 'Enter — применить · Esc — отменить', moreInInspector: 'Ещё в инспекторе',
      unit_mm: 'мм', unit_cm: 'см', unit_m: 'м', unit_m2: 'м²'
    },
    uk: {
      saved: 'Збережено', unsaved: 'Не збережено', saving: 'Збереження…', failed: 'Помилка збереження', conflict: 'Конфлікт версій',
      signedOut: 'Ви вийшли', recovered: 'Чернетку відновлено',
      savedDetail: 'Усі зміни збережено в хмарі.', unsavedDetail: 'Останні зміни збережуться за кілька секунд.',
      savingDetail: 'Надсилаємо зміни на сервер.', failedDetail: 'Роботу збережено в цьому браузері. Повторюємо спробу автоматично.',
      conflictDetail: 'Це планування змінили в іншому місці. Вашу чернетку збережено, нічого не перезаписано.',
      signedOutDetail: 'Увійдіть знову, щоб продовжити збереження. Чернетку збережено в цьому браузері.',
      recoveredDetail: 'Відновлено з браузера після перерваної сесії.',
      retry: 'Повторити', resolve: 'Вирішити', signIn: 'Увійти', review: 'Переглянути',
      modeInterior: 'По внутрішніх гранях', modeCenterline: 'По осях стін', modeLabel: 'Розміри',
      clearWidth: 'Ширина в чистоті', clearDepth: 'Глибина в чистоті', centerlineLength: 'Довжина по осі',
      thickness: 'Товщина', clearDistance: 'Відстань у чистоті', openingWidth: 'Ширина прорізу', offsetAlong: 'Відступ від початку',
      parseError: 'Введіть довжину, наприклад 380 або 3,8 м', mixed: 'Різні',
      floorN: 'Поверх {n}', addFloor: 'Додати поверх', maxFloors: 'У плануванні може бути до {n} поверхів',
      zoomIn: 'Наблизити', zoomOut: 'Віддалити', fit: 'Показати поверх повністю',
      numberError: 'Введіть число', rangeError: 'Допустимо від {min} до {max}',
      pickSearch: 'Пошук', pickRecent: 'Нещодавні', pickAll: 'Усі', pickNone: 'Нічого не знайдено за запитом «{q}»', pickNoneHint: 'Спробуйте інше слово або інший фільтр.', pickClear: 'Очистити пошук', pickLoading: 'Завантаження…', pickMore: 'Показано {n} з {total}. Уточніть запит.', pickCount: '{n} з {total}', pickPlaceholder: 'Виберіть…',
      stages: 'Етапи', stageNotStarted: 'Не розпочато', stageInProgress: 'У роботі', stageDone: 'Готово', stageNotNeeded: 'Не потрібен', stageLater: 'Незабаром', stagePrev: 'Попередній етап', stageNext: 'Наступний етап', stageOf: 'Етап {n} з {total}', issues_one: '{n} проблема', issues_few: '{n} проблеми', issues_many: '{n} проблем', issues_other: '{n} проблеми', stagesDone: 'Готово {n} з {total}',
      errors_one: '{n} помилка', errors_few: '{n} помилки', errors_many: '{n} помилок', errors_other: '{n} помилки',
      dropTitle: 'Перетягніть файл сюди', dropTitleImage: 'Перетягніть зображення плану сюди', dropBrowse: 'або виберіть файл', dropPaste: 'Можна також вставити зображення', dropOver: 'Відпустіть, щоб завантажити', dropBadType: 'Такий тип файлу не підтримується', dropTypes: '{types}, до {max}', errType: '«{name}» — непідтримуваний файл. Використовуйте {types}.', errSize: '«{name}» важить {size}; межа — {max}.', errMany: 'Виберіть один файл.', errUpload: 'Не вдалося завантажити. Файл не змінено.', dropUploading: 'Завантаження… {p}%', dropProcessing: 'Завантаження…', dropReplace: 'Замінити…', dropRemove: 'Видалити', dropRetry: 'Повторити', dropCancel: 'Скасувати завантаження', unit_kb: 'КБ', unit_mb: 'МБ', undo: 'Скасувати',
      applyHint: 'Enter — застосувати · Esc — скасувати', moreInInspector: 'Більше в інспекторі',
      unit_mm: 'мм', unit_cm: 'см', unit_m: 'м', unit_m2: 'м²'
    }
  };
  function lang(locale) { var l = String(locale || 'en').slice(0, 2).toLowerCase(); return STR[l] ? l : 'en'; }
  function t(key, locale, vars) {
    var s = STR[lang(locale)][key]; if (s == null) s = STR.en[key]; if (s == null) return key;
    if (vars) for (var k in vars) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  }
  S.t = t;
  /** Plural-aware string: key_one / key_few / key_many / key_other, chosen by Intl.PluralRules. */
  function tp(key, n, locale) {
    var cat = 'other'; try { cat = new Intl.PluralRules(lang(locale)).select(n); } catch (e) { /* old engines */ }
    var k = key + '_' + cat; if (STR[lang(locale)][k] == null) k = key + '_other';
    return t(k, locale, { n: n });
  }
  S.tp = tp;
  S.strings = STR;

  /* ---------------------------------------------------------------- units (stored in mm, never rounded) */
  var MM = { mm: 1, cm: 10, m: 1000 };
  var ALIAS = { mm: 'mm', 'мм': 'mm', cm: 'cm', 'см': 'cm', m: 'm', 'м': 'm' };
  var DECIMALS = { mm: 0, cm: 1, m: 3 };
  function nf(locale, min, max) {
    return new Intl.NumberFormat(locale || 'en', { minimumFractionDigits: min, maximumFractionDigits: max });
  }
  var units = {
    /** Format a length (mm) for display. Never write the result back into the model. */
    format: function (mm, o) {
      o = o || {}; var u = o.unit || 'cm';
      var max = o.decimals != null ? o.decimals : DECIMALS[u];
      var s = nf(o.locale, 0, max).format(mm / MM[u]);
      return o.suffix ? s + ' ' + t('unit_' + u, o.locale) : s;
    },
    /** Format an area given in mm² as m² with two decimals. */
    formatArea: function (mm2, o) {
      o = o || {};
      return nf(o.locale, 2, 2).format(mm2 / 1e6) + (o.suffix === false ? '' : ' ' + t('unit_m2', o.locale));
    },
    /** Parse "380", "3,8 м", "4200mm", "420-20", "(380+20)*2" into mm. Returns NaN if invalid. */
    parse: function (text, o) {
      o = o || {};
      var def = o.unit || 'cm';
      var commaDecimal = lang(o.locale) !== 'en';
      var s = String(text).trim().toLowerCase().replace(/[  ]/g, ' ');
      s = s.replace(/(\d) (?=\d{3}(\D|$))/g, '$1'); // thin/nbsp thousands
      if (commaDecimal) s = s.replace(/,/g, '.');
      else s = s.replace(/(\d),(?=\d{3}(\D|$))/g, '$1').replace(/,/g, '.');
      s = s.replace(/[×x]/g, '*').replace(/−/g, '-');
      var i = 0;
      function ws() { while (s[i] === ' ') i++; }
      function num() {
        ws(); var m = /^\d*\.?\d+/.exec(s.slice(i)); if (!m) throw 0; i += m[0].length; return parseFloat(m[0]);
      }
      function unit() {
        ws(); var m = /^(мм|см|mm|cm|м|m)/.exec(s.slice(i)); if (!m) return null; i += m[0].length; return ALIAS[m[0]];
      }
      function factor() {
        ws();
        if (s[i] === '-') { i++; return -factor(); }
        if (s[i] === '(') { i++; var v = expr(); ws(); if (s[i] !== ')') throw 0; i++; return v; }
        var n = num(); var u = unit(); return n * MM[u || def];
      }
      function scalar() { ws(); if (s[i] === '(') { i++; var v = scalarExpr(); ws(); if (s[i] !== ')') throw 0; i++; return v; } return num(); }
      function scalarTerm() { var v = scalar(); ws(); while (s[i] === '*' || s[i] === '/') { var op = s[i++]; var r = scalar(); v = op === '*' ? v * r : v / r; ws(); } return v; }
      function scalarExpr() { var v = scalarTerm(); ws(); while (s[i] === '+' || s[i] === '-') { var op = s[i++]; var r = scalarTerm(); v = op === '+' ? v + r : v - r; ws(); } return v; }
      function term() {
        var v = factor(); ws();
        while (s[i] === '*' || s[i] === '/') { var op = s[i++]; var r = scalar(); v = op === '*' ? v * r : v / r; ws(); }
        return v;
      }
      function expr() {
        var v = term(); ws();
        while (s[i] === '+' || s[i] === '-') { var op = s[i++]; var r = term(); v = op === '+' ? v + r : v - r; ws(); }
        return v;
      }
      try { if (!s) return NaN; var v = expr(); ws(); return i === s.length && isFinite(v) ? v : NaN; } catch (e) { return NaN; }
    },
    label: function (u, locale) { return t('unit_' + u, locale); },
    /** Parse a plain number with arithmetic and locale decimals (angles, percentages, counts). Units are rejected. */
    parseNumber: function (text, o) {
      if (/[a-zа-яё]/i.test(String(text))) return NaN;
      return units.parse(text, { unit: 'mm', locale: o && o.locale });
    }
  };
  S.units = units;

  /* ---------------------------------------------------------------- Button */
  S.Button = function (o) {
    o = o || {};
    var b = h('button', {
      type: 'button', class: cx('sp-btn', 'sp-btn--' + (o.variant || 'secondary'), o.size === 'sm' && 'sp-btn--sm', o.size === 'lg' && 'sp-btn--lg', o.iconOnly && 'sp-btn--icon'),
      title: o.title || (o.iconOnly ? o.label : null), 'aria-label': o.iconOnly ? o.label : null, disabled: o.disabled, onClick: o.onClick
    }, [o.icon ? icon(o.icon, 16) : null, o.iconOnly ? null : h('span', { text: o.label })]);
    return b;
  };

  /* ---------------------------------------------------------------- Kbd + Tooltip */
  var MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');
  function kbd(shortcut, joined) {
    if (!shortcut) return null;
    var keys = String(shortcut).split('+').map(function (k) {
      if (k === 'Mod') return MAC ? '⌘' : 'Ctrl';
      if (k === 'Shift') return MAC ? '⇧' : 'Shift';
      if (k === 'Alt') return MAC ? '⌥' : 'Alt';
      return k;
    });
    if (joined) return h('span', { class: 'sp-kbd' }, h('kbd', { text: keys.join(MAC ? '' : '+') }));
    return h('span', { class: 'sp-kbd' }, keys.map(function (k) { return h('kbd', { text: k }); }));
  }
  S.Kbd = function (o) { return kbd(typeof o === 'string' ? o : o.shortcut); };
  S.Tooltip = function (o) {
    return h('div', { class: cx('sp-tooltip', o.placement && 'sp-tooltip--' + o.placement), role: 'tooltip' }, [h('span', { text: o.label }), kbd(o.shortcut)]);
  };

  /* ---------------------------------------------------------------- ToolButton + Toolbar */
  S.ToolButton = function (o) {
    var b = h('button', {
      type: 'button', class: cx('sp-tool', o.active && 'is-active'), 'aria-pressed': o.active ? 'true' : 'false',
      'aria-label': o.label, 'data-tip': o.label + (o.shortcut ? ' · ' + o.shortcut : ''), disabled: o.disabled, onClick: o.onClick
    }, [icon(o.icon, 20), o.menu ? h('span', { class: 'sp-tool__menu' }, icon('chevron-down', 12)) : null]);
    return b;
  };
  S.Toolbar = function (o) {
    return h('div', { class: cx('sp-toolbar', o.vertical && 'sp-toolbar--vertical'), role: 'toolbar', 'aria-label': o.label || 'Tools' },
      (o.items || []).map(function (it) { return it === '|' ? h('span', { class: 'sp-toolbar__sep', 'aria-hidden': 'true' }) : S.ToolButton(it); }));
  };

  /* ---------------------------------------------------------------- Fields */
  var uid = 0;
  function field(o, control, extra) {
    var id = control.id || (control.id = 'sp-f' + (++uid));
    var labelKids = [o.reference ? icon(o.reference === 'centerline' ? 'tool-measure-centerline' : 'tool-measure-interior', 14) : null, h('span', { text: o.label })];
    return h('div', { class: cx('sp-field', o.error && 'is-error', o.disabled && 'is-disabled', o.inline && 'sp-field--inline') }, [
      o.label ? h('label', { class: 'sp-field__label', for: id }, labelKids) : null,
      h('div', { class: 'sp-field__control' }, [o.prefix ? h('span', { class: 'sp-field__prefix', text: o.prefix }) : null, control].concat(extra || [])),
      o.error ? h('div', { class: 'sp-field__msg', role: 'alert' }, [icon('circle-alert', 12), h('span', { text: o.error })])
        : o.hint ? h('div', { class: 'sp-field__hint', text: o.hint }) : null
    ]);
  }
  S.TextField = function (o) {
    o = o || {};
    var input = h('input', { class: 'sp-input', type: 'text', value: o.value || '', placeholder: o.placeholder, disabled: o.disabled, 'aria-invalid': o.error ? 'true' : null });
    if (o.onChange) input.addEventListener('change', function () { o.onChange(input.value); });
    return field(o, input);
  };

  var MEASURE_LABEL = { clearWidth: 1, clearDepth: 1, centerlineLength: 1, thickness: 1, clearDistance: 1, openingWidth: 1, offsetAlong: 1 };
  S.NumberField = function (o) {
    o = o || {};
    var unit = o.unit || 'cm', locale = o.locale || 'en', value = o.value, q = o.quantity || 'length';
    var QSUF = { angle: '°', percent: '%', count: '' };
    var label = o.label || (MEASURE_LABEL[o.measure] ? t(o.measure, locale) : '');
    var reference = o.reference || (o.measure === 'centerlineLength' ? 'centerline' : /^clear/.test(o.measure || '') ? 'interior' : null);
    var input = h('input', {
      class: 'sp-input sp-input--num', type: 'text', inputmode: 'decimal', autocomplete: 'off', spellcheck: 'false',
      placeholder: o.mixed ? t('mixed', locale) : null, disabled: o.disabled, 'aria-invalid': o.error ? 'true' : null
    });
    function fmt(v, dec) { return q === 'length' ? units.format(v, { unit: unit, locale: locale, decimals: dec }) : nf(locale, 0, dec != null ? dec : (o.decimals != null ? o.decimals : 1)).format(v); }
    function show() { input.value = o.mixed || value == null ? '' : fmt(value); }
    show();
    var root = field({ label: label, reference: reference, error: o.error, hint: o.hint, disabled: o.disabled, inline: o.inline, prefix: o.prefix }, input,
      [h('span', { class: 'sp-field__unit', text: q === 'length' ? units.label(unit, locale) : QSUF[q] })]);
    function setError(msg) {
      root.classList.toggle('is-error', !!msg); input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      var old = root.querySelector('.sp-field__msg'); if (old) old.remove();
      if (msg) root.appendChild(h('div', { class: 'sp-field__msg', role: 'alert' }, [icon('circle-alert', 12), h('span', { text: msg })]));
    }
    function commit() {
      if (root.closest && root.closest('.is-cancelling')) return true; // Esc in an InlineEditor: never commit
      if (input.value.trim() === '' && (o.mixed || value == null)) return true;
      var mm = q === 'length' ? units.parse(input.value, { unit: unit, locale: locale }) : units.parseNumber(input.value, { locale: locale });
      if (!isFinite(mm)) { setError(q === 'length' ? t('parseError', locale) : t('numberError', locale)); return false; }
      if ((o.min != null && mm < o.min) || (o.max != null && mm > o.max)) {
        if (q !== 'length' && o.clamp !== false) mm = Math.min(o.max != null ? o.max : mm, Math.max(o.min != null ? o.min : mm, mm));
        else { setError(o.minError || t('rangeError', locale, { min: o.min != null ? fmt(o.min) : '…', max: o.max != null ? fmt(o.max) : '…' })); return false; }
      }
      setError(null);
      if (mm === value && !o.mixed) { show(); return true; } // unchanged: no callback, no extra undo step
      var res = o.onCommit ? o.onCommit(mm) : true;
      if (typeof res === 'string') { setError(res); return false; }
      value = mm; o.mixed = false; show(); return true;
    }
    input.addEventListener('focus', function () { input.select(); root.classList.add('is-focused'); if (o.onFocus) o.onFocus(); });
    input.addEventListener('blur', function () { root.classList.remove('is-focused'); commit(); if (o.onBlur) o.onBlur(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { if (commit()) input.select(); e.preventDefault(); }
      else if (e.key === 'Escape') { setError(null); show(); input.blur(); e.preventDefault(); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        if (value == null) return;
        var base = q === 'length' ? MM[unit] * (unit === 'm' ? 0.01 : 1) : 1;
        var step = base * (e.shiftKey ? (q === 'angle' ? 15 : 10) : 1) * (e.key === 'ArrowUp' ? 1 : -1);
        input.value = fmt(value + step, 6); commit(); input.select(); e.preventDefault();
      }
      e.stopPropagation(); // never let canvas shortcuts see keys typed into a field
    });
    root.setValue = function (mm) { value = mm; o.mixed = false; show(); };
    root.getValue = function () { return value; };
    root.input = input;
    return root;
  };

  S.Select = function (o) {
    var sel = h('select', { class: 'sp-select__native', disabled: o.disabled, 'aria-label': o.label && !o.showLabel ? o.label : null },
      (o.options || []).map(function (op) { op = typeof op === 'string' ? { value: op, label: op } : op; return h('option', { value: op.value, selected: op.value === o.value, text: op.label }); }));
    if (o.onChange) sel.addEventListener('change', function () { o.onChange(sel.value); });
    var box = h('div', { class: cx('sp-select', o.variant === 'ghost' && 'sp-select--ghost'), style: o.width ? 'width:' + o.width + 'px' : null },
      [o.icon ? icon(o.icon, 16) : null, sel, h('span', { class: 'sp-select__chev' }, icon('chevron-down', 14))]);
    return o.showLabel ? field({ label: o.label, inline: o.inline }, box) : box;
  };

  S.SegmentedControl = function (o) {
    var root = h('div', { class: cx('sp-seg', o.size === 'sm' && 'sp-seg--sm', o.block && 'sp-seg--block'), role: 'radiogroup', 'aria-label': o.label });
    var value = o.value;
    function render() {
      root.textContent = '';
      (o.options || []).forEach(function (op) {
        var on = op.value === value;
        root.appendChild(h('button', {
          type: 'button', role: 'radio', 'aria-checked': on ? 'true' : 'false', class: cx('sp-seg__opt', on && 'is-on'), title: op.title,
          onClick: function () { if (value === op.value) return; value = op.value; render(); if (o.onChange) o.onChange(value); }
        }, [op.icon ? icon(op.icon, 16) : null, op.label ? h('span', { text: op.label }) : null]));
      });
    }
    render();
    return root;
  };

  S.MeasureMode = function (o) {
    o = o || {}; var loc = o.locale;
    return S.SegmentedControl({
      label: t('modeLabel', loc), value: o.value || 'interior', onChange: o.onChange, size: o.size, block: o.block,
      options: [
        { value: 'interior', icon: 'tool-measure-interior', label: o.compact ? null : t('modeInterior', loc), title: t('modeInterior', loc) },
        { value: 'centerline', icon: 'tool-measure-centerline', label: o.compact ? null : t('modeCenterline', loc), title: t('modeCenterline', loc) }
      ]
    });
  };

  S.Switch = function (o) {
    var btn = h('button', { type: 'button', role: 'switch', class: 'sp-switch', 'aria-checked': o.checked ? 'true' : 'false', disabled: o.disabled },
      h('span', { class: 'sp-switch__thumb' }));
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-checked') !== 'true'; btn.setAttribute('aria-checked', on ? 'true' : 'false'); if (o.onChange) o.onChange(on);
    });
    return h('label', { class: 'sp-switch-row' }, [o.icon ? icon(o.icon, 16) : null, h('span', { class: 'sp-switch-row__label', text: o.label }), kbd(o.shortcut), btn]);
  };

  /* ---------------------------------------------------------------- SaveStatus */
  var SAVE = {
    saved: { icon: 'check', tone: 'success' },
    unsaved: { icon: 'dot', tone: 'muted' },
    saving: { icon: 'loader-circle', tone: 'muted', spin: true },
    failed: { icon: 'cloud-off', tone: 'danger', action: 'retry' },
    conflict: { icon: 'git-compare-arrows', tone: 'danger', action: 'resolve' },
    signedOut: { icon: 'log-in', tone: 'warning', action: 'signIn' },
    recovered: { icon: 'history', tone: 'warning', action: 'review' }
  };
  S.SaveStatus = function (o) {
    var st = SAVE[o.state] || SAVE.saved, loc = o.locale;
    return h('div', { class: cx('sp-save', 'sp-save--' + st.tone), role: 'status', 'aria-live': 'polite', title: t(o.state + 'Detail', loc) }, [
      h('span', { class: cx('sp-save__icon', st.spin && 'is-spinning') }, st.icon === 'dot' ? h('span', { class: 'sp-save__dot' }) : icon(st.icon, 14)),
      h('span', { class: 'sp-save__label', text: t(o.state, loc) }),
      st.action && o.onAction !== false ? h('button', { type: 'button', class: 'sp-save__action', text: t(st.action, loc), onClick: o.onAction || null }) : null
    ]);
  };
  S.saveStates = Object.keys(SAVE);

  /* ---------------------------------------------------------------- InspectorSection */
  S.InspectorSection = function (o) {
    var open = o.open !== false;
    var body = h('div', { class: 'sp-section__body' }, o.children);
    var head = h('div', { class: 'sp-section__head' }, [
      o.collapsible ? h('button', { type: 'button', class: 'sp-section__toggle', 'aria-expanded': open ? 'true' : 'false', onClick: function () {
        open = !open; root.classList.toggle('is-closed', !open); this.setAttribute('aria-expanded', open ? 'true' : 'false');
      } }, [icon('chevron-down', 14), h('span', { class: 'sp-section__title', text: o.title })]) : h('span', { class: 'sp-section__title', text: o.title }),
      o.meta ? h('span', { class: 'sp-section__meta', text: o.meta }) : null,
      h('span', { class: 'sp-section__actions' }, (o.actions || []).map(function (a) { return S.Button({ variant: 'ghost', size: 'sm', iconOnly: true, icon: a.icon, label: a.label, onClick: a.onClick }); }))
    ]);
    var root = h('section', { class: cx('sp-section', !open && 'is-closed') }, [head, body]);
    return root;
  };
  S.Row = function (kids, o) { return h('div', { class: cx('sp-row', o && o.cols === 1 && 'sp-row--1') }, kids); };

  /* ---------------------------------------------------------------- FloorTabs */
  S.FloorTabs = function (o) {
    var loc = o.locale, max = o.max || 3, floors = o.floors || [t('floorN', loc, { n: 1 })];
    var root = h('div', { class: 'sp-floors', role: 'tablist', 'aria-label': 'Floors' });
    floors.forEach(function (f, i) {
      root.appendChild(h('button', { type: 'button', role: 'tab', 'aria-selected': i === (o.active || 0) ? 'true' : 'false', class: cx('sp-floors__tab', i === (o.active || 0) && 'is-on'),
        onClick: o.onSelect ? function () { o.onSelect(i); } : null }, [h('span', { text: f }), o.issues && o.issues[i] ? h('span', { class: 'sp-floors__badge', text: String(o.issues[i]) }) : null]));
    });
    var full = floors.length >= max;
    root.appendChild(h('button', { type: 'button', class: 'sp-floors__add', 'aria-label': t('addFloor', loc), title: full ? t('maxFloors', loc, { n: max }) : t('addFloor', loc), disabled: full, onClick: o.onAdd || null }, icon('plus', 14)));
    return root;
  };

  /* ---------------------------------------------------------------- Dialog */
  S.Dialog = function (o) {
    var dlg = h('div', { class: cx('sp-dialog', o.tone && 'sp-dialog--' + o.tone), role: 'dialog', 'aria-modal': o.inline ? null : 'true', 'aria-labelledby': 'sp-dlg-t' + (++uid) }, [
      h('div', { class: 'sp-dialog__head' }, [
        o.tone === 'danger' ? h('span', { class: 'sp-dialog__glyph' }, icon(o.glyph || 'trash-2', 18)) : o.glyph ? h('span', { class: 'sp-dialog__glyph' }, icon(o.glyph, 18)) : null,
        h('h2', { class: 'sp-dialog__title', id: 'sp-dlg-t' + uid, text: o.title }),
        o.onClose ? S.Button({ variant: 'ghost', size: 'sm', iconOnly: true, icon: 'x', label: 'Close', onClick: o.onClose }) : null
      ]),
      h('div', { class: 'sp-dialog__body' }, [
        typeof o.body === 'string' ? h('p', { text: o.body }) : o.body,
        o.items && o.items.length ? h('ul', { class: 'sp-dialog__deps' }, o.items.map(function (it) {
          return h('li', null, [icon(it.icon || 'dot', 14), h('span', { text: it.label }), it.meta ? h('span', { class: 'sp-dialog__depmeta', text: it.meta }) : null]);
        })) : null
      ]),
      h('div', { class: 'sp-dialog__foot' }, (o.actions || []).map(function (a) { return S.Button(a); }))
    ]);
    return dlg;
  };
  S.openDialog = function (o) {
    var prev = document.activeElement;
    var scrim = h('div', { class: 'sp-scrim' }, S.Dialog(o));
    function close() { scrim.remove(); document.removeEventListener('keydown', onKey, true); if (prev && prev.focus) prev.focus(); }
    function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); if (o.onCancel) o.onCancel(); } }
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(scrim);
    var first = scrim.querySelector('.sp-dialog__foot .sp-btn:last-child'); if (first) first.focus();
    return close;
  };

  /* ---------------------------------------------------------------- Diagnostic */
  var SEV = { error: 'circle-alert', warning: 'triangle-alert', info: 'info' };
  S.Diagnostic = function (o) {
    return h('div', { class: cx('sp-diag', 'sp-diag--' + (o.severity || 'warning'), o.active && 'is-active'), role: 'listitem', tabindex: '0',
      onClick: o.onFocusGeometry || null }, [
      h('span', { class: 'sp-diag__icon' }, icon(SEV[o.severity || 'warning'], 16)),
      h('div', { class: 'sp-diag__text' }, [h('div', { class: 'sp-diag__title', text: o.title }), o.detail ? h('div', { class: 'sp-diag__detail', text: o.detail }) : null]),
      o.actionLabel ? h('button', { type: 'button', class: 'sp-diag__action', text: o.actionLabel, onClick: o.onAction || null }) : h('span', { class: 'sp-diag__go' }, icon('crosshair', 14))
    ]);
  };

  /* ---------------------------------------------------------------- ZoomControl */
  S.ZoomControl = function (o) {
    o = o || {}; var loc = o.locale;
    return h('div', { class: 'sp-zoom' }, [
      S.Button({ variant: 'ghost', size: 'sm', iconOnly: true, icon: 'minus', label: t('zoomOut', loc), onClick: o.onZoomOut }),
      h('button', { type: 'button', class: 'sp-zoom__value', title: t('fit', loc), text: Math.round((o.zoom || 1) * 100) + '%', onClick: o.onFit || null }),
      S.Button({ variant: 'ghost', size: 'sm', iconOnly: true, icon: 'plus', label: t('zoomIn', loc), onClick: o.onZoomIn }),
      h('span', { class: 'sp-zoom__sep' }),
      S.Button({ variant: 'ghost', size: 'sm', iconOnly: true, icon: 'maximize', label: t('fit', loc), onClick: o.onFit })
    ]);
  };

  /* ---------------------------------------------------------------- CategoryRail */
  S.CategoryRail = function (o) {
    var value = o.value;
    var root = h('nav', { class: 'sp-rail', 'aria-label': o.label || 'Categories' });
    var list = h('div', { class: 'sp-rail__list', role: 'tablist', 'aria-orientation': 'vertical' });
    function render() {
      list.textContent = '';
      (o.items || []).forEach(function (it) {
        if (it === '|') { list.appendChild(h('span', { class: 'sp-rail__sep', 'aria-hidden': 'true' })); return; }
        var on = it.value === value;
        list.appendChild(h('button', {
          type: 'button', role: 'tab', 'aria-selected': on ? 'true' : 'false', 'aria-label': it.label, 'data-tip': it.label,
          class: cx('sp-rail__item', on && 'is-on'), disabled: it.disabled,
          onClick: function () { if (value === it.value) return; value = it.value; render(); if (o.onChange) o.onChange(value); }
        }, [icon(it.icon, 20), it.count ? h('span', { class: 'sp-rail__count', text: it.count > 99 ? '99+' : String(it.count) }) : null]));
      });
    }
    render();
    root.appendChild(list);
    if (o.footer) root.appendChild(h('div', { class: 'sp-rail__foot' }, o.footer.map(function (f) {
      return h('button', { type: 'button', class: 'sp-rail__item', 'aria-label': f.label, 'data-tip': f.label, onClick: f.onClick || null }, icon(f.icon, 20));
    })));
    return root;
  };

  /* ---------------------------------------------------------------- ContextMenu */
  S.ContextMenu = function (o) {
    var menu = h('div', { class: 'sp-menu', role: 'menu', 'aria-label': o.label || null, tabindex: '-1' });
    (o.items || []).forEach(function (it) {
      if (it === '|') { menu.appendChild(h('div', { class: 'sp-menu__sep', role: 'separator' })); return; }
      if (it.heading) { menu.appendChild(h('div', { class: 'sp-menu__heading', text: it.heading })); return; }
      var role = it.checked != null ? 'menuitemcheckbox' : 'menuitem';
      var el = h('button', {
        type: 'button', role: role, tabindex: '-1', class: cx('sp-menu__item', it.danger && 'is-danger', it.active && 'is-active'),
        'aria-checked': it.checked != null ? String(!!it.checked) : null, 'aria-haspopup': it.submenu ? 'menu' : null, disabled: it.disabled
      }, [
        h('span', { class: 'sp-menu__icon' }, it.marker ? it.marker : it.checked ? icon('check', 16) : it.icon ? icon(it.icon, 16) : null),
        h('span', { class: 'sp-menu__label', text: it.label }),
        it.badge != null ? h('span', { class: cx('sp-menu__badge', it.badgeTone === 'error' && 'is-error'), text: String(it.badge) }) : null,
        it.shortcut ? kbd(it.shortcut, true) : null,
        it.submenu ? h('span', { class: 'sp-menu__sub' }, icon('chevron-right', 14)) : null
      ]);
      el.addEventListener('click', function (e) { if (it.onSelect) it.onSelect(e); if (!it.submenu && menu._close) menu._close(); });
      el.addEventListener('mouseenter', function () { el.focus({ preventScroll: true }); });
      menu.appendChild(el);
    });
    menu.addEventListener('keydown', function (e) {
      var items = Array.prototype.filter.call(menu.querySelectorAll('.sp-menu__item'), function (b) { return !b.disabled; });
      var i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var n = items.length; i = e.key === 'ArrowDown' ? (i + 1) % n : (i - 1 + n) % n; items[i].focus(); e.preventDefault();
      } else if (e.key === 'Home') { items[0].focus(); e.preventDefault(); }
      else if (e.key === 'End') { items[items.length - 1].focus(); e.preventDefault(); }
      e.stopPropagation();
    });
    return menu;
  };
  /** Open a ContextMenu at client point (x, y), clamped to the viewport. Returns close(). */
  S.openContextMenu = function (o, x, y) {
    var prev = document.activeElement, menu = S.ContextMenu(o);
    menu.classList.add('is-floating'); document.body.appendChild(menu);
    var r = menu.getBoundingClientRect(), vw = window.innerWidth, vh = window.innerHeight;
    menu.style.left = Math.max(4, Math.min(x, vw - r.width - 4)) + 'px';
    menu.style.top = Math.max(4, y + r.height > vh - 4 ? y - r.height : y) + 'px';
    function close() {
      menu.remove(); document.removeEventListener('pointerdown', onDown, true); document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('blur', close); if (prev && prev.focus) prev.focus(); if (o.onClose) o.onClose();
    }
    function onDown(e) { if (!menu.contains(e.target)) close(); }
    function onKey(e) { if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); e.stopPropagation(); close(); } }
    menu._close = close;
    document.addEventListener('pointerdown', onDown, true); document.addEventListener('keydown', onKey, true); window.addEventListener('blur', close);
    var first = menu.querySelector('.sp-menu__item:not(:disabled)'); if (first) first.focus({ preventScroll: true });
    return close;
  };

  /* ---------------------------------------------------------------- InlineEditor (canvas popover) */
  function popRow(f) {
    if (f === '|') return h('div', { class: 'sp-pop__sep', role: 'separator' });
    var type = f.type || 'number', o2 = {}; for (var k in f) if (k !== 'type') o2[k] = f[k];
    switch (type) {
      case 'number': o2.inline = o2.inline !== false; return S.NumberField(o2);
      case 'text': o2.inline = o2.inline !== false; return S.TextField(o2);
      case 'select': o2.showLabel = true; o2.inline = o2.inline !== false; return S.Select(o2);
      case 'switch': return S.Switch(o2);
      case 'segmented': o2.block = true; o2.size = o2.size || 'sm';
        return h('div', { class: 'sp-pop__seg' }, [o2.label ? h('span', { class: 'sp-field__label', text: o2.label }) : null, S.SegmentedControl(o2)]);
      case 'measureMode': o2.block = true; o2.size = 'sm'; return h('div', { class: 'sp-pop__seg' }, S.MeasureMode(o2));
      case 'button': o2.size = o2.size || 'sm'; o2.variant = o2.variant || 'secondary'; return S.Button(o2);
      case 'row': return h('div', { class: 'sp-pop__row' }, (f.items || []).map(popRow));
      case 'picker': o2.inline = o2.inline !== false; return S.Picker(o2);
      case 'note': return h('div', { class: 'sp-pop__note', text: f.text });
      case 'action': return h('button', { type: 'button', class: cx('sp-pop__action', f.danger && 'is-danger'), disabled: f.disabled, onClick: f.onClick || null },
        [h('span', { class: 'sp-pop__aicon' }, f.icon ? icon(f.icon, 16) : null), h('span', { class: 'sp-pop__alabel', text: f.label }), f.shortcut ? kbd(f.shortcut, true) : null]);
      case 'iconbar': return h('div', { class: 'sp-pop__iconbar' }, [f.label ? h('span', { class: 'sp-pop__barlabel', text: f.label }) : null,
        h('span', { class: 'sp-pop__barbtns' }, (f.items || []).map(function (b) {
          var el = S.Button({ variant: 'ghost', size: 'sm', iconOnly: true, icon: b.icon, label: b.label, onClick: b.onClick, disabled: b.disabled });
          if (b.danger) el.classList.add('is-danger'); return el;
        }))]);
    }
    return null;
  }
  S.InlineEditor = function (o) {
    var loc = o.locale;
    var root = h('div', { class: cx('sp-pop', o.compact && 'sp-pop--compact', o.caret && 'sp-pop--caret-' + o.caret), role: 'dialog', 'aria-label': o.title || o.label || null }, [
      !o.compact && o.title ? h('div', { class: 'sp-pop__head' }, [
        o.icon ? h('span', { class: 'sp-pop__icon' }, icon(o.icon, 16)) : null,
        h('span', { class: 'sp-pop__title', text: o.title }),
        o.meta ? h('span', { class: 'sp-pop__meta', text: o.meta }) : null,
        o.onMore ? S.Button({ variant: 'ghost', size: 'sm', iconOnly: true, icon: 'settings-2', label: t('moreInInspector', loc), onClick: o.onMore }) : null
      ]) : null,
      h('div', { class: 'sp-pop__body' }, (o.fields || []).map(popRow)),
      !o.compact && o.hint !== false ? h('div', { class: 'sp-pop__foot' }, [h('span', { text: o.hint || t('applyHint', loc) }),
        o.actions ? h('span', { class: 'sp-pop__actions' }, o.actions.map(function (a) { a.size = a.size || 'sm'; a.variant = a.variant || 'ghost'; return S.Button(a); })) : null]) : null
    ]);
    return root;
  };
  /** Open an InlineEditor next to an anchor (a DOMRect or {x, y} in client px). Live edits flow through each field's
      callbacks; Enter or a click outside applies (onApply), Esc cancels (onCancel). Returns close(). */
  S.openInlineEditor = function (o, anchor) {
    var prev = document.activeElement, pop = S.InlineEditor(o), gap = 10;
    pop.classList.add('is-floating'); document.body.appendChild(pop);
    var a = anchor.width != null ? anchor : { left: anchor.x, right: anchor.x, top: anchor.y, bottom: anchor.y, width: 0, height: 0 };
    var r = pop.getBoundingClientRect(), vw = window.innerWidth, vh = window.innerHeight;
    var place = o.placement || 'bottom';
    if (place === 'bottom' && a.bottom + gap + r.height > vh) place = 'top';
    if (place === 'top' && a.top - gap - r.height < 0) place = 'bottom';
    var x = o.compact ? a.left + a.width / 2 - r.width / 2 : a.left + a.width / 2 - r.width / 2;
    var y = o.compact ? a.top + a.height / 2 - r.height / 2 : place === 'bottom' ? a.bottom + gap : a.top - gap - r.height;
    pop.style.left = Math.max(4, Math.min(x, vw - r.width - 4)) + 'px'; pop.style.top = Math.max(4, Math.min(y, vh - r.height - 4)) + 'px';
    if (!o.compact) pop.classList.add('sp-pop--caret-' + (place === 'bottom' ? 'top' : 'bottom'));
    var closed = false;
    function close(apply) {
      if (closed) return; closed = true;
      document.removeEventListener('pointerdown', onDown, true); pop.removeEventListener('keydown', onKey, true);
      if (!apply) pop.classList.add('is-cancelling');
      var act = document.activeElement; if (act && pop.contains(act) && act.blur) act.blur(); // apply: the focused field commits first
      pop.remove(); if (prev && prev.focus) prev.focus({ preventScroll: true });
      if (apply) { if (o.onApply) o.onApply(); } else if (o.onCancel) o.onCancel();
    }
    function onDown(e) { if (!pop.contains(e.target)) close(true); }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(false); return; }
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        setTimeout(function () { if (!pop.querySelector('.sp-field.is-error')) close(true); }, 0); return;
      }
      if (e.key === 'Tab') {
        var f = pop.querySelectorAll('input, select, button:not(:disabled)'); if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { f[f.length - 1].focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { f[0].focus(); e.preventDefault(); }
      }
    }
    document.addEventListener('pointerdown', onDown, true); pop.addEventListener('keydown', onKey, true);
    var first = pop.querySelector('input, select, .sp-seg__opt.is-on, button'); if (first) { first.focus({ preventScroll: true }); if (first.select) first.select(); }
    return close;
  };

  /* ---------------------------------------------------------------- FileDrop */
  function fmtBytes(n, loc) {
    var mb = n >= 1024 * 1024; var v = n / (mb ? 1048576 : 1024);
    return nf(loc, 0, mb ? 1 : 0).format(v) + ' ' + t(mb ? 'unit_mb' : 'unit_kb', loc);
  }
  S.formatBytes = fmtBytes;
  /** Drop zone + file picker. Validates type, size and count; shows idle, over, invalid, uploading, done and error states.
      onFiles(files) may return a Promise: pending shows uploading, resolve shows done, reject shows the error. */
  S.FileDrop = function (o) {
    o = o || {}; var loc = o.locale;
    var accept = o.accept || ['image/png', 'image/jpeg', '.png', '.jpg', '.jpeg'];
    var max = o.maxSize || 20 * 1048576, multiple = !!o.multiple;
    var typesLabel = o.typesLabel || 'PNG, JPEG';
    var isImage = o.kind ? o.kind === 'image' : accept.every(function (a) { return /^image\/|\.(png|jpe?g|webp|gif)$/i.test(a); });
    var input = h('input', { type: 'file', accept: accept.join(','), multiple: multiple, hidden: true, tabindex: '-1' });
    var root = h('div', { class: cx('sp-drop', o.compact && 'sp-drop--compact'), tabindex: '0', role: 'button',
      'aria-label': (o.title || t(isImage ? 'dropTitleImage' : 'dropTitle', loc)) + '. ' + t('dropTypes', loc, { types: typesLabel, max: fmtBytes(max, loc) }) });
    var state = o.state || 'idle', data = { file: o.file, progress: o.progress, error: o.error }, depth = 0, pending = null;

    function okType(f) {
      var name = (f.name || '').toLowerCase();
      return accept.some(function (a) { a = a.toLowerCase(); return a[0] === '.' ? name.slice(-a.length) === a : a.slice(-2) === '/*' ? (f.type || '').indexOf(a.slice(0, -1)) === 0 : f.type === a; });
    }
    function validate(files) {
      if (!files.length) return null;
      if (!multiple && files.length > 1) return t('errMany', loc);
      for (var i = 0; i < files.length; i++) {
        if (!okType(files[i])) return t('errType', loc, { name: files[i].name, types: typesLabel });
        if (files[i].size > max) return t('errSize', loc, { name: files[i].name, size: fmtBytes(files[i].size, loc), max: fmtBytes(max, loc) });
      }
      return null;
    }
    function fileRow(f, extra) {
      var th = f.preview ? thumb({ image: f.preview }, 48, 36, f.name) : thumb({ icon: isImage ? 'image' : 'file' }, 48, 36, f.name);
      return h('div', { class: 'sp-drop__file' }, [th, h('div', { class: 'sp-drop__fmeta' }, [h('span', { class: 'sp-drop__fname', text: f.name, title: f.name }),
        h('span', { class: 'sp-drop__fsize', text: [f.size != null ? fmtBytes(f.size, loc) : null, f.detail].filter(Boolean).join(' · ') })])].concat(extra || []));
    }
    function render() {
      root.className = cx('sp-drop', o.compact && 'sp-drop--compact', 'is-' + state);
      root.textContent = ''; root.appendChild(input);
      root.setAttribute('aria-busy', state === 'uploading' ? 'true' : 'false');
      if (state === 'idle' || state === 'over' || state === 'invalid') {
        var title = state === 'over' ? t('dropOver', loc) : state === 'invalid' ? t('dropBadType', loc) : (o.title || t(isImage ? 'dropTitleImage' : 'dropTitle', loc));
        add(root, [h('span', { class: 'sp-drop__icon' }, icon(state === 'invalid' ? 'file-x' : isImage ? 'image-up' : 'file-up', o.compact ? 20 : 28)),
          h('div', { class: 'sp-drop__text' }, [h('span', { class: 'sp-drop__title' }, [title, state === 'idle' ? h('span', { class: 'sp-drop__browse', text: ' ' + t('dropBrowse', loc) }) : null]),
            h('span', { class: 'sp-drop__hint', text: t('dropTypes', loc, { types: typesLabel, max: fmtBytes(max, loc) }) + (state === 'idle' && isImage && o.paste !== false && !o.compact ? ' · ' + t('dropPaste', loc) : '') })])]);
      } else if (state === 'uploading') {
        var p = data.progress, bar = h('div', { class: 'sp-drop__bar' + (p == null ? ' is-indeterminate' : ''), role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': p == null ? null : String(Math.round(p)) },
          h('span', { style: p == null ? null : 'width:' + Math.max(2, Math.min(100, p)) + '%' }));
        add(root, [fileRow(data.file || { name: '' }, [S.Button({ variant: 'ghost', size: 'sm', iconOnly: true, icon: 'x', label: t('dropCancel', loc),
            onClick: function (e) { e.stopPropagation(); if (o.onCancel) o.onCancel(); pending = null; set('idle'); } })]),
          h('div', { class: 'sp-drop__sub' }, [bar, h('span', { class: 'sp-drop__ptext', text: p == null ? t('dropProcessing', loc) : t('dropUploading', loc, { p: Math.round(p) }) })])]);
      } else if (state === 'done') {
        add(root, [fileRow(data.file || { name: '' }, [h('span', { class: 'sp-drop__ok', title: '' }, icon('circle-check', 16))]),
          h('div', { class: 'sp-drop__sub sp-drop__actions' }, [
            S.Button({ variant: 'secondary', size: 'sm', label: t('dropReplace', loc), onClick: function (e) { e.stopPropagation(); input.click(); } }),
            o.onRemove !== false ? S.Button({ variant: 'ghost', size: 'sm', label: t('dropRemove', loc), onClick: function (e) { e.stopPropagation(); if (o.onRemove) o.onRemove(); set('idle'); } }) : null])]);
      } else if (state === 'error') {
        add(root, [h('span', { class: 'sp-drop__icon' }, icon('circle-alert', o.compact ? 20 : 24)), h('div', { class: 'sp-drop__text' }, [
          h('span', { class: 'sp-drop__title', text: data.error || t('errUpload', loc) }), h('span', { class: 'sp-drop__hint', text: t('dropTypes', loc, { types: typesLabel, max: fmtBytes(max, loc) }) })]),
          S.Button({ variant: 'secondary', size: 'sm', label: t('dropRetry', loc), onClick: function (e) { e.stopPropagation(); input.click(); } })]);
      }
    }
    function set(st, d) { state = st; if (d) for (var k in d) data[k] = d[k]; render(); }
    function take(list) {
      var files = Array.prototype.slice.call(list || []);
      var err = validate(files); if (err) { set('error', { error: err }); return; }
      if (!files.length) return;
      var f = files[0], info = { name: f.name, size: f.size, preview: isImage && typeof URL !== 'undefined' && URL.createObjectURL ? URL.createObjectURL(f) : null };
      var res = o.onFiles ? o.onFiles(multiple ? files : f, root) : null;
      if (res && typeof res.then === 'function') {
        var my = pending = {}; set('uploading', { file: info, progress: null });
        res.then(function (out) { if (pending !== my) return; set('done', { file: out && out.name ? out : info }); }, function (e) { if (pending !== my) return; set('error', { error: (e && e.message) || t('errUpload', loc) }); });
      } else set('done', { file: info });
    }
    function canPick() { return state === 'idle' || state === 'error' || state === 'invalid'; }
    root.addEventListener('click', function () { if (canPick()) input.click(); });
    root.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === root) { if (canPick() || state === 'done') input.click(); e.preventDefault(); } });
    input.addEventListener('change', function () { take(input.files); input.value = ''; });
    function dragFiles(e) { var dt = e.dataTransfer; return dt && Array.prototype.indexOf.call(dt.types || [], 'Files') >= 0; }
    root.addEventListener('dragenter', function (e) {
      if (!dragFiles(e) || state === 'uploading') return; e.preventDefault(); depth++;
      // while dragging only MIME types are known: judge by those (extensions are checked again on drop)
      var mimes = accept.filter(function (a) { return a.indexOf('/') > 0; }), items = Array.prototype.slice.call(e.dataTransfer.items || []);
      var bad = mimes.length > 0 && items.some(function (it) { return it.kind === 'file' && it.type && !okType({ name: '', type: it.type }); });
      if (!multiple && items.length > 1) bad = true;
      data._prev = state === 'over' || state === 'invalid' ? data._prev : state; set(bad ? 'invalid' : 'over');
    });
    root.addEventListener('dragover', function (e) { if (dragFiles(e) && state !== 'uploading') { e.preventDefault(); e.dataTransfer.dropEffect = state === 'invalid' ? 'none' : 'copy'; } });
    root.addEventListener('dragleave', function () { if (--depth <= 0 && (state === 'over' || state === 'invalid')) { depth = 0; set(data._prev || 'idle'); } });
    root.addEventListener('drop', function (e) { if (!dragFiles(e)) return; e.preventDefault(); depth = 0; take(e.dataTransfer.files); });
    root.addEventListener('paste', function (e) { if (o.paste === false || state === 'uploading') return; var fl = e.clipboardData && e.clipboardData.files; if (fl && fl.length) { e.preventDefault(); take(fl); } });
    render();
    root.setProgress = function (p) { set('uploading', { progress: p }); };
    root.setDone = function (file) { pending = null; set('done', { file: file }); };
    root.setError = function (msg) { pending = null; set('error', { error: msg }); };
    root.reset = function () { pending = null; set('idle'); };
    root.open = function () { input.click(); };
    return root;
  };

  /* ---------------------------------------------------------------- Toast */
  var toastHost = null;
  /** Where toasts appear: the canvas element (bottom-centre inside it) or, by default, the window. */
  S.toastRegion = function (container) {
    if (toastHost && toastHost.parentNode) toastHost.remove();
    toastHost = h('div', { class: cx('sp-toasts', container && container !== document.body && 'is-contained'), role: 'status', 'aria-live': 'polite', 'aria-atomic': 'false' });
    (container || document.body).appendChild(toastHost);
    return toastHost;
  };
  S.Toast = function (o) {
    var ic = o.icon !== undefined ? o.icon : o.tone === 'success' ? 'circle-check' : null;
    var el = h('div', { class: cx('sp-toast', o.tone && 'sp-toast--' + o.tone) }, [
      ic ? h('span', { class: 'sp-toast__icon' }, icon(ic, 16)) : null,
      h('span', { class: 'sp-toast__msg', text: o.message }),
      o.action ? h('button', { type: 'button', class: 'sp-toast__action', text: o.action.label || t('undo', o.locale), onClick: function () { if (o.action.onClick) o.action.onClick(); if (el._close) el._close(); } }) : null
    ]);
    return el;
  };
  /** Show a brief confirmation. { message, tone: 'neutral' | 'success', icon, action: {label?, onClick} (Undo only), duration, id }. Returns close(). */
  S.toast = function (o) {
    if (typeof o === 'string') o = { message: o };
    if (!toastHost || !toastHost.isConnected) S.toastRegion();
    if (o.id) { var old = toastHost.querySelector('[data-toast-id="' + o.id + '"]'); if (old && old._close) old._close(true); }
    var el = S.Toast(o); if (o.id) el.setAttribute('data-toast-id', o.id);
    toastHost.appendChild(el);
    var all = toastHost.querySelectorAll('.sp-toast:not(.is-out)'); if (all.length > 3 && all[0]._close) all[0]._close(true);
    var dur = o.duration || (o.action ? 6000 : 4000), left = dur, started = Date.now(), timer = null;
    function arm() { started = Date.now(); timer = setTimeout(close, left); }
    function pause() { clearTimeout(timer); left -= Date.now() - started; }
    function close(fast) {
      clearTimeout(timer); if (el.classList.contains('is-out')) return; el.classList.add('is-out'); el.classList.remove('is-in');
      setTimeout(function () { el.remove(); }, fast ? 0 : 180);
    }
    el._close = close;
    el.addEventListener('mouseenter', pause); el.addEventListener('mouseleave', arm);
    el.addEventListener('focusin', pause); el.addEventListener('focusout', arm);
    requestAnimationFrame(function () { el.classList.add('is-in'); });
    arm();
    return close;
  };

  /* ---------------------------------------------------------------- StageNav (plan stages) */
  var STAGE_KEY = { notStarted: 'stageNotStarted', inProgress: 'stageInProgress', done: 'stageDone', notNeeded: 'stageNotNeeded' };
  /** Status marker: numbered ring (not started), half-filled ring (in progress), check disc (done), dashed ring with a dash (not needed), lock (later). */
  /** Status marker. Without an icon: numbered ring (not started), half-filled ring (in progress), check disc (done), dashed ring with a dash (not needed), lock (later).
      With an icon (display 'icon-label' | 'icon'): the stage icon sits inside the same ring shapes; done and later add a corner badge so the icon stays visible. */
  function stageMarker(st, n, useIcon, numbered) {
    var status = st.disabled ? 'later' : st.status;
    if (!status) { // plain sheet/tab: its icon (no ring), a number if asked for, or nothing
      if (st.icon && useIcon) return h('span', { class: 'sp-stage__mk is-plain has-icon', 'aria-hidden': 'true' }, icon(st.icon, 16));
      if (numbered) return stageMarker({ status: 'notStarted' }, n, false);
      return null;
    }
    var m = h('span', { class: 'sp-stage__mk is-' + status, 'aria-hidden': 'true' });
    if (useIcon && st.icon) {
      m.classList.add('has-icon'); m.appendChild(icon(st.icon, 14));
      if (status === 'done') m.appendChild(h('span', { class: 'sp-stage__badge is-done' }, icon('check', 8)));
      if (status === 'later') m.appendChild(h('span', { class: 'sp-stage__badge is-later' }, icon('lock', 8)));
      return m;
    }
    if (status === 'done') m.appendChild(icon('check', 12));
    else if (status === 'notNeeded') m.appendChild(icon('minus', 12));
    else if (status === 'later') m.appendChild(icon('lock', 11));
    else { m.appendChild(h('span', { class: 'sp-stage__n', text: String(n) })); if (n > 9) m.classList.add('is-2d'); }
    return m;
  }
  function issueText(st, loc) { return tp(st.severity === 'error' ? 'errors' : 'issues', st.issues, loc); }
  function issueBadge(st) { return st.issues ? h('span', { class: cx('sp-stage__issues', st.severity === 'error' && 'is-error'), text: st.issues > 99 ? '99+' : String(st.issues) }) : null; }
  function stageTitle(st, n, total, loc, numbered) {
    var parts = [(numbered ? n + '. ' : '') + st.label];
    if (st.disabled) parts.push(t('stageLater', loc)); else if (st.status) parts.push(t(STAGE_KEY[st.status], loc));
    if (st.issues) parts.push(issueText(st, loc));
    return parts.join(' · ');
  }
  S.StageNav = function (o) {
    var loc = o.locale, stages = o.stages || [], current = o.current, showLater = o.disabledMode === 'show';
    var display = o.display || 'label', useIcon = display !== 'label';
    var anyStatus = stages.some(function (st) { return st.status; });
    var numbered = o.numbered != null ? o.numbered : anyStatus; // stage lists are numbered; plain sheet tabs are not
    var visible = stages.filter(function (st) { return showLater || !st.disabled; });
    function idx(id) { for (var i = 0; i < visible.length; i++) if (visible[i].id === id) return i; return -1; }
    function step(dir) {
      for (var i = idx(current) + dir; i >= 0 && i < visible.length; i += dir) if (!visible[i].disabled) return visible[i].id;
      return null;
    }
    function select(id, focus) {
      var st = visible[idx(id)]; if (!st || st.disabled || id === current) return;
      current = id; render(); if (focus) { var b = list.querySelector('.sp-stage.is-current'); if (b) b.focus(); }
      if (o.onChange) o.onChange(id, st);
    }

    if (o.variant === 'menu') { // compact switcher for the top bar
      var btn = h('button', { type: 'button', class: 'sp-stagepick', 'aria-haspopup': 'menu' });
      var render = function () {
        var i = idx(current), st = visible[i] || visible[0], n = stages.indexOf(st) + 1;
        btn.textContent = ''; btn.title = stageTitle(st, n, stages.length, loc, numbered);
        add(btn, [stageMarker(st, n, useIcon, numbered), numbered ? h('span', { class: 'sp-stagepick__of', text: t('stageOf', loc, { n: n, total: stages.length }) }) : null,
          h('span', { class: 'sp-stagepick__label', text: st.label }), issueBadge(st),
          h('span', { class: 'sp-picker__chev' }, icon('chevron-down', 14))]);
      };
      var list = btn; render();
      btn.addEventListener('click', function () {
        var r = btn.getBoundingClientRect();
        S.openContextMenu({ label: t('stages', loc), items: visible.map(function (st) {
          var n = stages.indexOf(st) + 1;
          return { label: (numbered ? n + '. ' : '') + st.label, marker: stageMarker(st, n, useIcon, numbered), badge: st.issues || null, badgeTone: st.severity, disabled: st.disabled, active: st.id === current,
            onSelect: function () { select(st.id); } };
        }) }, r.left, r.bottom + 4);
      });
      btn.setCurrent = function (id) { current = id; render(); };
      return btn;
    }

    var list = h('ol', { class: 'sp-stages' });
    var prev = S.Button({ variant: 'ghost', size: 'sm', iconOnly: true, icon: 'chevron-left', label: t('stagePrev', loc), onClick: function () { var id = step(-1); if (id) select(id); } });
    var next = S.Button({ variant: 'ghost', size: 'sm', iconOnly: true, icon: 'chevron-right', label: t('stageNext', loc), onClick: function () { var id = step(1); if (id) select(id); } });
    var summary = (o.summary != null ? o.summary : anyStatus) ? h('span', { class: 'sp-stagebar__sum' }) : null;
    var root = h('nav', { class: cx('sp-stagebar', 'sp-stagebar--' + display, o.currentLabel === false && 'no-current-label'), 'aria-label': o.label || t('stages', loc) }, [o.nav === false ? null : prev, list, o.nav === false ? null : next, summary]);
    function render() {
      list.textContent = '';
      visible.forEach(function (st) {
        var n = stages.indexOf(st) + 1, cur = st.id === current;
        var b = h('button', { type: 'button', class: cx('sp-stage', cur && 'is-current', 'is-' + (st.disabled ? 'later' : (st.status || 'plain'))),
          'aria-current': cur ? 'step' : null, 'aria-disabled': st.disabled ? 'true' : null, tabindex: cur ? '0' : '-1',
          title: stageTitle(st, n, stages.length, loc, numbered), 'aria-label': stageTitle(st, n, stages.length, loc, numbered), 'data-id': st.id,
          onClick: function () { select(st.id); } }, [
          stageMarker(st, n, useIcon, numbered),
          h('span', { class: 'sp-stage__label', text: st.label }),
          h('span', { class: 'sp-stage__short', text: st.short || st.label }),
          issueBadge(st)
        ]);
        if (!b.querySelector('.sp-stage__mk')) b.classList.add('no-mk');
        list.appendChild(h('li', null, b));
      });
      prev.disabled = !step(-1); next.disabled = !step(1);
      if (summary) {
        var need = stages.filter(function (st) { return !st.disabled && st.status !== 'notNeeded'; });
        summary.textContent = t('stagesDone', loc, { n: need.filter(function (st) { return st.status === 'done'; }).length, total: need.length });
      }
      fit();
    }
    // Fit: full labels → short labels for other stages → markers only for other stages. The current stage keeps its full label.
    function fit() {
      if (!root.isConnected) return;
      root.classList.remove('is-compact', 'is-nosum', 'is-markers', 'is-truncated', 'is-scrolling-x');
      var over = function () { return list.scrollWidth > list.clientWidth + 1; };
      // markers-only is possible only when every other item has a marker (status, icon or number)
      var allMarked = !list.querySelector('.sp-stage.no-mk:not(.is-current)');
      if (over()) root.classList.add('is-compact');
      if (over()) root.classList.add('is-nosum');
      if (over()) root.classList.add(allMarked ? 'is-markers' : 'is-truncated');
      if (over()) root.classList.add('is-scrolling-x'); // last resort: scroll the row; arrows and the keyboard still move through every item
      var cur = list.querySelector('.sp-stage.is-current');
      if (cur && root.classList.contains('is-scrolling-x')) { var l = cur.parentNode.offsetLeft, r = l + cur.parentNode.offsetWidth; if (l < list.scrollLeft || r > list.scrollLeft + list.clientWidth) list.scrollLeft = l - 24; }
      root.setAttribute('data-fit', root.classList.contains('is-scrolling-x') ? 'scroll' : root.classList.contains('is-markers') ? 'markers' : root.classList.contains('is-truncated') ? 'truncated' : root.classList.contains('is-compact') ? 'short' : 'full');
    }
    list.addEventListener('keydown', function (e) {
      var btns = Array.prototype.slice.call(list.querySelectorAll('.sp-stage:not([aria-disabled])')), i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? btns.length - 1 : null;
      if (j == null) return; j = Math.max(0, Math.min(btns.length - 1, j));
      btns.forEach(function (b) { b.tabIndex = -1; }); btns[j].tabIndex = 0; btns[j].focus(); e.preventDefault();
    });
    render();
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(fit).observe(root);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    root.setCurrent = function (id) { current = id; render(); };
    root.prev = function () { var id = step(-1); if (id) select(id); };
    root.next = function () { var id = step(1); if (id) select(id); };
    root.fit = fit;
    return root;
  };

  /* ---------------------------------------------------------------- InputGroup (field + button) */
  /** Put one or more buttons beside a field's control (or inside its right edge with attached: true).
      The label stays above, hints and errors span the whole row, and Enter in the field presses the first button. */
  S.InputGroup = function (o) {
    var fieldEl = o.field, ctrl = fieldEl.querySelector('.sp-field__control') || fieldEl.querySelector('.sp-picker') || fieldEl;
    var acts = (Array.isArray(o.action) ? o.action : [o.action]).filter(Boolean).map(function (a) {
      if (a.nodeType) return a;
      var b = {}; for (var k in a) b[k] = a[k];
      if (o.attached) { b.size = 'sm'; b.variant = b.variant || 'ghost'; } else b.variant = b.variant || 'secondary';
      return S.Button(b);
    });
    fieldEl.classList.add('sp-igroup', o.attached ? 'sp-igroup--attached' : 'sp-igroup--beside');
    if (o.attached) acts.forEach(function (b) { b.classList.add('sp-igroup__btn'); ctrl.appendChild(b); });
    else {
      var row = h('div', { class: 'sp-igroup__row' });
      ctrl.parentNode.insertBefore(row, ctrl); row.appendChild(ctrl); acts.forEach(function (b) { row.appendChild(b); });
    }
    var input = fieldEl.querySelector('input');
    if (input && o.submitOnEnter !== false && acts[0]) {
      input.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        setTimeout(function () { if (!fieldEl.classList.contains('is-error') && !acts[0].disabled) acts[0].click(); }, 0); // after the field has committed
      });
    }
    if (o.enableWhenChanged && input && acts[0]) { // e.g. Rename: only once the text differs
      var initial = input.value; acts[0].disabled = true;
      input.addEventListener('input', function () { acts[0].disabled = !input.value.trim() || input.value === initial; });
    }
    fieldEl.buttons = acts;
    return fieldEl;
  };

  /* ---------------------------------------------------------------- ScrollArea (minimal scrollbar) */
  /** Show the thumb while an element scrolls (wheel, touchpad, keyboard), then let it fade back. Safe to call twice. */
  S.enhanceScroll = function (el) {
    if (!el || el._spScroll) return el; el._spScroll = true;
    if (!el.classList.contains('sp-scroll')) el.classList.add('sp-scroll');
    var tm = null;
    el.addEventListener('scroll', function () { el.classList.add('is-scrolling'); clearTimeout(tm); tm = setTimeout(function () { el.classList.remove('is-scrolling'); }, 900); }, { passive: true });
    return el;
  };
  /** A scroll container with the Spatium scrollbar. axis: 'y' (default) | 'x' | 'both'. */
  S.ScrollArea = function (o) {
    o = o || {};
    var el = h('div', { class: cx('sp-scroll', 'sp-scroll--' + (o.axis || 'y'), o.className), tabindex: o.focusable === false ? null : '0', role: o.label ? 'region' : null, 'aria-label': o.label || null,
      style: (o.height ? 'max-height:' + (typeof o.height === 'number' ? o.height + 'px' : o.height) + ';' : '') + (o.style || '') }, o.children);
    return S.enhanceScroll(el);
  };

  /* ---------------------------------------------------------------- Picker (searchable select with previews) */
  // Search normalisation: case-, accent-, ё/е- and й/и-insensitive; keeps a per-character map back to the label for highlighting.
  function normChar(c) { return c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function normalize(str) {
    var out = '', map = [], chars = Array.from(String(str || ''));
    for (var i = 0, pos = 0; i < chars.length; pos += chars[i].length, i++) { var n = normChar(chars[i]); for (var j = 0; j < n.length; j++) { out += n[j]; map.push([pos, chars[i].length]); } }
    return { text: out, map: map };
  }
  function scoreItem(it, tokens) {
    if (!tokens.length) return 0;
    var L = it._n || (it._n = normalize(it.label)), K = it._k || (it._k = normalize((it.keywords || []).concat(it.meta ? [it.meta] : []).join(' ')).text);
    var score = 0;
    for (var i = 0; i < tokens.length; i++) {
      var tk = tokens[i], at = L.text.indexOf(tk);
      if (at === 0) score += 0; else if (at > 0 && /[\s\-–(«"/]/.test(L.text[at - 1])) score += 1; else if (at > 0) score += 2;
      else if (K.indexOf(tk) >= 0) score += 3; else return -1;
    }
    return score;
  }
  function highlight(label, tokens) {
    if (!tokens.length) return [document.createTextNode(label)];
    var L = normalize(label), marks = [];
    tokens.forEach(function (tk) { var at = L.text.indexOf(tk); if (at >= 0) { var a = L.map[at][0], last = L.map[at + tk.length - 1]; marks.push([a, last[0] + last[1]]); } });
    marks.sort(function (x, y) { return x[0] - y[0]; });
    var out = [], cur = 0;
    marks.forEach(function (m) { if (m[0] < cur) return; if (m[0] > cur) out.push(document.createTextNode(label.slice(cur, m[0]))); out.push(h('mark', { text: label.slice(m[0], m[1]) })); cur = m[1]; });
    if (cur < label.length) out.push(document.createTextNode(label.slice(cur)));
    return out;
  }
  /** Thumbnail for a picker item: {image} | {swatch} | {material} | {symbol, width, depth} | {icon}. */
  function thumb(t, w, hgt, label) {
    var box = h('span', { class: 'sp-thumb', style: 'width:' + w + 'px;height:' + hgt + 'px' });
    if (!t) { box.classList.add('is-empty'); box.textContent = (label || '?').charAt(0).toUpperCase(); return box; }
    if (t.image) {
      var img = h('img', { src: t.image, alt: '', loading: 'lazy', decoding: 'async', draggable: 'false' });
      img.addEventListener('error', function () { img.remove(); box.classList.add('is-empty'); box.textContent = (label || '?').charAt(0).toUpperCase(); });
      box.appendChild(img);
    } else if (t.swatch) { box.style.background = t.swatch; box.classList.add('is-swatch'); }
    else if (t.icon) { box.classList.add('is-icon'); box.appendChild(icon(t.icon, Math.min(20, hgt - 8))); }
    else if (t.material || t.symbol) {
      var ctx = S.createPlanCanvas(w, hgt, box);
      if (t.material) S.PlanWall(ctx, { rings: [[[-2, -2], [w + 2, -2], [w + 2, hgt + 2], [-2, hgt + 2]]], material: t.material, axis: 0 });
      else {
        var W = t.width || 1000, D = t.depth || 1000, k = Math.min((w - 8) / W, (hgt - 8) / D);
        S.PlanFurniture(ctx, { symbol: t.symbol, x: w / 2, y: hgt / 2, w: W * k, d: D * k });
      }
    }
    return box;
  }
  S.thumb = thumb;

  /** The panel on its own (embed it in a side panel, or let Picker float it). */
  S.PickerPanel = function (o) {
    var loc = o.locale, layout = o.layout || 'list', cols = o.columns || 3, max = o.limit || 200;
    var query = o.query || '', filter = o.filter || (o.filters ? o.filters[0].value : null), active = o.activeIndex != null ? o.activeIndex : -1;
    var items = o.items || [], visible = [], loading = false, seq = 0;
    var input = h('input', { class: 'sp-input sp-pick__input', type: 'text', placeholder: o.searchPlaceholder || t('pickSearch', loc), value: query,
      autocomplete: 'off', spellcheck: 'false', role: 'combobox', 'aria-expanded': 'true', 'aria-autocomplete': 'list' });
    var clear = h('button', { type: 'button', class: 'sp-pick__clear', 'aria-label': t('pickClear', loc), title: t('pickClear', loc) }, icon('x', 14));
    var list = h('div', { class: cx('sp-pick__list', 'sp-scroll', layout === 'grid' && 'is-grid'), role: 'listbox', id: 'sp-pl' + (++uid), style: layout === 'grid' ? '--sp-pick-cols:' + cols : null });
    input.setAttribute('aria-controls', list.id);
    var chips = o.filters ? h('div', { class: 'sp-pick__chips', role: 'tablist' }) : null;
    var foot = h('div', { class: 'sp-pick__foot' });
    var root = h('div', { class: cx('sp-pick', o.embedded && 'is-embedded'), style: o.width ? 'width:' + o.width + 'px' : null }, [
      h('div', { class: 'sp-pick__search' }, [icon('search', 16), input, clear]), chips, list, foot
    ]);

    function renderChips() {
      if (!chips) return; chips.textContent = '';
      o.filters.forEach(function (f) {
        chips.appendChild(h('button', { type: 'button', role: 'tab', 'aria-selected': f.value === filter ? 'true' : 'false', class: cx('sp-chip', f.value === filter && 'is-on'),
          onClick: function () { filter = f.value; renderChips(); run(); } }, [f.label, f.count != null ? h('span', { class: 'sp-chip__n', text: String(f.count) }) : null]));
      });
    }
    function tokensOf(q) { return normalize(q).text.split(/\s+/).filter(Boolean); }
    function option(it, idx, tokens) {
      var sel = it.value === o.value, tw = layout === 'grid' ? 0 : 32;
      var el = h('div', { role: 'option', id: list.id + '-o' + idx, class: cx('sp-opt', sel && 'is-selected', idx === active && 'is-active', it.disabled && 'is-disabled'),
        'aria-selected': sel ? 'true' : 'false', 'aria-disabled': it.disabled ? 'true' : null, title: layout === 'grid' ? it.label : null }, layout === 'grid' ? [
          thumb(it.thumb, o.thumbWidth || 80, o.thumbHeight || 60, it.label),
          h('span', { class: 'sp-opt__label' }, highlight(it.label, tokens)),
          it.meta ? h('span', { class: 'sp-opt__meta', text: it.meta }) : null,
          sel ? h('span', { class: 'sp-opt__check' }, icon('check', 12)) : null
        ] : [
          o.thumbs === false ? null : thumb(it.thumb, tw, tw, it.label),
          h('span', { class: 'sp-opt__text' }, [h('span', { class: 'sp-opt__label' }, highlight(it.label, tokens)), it.meta ? h('span', { class: 'sp-opt__meta', text: it.meta }) : null]),
          sel ? h('span', { class: 'sp-opt__check' }, icon('check', 16)) : null
        ]);
      el.addEventListener('mousemove', function () { if (active !== idx) setActive(idx); });
      el.addEventListener('mousedown', function (e) { e.preventDefault(); });
      el.addEventListener('click', function () { choose(idx); });
      return el;
    }
    function render(all) {
      list.textContent = '';
      var tokens = tokensOf(query), pool = all.filter(function (it) { return !filter || filter === o.filters[0].value || it.filter === filter || (it.filters && it.filters.indexOf(filter) >= 0); });
      var scored = [];
      pool.forEach(function (it, i) { var sc = scoreItem(it, tokens); if (sc >= 0) scored.push([sc, i, it]); });
      if (tokens.length) scored.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      var matches = scored.map(function (x) { return x[2]; });
      var shown = matches.slice(0, max), sections = [];
      if (!tokens.length && o.recent && o.recent.length) {
        var rec = o.recent.map(function (v) { return pool.filter(function (it) { return it.value === v; })[0]; }).filter(Boolean);
        if (rec.length) sections.push({ title: t('pickRecent', loc), items: rec });
      }
      if (o.groupBy !== false && shown.some(function (it) { return it.group; }) && !tokens.length) {
        var order = [], byG = {};
        shown.forEach(function (it) { var g = it.group || ''; if (!byG[g]) { byG[g] = []; order.push(g); } byG[g].push(it); });
        order.forEach(function (g) { sections.push({ title: g, items: byG[g] }); });
      } else sections.push({ title: null, items: shown });
      visible = [];
      sections.forEach(function (sec) {
        if (!sec.items.length) return;
        if (sec.title) list.appendChild(h('div', { class: 'sp-pick__group', role: 'presentation', text: sec.title }));
        var wrap = layout === 'grid' ? h('div', { class: 'sp-pick__grid', role: 'presentation' }) : list;
        sec.items.forEach(function (it) { wrap.appendChild(option(it, visible.length, tokens)); visible.push(it); });
        if (wrap !== list) list.appendChild(wrap);
      });
      if (loading) list.appendChild(h('div', { class: 'sp-pick__state' }, [h('span', { class: 'is-spinning' }, icon('loader-circle', 16)), t('pickLoading', loc)]));
      else if (!matches.length) list.appendChild(h('div', { class: 'sp-pick__state is-empty' }, [icon('search', 20),
        h('strong', { text: tokens.length ? t('pickNone', loc, { q: query.trim() }) : (o.emptyText || t('pickNone', loc, { q: '' })) }),
        h('span', { text: o.emptyHint || t('pickNoneHint', loc) })]));
      foot.textContent = '';
      add(foot, [h('span', { text: loading ? '' : matches.length > shown.length ? t('pickMore', loc, { n: shown.length, total: matches.length }) : t('pickCount', loc, { n: matches.length, total: all.length }) }),
        o.footerAction ? h('button', { type: 'button', class: 'sp-pick__action', text: o.footerAction.label, onClick: o.footerAction.onClick || null }) : null]);
      clear.hidden = !query;
      if (active >= visible.length) active = visible.length - 1;
      if (active < 0 && visible.length && tokens.length) active = 0;
      setActive(active, true);
    }
    function run() {
      if (o.load) { // async source: debounce, show loading, ignore stale answers
        var my = ++seq; loading = true; render(items);
        clearTimeout(run._t); run._t = setTimeout(function () {
          Promise.resolve(o.load(query, filter)).then(function (res) { if (my !== seq) return; items = res || []; loading = false; render(items); }, function () { if (my === seq) { loading = false; render(items); } });
        }, 150);
      } else render(items);
    }
    function setActive(i, noScroll) {
      var prev = list.querySelector('.sp-opt.is-active'); if (prev) prev.classList.remove('is-active');
      active = i; var el = i >= 0 ? document.getElementById(list.id + '-o' + i) || list.querySelectorAll('.sp-opt')[i] : null;
      if (el) { el.classList.add('is-active'); input.setAttribute('aria-activedescendant', el.id); if (!noScroll && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' }); }
      else input.removeAttribute('aria-activedescendant');
    }
    function choose(i) { var it = visible[i]; if (!it || it.disabled) return; o.value = it.value; if (o.onChange) o.onChange(it.value, it); if (root._done) root._done(true); else render(items); }
    input.addEventListener('input', function () { query = input.value; active = -1; run(); });
    clear.addEventListener('click', function () { query = ''; input.value = ''; active = -1; run(); input.focus(); });
    input.addEventListener('keydown', function (e) {
      var step = layout === 'grid' ? cols : 1;
      if (e.key === 'ArrowDown') { setActive(Math.min(visible.length - 1, active < 0 ? 0 : active + step)); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { setActive(Math.max(0, active - step)); e.preventDefault(); }
      else if (layout === 'grid' && e.key === 'ArrowRight' && input.selectionStart === input.value.length) { setActive(Math.min(visible.length - 1, active + 1)); e.preventDefault(); }
      else if (layout === 'grid' && e.key === 'ArrowLeft' && input.selectionStart === 0 && active > 0) { setActive(active - 1); e.preventDefault(); }
      else if (e.key === 'PageDown') { setActive(Math.min(visible.length - 1, active + step * 6)); e.preventDefault(); }
      else if (e.key === 'PageUp') { setActive(Math.max(0, active - step * 6)); e.preventDefault(); }
      else if (e.key === 'Enter') { if (active >= 0) choose(active); e.preventDefault(); }
      else if (e.key === 'Escape') { if (query) { query = ''; input.value = ''; run(); } else if (root._done) root._done(false); e.preventDefault(); }
      e.stopPropagation();
    });
    renderChips(); run(); S.enhanceScroll(list);
    root.input = input;
    root.setItems = function (next) { items = next || []; run(); };
    return root;
  };

  /** A select-like trigger that opens a searchable PickerPanel. Use for >12 options, or whenever options need pictures. */
  S.Picker = function (o) {
    var loc = o.locale;
    function current() { return (o.items || []).filter(function (it) { return it.value === o.value; })[0] || o.selectedItem || null; }
    var btn = h('button', { type: 'button', class: cx('sp-picker', o.variant === 'ghost' && 'sp-picker--ghost'), 'aria-haspopup': 'listbox', 'aria-expanded': 'false', disabled: o.disabled,
      style: o.width ? 'width:' + o.width + 'px' : null });
    function paint() {
      var it = current(); btn.textContent = '';
      add(btn, [it && o.thumbs !== false ? thumb(it.thumb, 20, 20, it.label) : null,
        h('span', { class: cx('sp-picker__value', !it && 'is-placeholder'), text: it ? it.label : (o.placeholder || t('pickPlaceholder', loc)) }),
        it && it.meta && o.showMeta ? h('span', { class: 'sp-picker__meta', text: it.meta }) : null,
        h('span', { class: 'sp-picker__chev' }, icon('chevron-down', 14))]);
    }
    paint();
    function open(prefill) {
      if (btn.getAttribute('aria-expanded') === 'true') return;
      var opts = {}; for (var k in o) opts[k] = o[k];
      opts.query = prefill || ''; opts.width = Math.max(btn.getBoundingClientRect().width, o.panelWidth || (o.layout === 'grid' ? 344 : 288));
      opts.onChange = function (v, it) { o.value = v; paint(); if (o.onChange) o.onChange(v, it); };
      var panel = S.PickerPanel(opts); panel.classList.add('is-floating');
      document.body.appendChild(panel); btn.setAttribute('aria-expanded', 'true');
      var r = btn.getBoundingClientRect(), pr = panel.getBoundingClientRect(), vh = window.innerHeight, vw = window.innerWidth;
      var top = r.bottom + 4 + pr.height > vh - 4 && r.top - 4 - pr.height > 4 ? r.top - 4 - pr.height : r.bottom + 4;
      panel.style.top = Math.max(4, top) + 'px'; panel.style.left = Math.max(4, Math.min(r.left, vw - pr.width - 4)) + 'px';
      function done(picked) {
        panel.remove(); btn.setAttribute('aria-expanded', 'false'); document.removeEventListener('pointerdown', onDown, true); btn.focus({ preventScroll: true });
        if (!picked && o.onCancel) o.onCancel();
      }
      function onDown(e) { if (!panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) done(false); }
      panel._done = done; document.addEventListener('pointerdown', onDown, true);
      panel.input.focus(); var L = panel.input.value.length; panel.input.setSelectionRange(L, L);
    }
    btn.addEventListener('click', function () { if (btn.getAttribute('aria-expanded') !== 'true') open(); });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { open(); e.preventDefault(); }
      else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { open(e.key); e.preventDefault(); } // type-ahead opens with the letter
    });
    btn.open = open;
    btn.setValue = function (v) { o.value = v; paint(); };
    return o.label && o.showLabel !== false ? field({ label: o.label, inline: o.inline, hint: o.hint, error: o.error }, btn) : btn;
  };

  /* ================================================================ PLAN (Canvas 2D) */
  var theme = null;
  /** Resolve plan tokens from CSS custom properties (falls back to the system defaults). Call again after a theme change. */
  S.PlanTheme = function (el) {
    var cs = typeof getComputedStyle === 'function' ? getComputedStyle(el || document.documentElement) : null;
    var out = {};
    for (var k in DEF) {
      var v = cs ? cs.getPropertyValue('--' + k).trim() : '';
      out[k] = typeof DEF[k] === 'number' ? (v ? parseFloat(v) : DEF[k]) : (v || DEF[k]);
    }
    var fam = cs ? cs.getPropertyValue('--font-sans').trim() : '';
    out.font = fam || '"IBM Plex Sans", system-ui, sans-serif';
    out.dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    out._pat = {};
    theme = out;
    return out;
  };
  function T(o) { return (o && o.theme) || theme || S.PlanTheme(); }

  /** Create a HiDPI canvas of CSS size w × h; returns its 2D context (already scaled). */
  S.createPlanCanvas = function (w, h2, parent) {
    var dpr = window.devicePixelRatio || 1;
    var c = document.createElement('canvas');
    c.width = Math.round(w * dpr); c.height = Math.round(h2 * dpr);
    c.style.width = w + 'px'; c.style.height = h2 + 'px'; c.className = 'sp-plan-canvas';
    if (parent) parent.appendChild(c);
    var ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  };
  /** Run cb once the plan font is loaded (canvas text does not wait for webfonts). */
  S.whenFontsReady = function (cb) {
    if (!document.fonts || !document.fonts.load) return cb();
    var th = T();
    Promise.all(['400', '500', '600'].map(function (w) { return document.fonts.load(w + ' 12px ' + th.font); })).then(cb, cb);
  };

  function path(ctx, rings) {
    ctx.beginPath();
    rings.forEach(function (r) { r.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath(); });
  }
  function rings(o) { var r = o.rings || [o.points]; return Array.isArray(r[0][0]) ? r : [r]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function addv(a, b, k) { k = k == null ? 1 : k; return [a[0] + b[0] * k, a[1] + b[1] * k]; }
  function len(v) { return Math.hypot(v[0], v[1]); }
  function unit2(v) { var l = len(v) || 1; return [v[0] / l, v[1] / l]; }
  function perp(v) { return [-v[1], v[0]]; }
  S.plan = { quad: function (a, b, thickness) {
    var u = unit2(sub(b, a)), n = perp(u), t2 = thickness / 2;
    return [addv(a, n, t2), addv(b, n, t2), addv(b, n, -t2), addv(a, n, -t2)];
  } };

  /* --- hatch patterns (screen-space pitch; anchored to the canvas so hatches run continuously across joins) */
  var MATERIAL = {
    concrete: { fill: 'wall-concrete', ink: 'wall-concrete-hatch', kind: 'lines', pitch: 'hatch-pitch-dense', angle: 45 },
    brick: { fill: 'wall-brick', ink: 'wall-brick-hatch', kind: 'lines', pitch: 'hatch-pitch', angle: 45 },
    block: { fill: 'wall-block', ink: 'wall-block-hatch', kind: 'cross', pitch: 'hatch-pitch-wide', angle: 45 },
    drywall: { fill: 'wall-drywall', ink: 'wall-drywall-hatch', kind: 'dots', pitch: 'hatch-pitch', angle: 0, axis: true },
    timber: { fill: 'wall-timber', ink: 'wall-timber-hatch', kind: 'grain', pitch: 'hatch-pitch-wide', angle: 0, axis: true },
    generic: { fill: 'wall-generic', kind: 'none' }
  };
  S.wallMaterials = Object.keys(MATERIAL);
  function hatch(ctx, th, mat, axisDeg) {
    var m = MATERIAL[mat] || MATERIAL.generic; if (m.kind === 'none') return null;
    var dpr = th.dpr, p = th[m.pitch], key = mat + p + dpr;
    var tile = th._pat[key];
    if (!tile) {
      var size = Math.max(2, Math.round(p * dpr));
      tile = document.createElement('canvas'); tile.width = m.kind === 'grain' ? size * 3 : size; tile.height = m.kind === 'grain' ? size * 2 : size;
      var g = tile.getContext('2d'); g.strokeStyle = g.fillStyle = th[m.ink]; g.lineWidth = th['hatch-line'] * dpr;
      if (m.kind === 'lines' || m.kind === 'cross') { g.beginPath(); g.moveTo(0, size / 2); g.lineTo(size, size / 2); if (m.kind === 'cross') { g.moveTo(size / 2, 0); g.lineTo(size / 2, size); } g.stroke(); }
      if (m.kind === 'dots') { g.beginPath(); g.arc(size / 2, size / 2, 0.75 * dpr, 0, 7); g.fill(); }
      if (m.kind === 'grain') { g.beginPath(); g.moveTo(0, size * 0.5); g.lineTo(size * 2.1, size * 0.5); g.moveTo(size * 1.5, size * 1.5); g.lineTo(size * 3, size * 1.5); g.moveTo(0, size * 1.5); g.lineTo(size * 0.6, size * 1.5); g.stroke(); }
      th._pat[key] = tile;
    }
    var pat = ctx.createPattern(tile, 'repeat');
    var ang = m.axis ? (axisDeg || 0) : m.angle;
    if (pat.setTransform && typeof DOMMatrix !== 'undefined') pat.setTransform(new DOMMatrix().rotate(ang).scale(1 / dpr));
    return pat;
  }

  /** Draw walls. Pass one wall or an array; outlines are unioned per call (draw all walls of a floor in ONE call).
      wall = { rings:[[ [x,y],… ]], material, axis (deg, for drywall/timber), state } */
  S.PlanWall = function (ctx, walls, o) {
    walls = Array.isArray(walls) ? walls : [walls];
    var th = T(o);
    ctx.save();
    ctx.lineJoin = 'miter'; ctx.miterLimit = 4;
    // 1. outlines at double width, 2. fills on top: only the outer half of each stroke survives, so joins have no seams
    ctx.strokeStyle = th['plan-ink']; ctx.lineWidth = th['line-wall'] * 2;
    walls.forEach(function (w) { path(ctx, rings(w)); ctx.stroke(); });
    walls.forEach(function (w) {
      var m = MATERIAL[w.material] || MATERIAL.generic;
      path(ctx, rings(w)); ctx.fillStyle = th[m.fill]; ctx.fill('evenodd');
      var pat = hatch(ctx, th, w.material, w.axis); if (pat) { ctx.fillStyle = pat; ctx.fill('evenodd'); }
    });
    ctx.restore();
    walls.forEach(function (w) { if (w.state) S.PlanSelection(ctx, { rings: rings(w), kind: w.state, handles: w.handles, theme: th }); });
  };

  /** Doors and windows. a, b = opening ends on the wall CENTERLINE (screen px); thickness = wall thickness (px).
      type: door | door-double | window | opening; side: 1 | -1 (which face the door opens to); hinge: 'start' | 'end'. */
  S.PlanOpening = function (ctx, o) {
    var th = T(o), a = o.a, b = o.b, t2 = o.thickness / 2, side = o.side || 1;
    var u = unit2(sub(b, a)), n = perp(u), w = len(sub(b, a));
    ctx.save();
    // cut through the wall (slightly wider than the wall so its outline disappears)
    var e = th['line-wall'] * 2 + 0.5;
    path(ctx, [[addv(a, n, t2 + e), addv(b, n, t2 + e), addv(b, n, -t2 - e), addv(a, n, -t2 - e)]]);
    ctx.fillStyle = th['plan-opening']; ctx.fill();
    // jambs
    ctx.strokeStyle = th['plan-ink']; ctx.lineWidth = th['line-wall'];
    ctx.beginPath();
    [a, b].forEach(function (p) { var p1 = addv(p, n, t2), p2 = addv(p, n, -t2); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); });
    ctx.stroke();
    var face = function (p, s) { return addv(p, n, t2 * (s == null ? side : s)); };
    if (o.type === 'window') {
      ctx.beginPath(); ctx.lineWidth = th['line-arc']; ctx.strokeStyle = th['plan-ink'];
      [1, -1].forEach(function (s) { var p = face(a, s), q = face(b, s); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); });
      ctx.stroke();
      ctx.beginPath(); ctx.strokeStyle = th['plan-ink-tertiary'];
      [0.18, -0.18].forEach(function (k) { var p = addv(a, n, t2 * k * 2), q = addv(b, n, t2 * k * 2); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); });
      ctx.stroke();
    } else if (o.type === 'opening') {
      ctx.setLineDash([4, 3]); ctx.lineWidth = th['line-extension']; ctx.strokeStyle = th['plan-ink-tertiary'];
      ctx.beginPath(); [1, -1].forEach(function (s) { var p = face(a, s), q = face(b, s); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); }); ctx.stroke();
    } else {
      var leaves = o.type === 'door-double' ? [[a, b, w / 2], [b, a, w / 2]] : (o.hinge === 'end' ? [[b, a, w]] : [[a, b, w]]);
      leaves.forEach(function (L) {
        var hinge = face(L[0]), dir = unit2(sub(L[1], L[0])), r = L[2];
        var tip = addv(hinge, n, side * r), closed = addv(hinge, dir, r);
        ctx.setLineDash([]); ctx.strokeStyle = th['plan-ink']; ctx.lineWidth = th['line-leaf'];
        ctx.beginPath(); ctx.moveTo(hinge[0], hinge[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
        var a0 = Math.atan2(tip[1] - hinge[1], tip[0] - hinge[0]), a1 = Math.atan2(closed[1] - hinge[1], closed[0] - hinge[0]);
        var d = a1 - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        ctx.strokeStyle = th['plan-ink-tertiary']; ctx.lineWidth = th['line-arc'];
        ctx.beginPath(); ctx.arc(hinge[0], hinge[1], r, a0, a0 + d, d < 0); ctx.stroke();
      });
    }
    ctx.restore();
    if (o.state) {
      var box = [addv(a, n, t2 + 2), addv(b, n, t2 + 2), addv(b, n, -t2 - 2), addv(a, n, -t2 - 2)];
      if (o.type && o.type.indexOf('door') === 0) { box = [addv(a, n, -t2 - 2), addv(b, n, -t2 - 2), addv(addv(b, n, side * (w + 2)), [0, 0]), addv(a, n, side * (w + 2))]; if (side < 0) box = [addv(a, n, t2 + 2), addv(b, n, t2 + 2), addv(b, n, side * (w + 2)), addv(a, n, side * (w + 2))]; }
      S.PlanSelection(ctx, { rings: [box], kind: o.state, handles: o.state === 'selected' ? [a, b] : null, theme: th });
    }
  };

  function haloText(ctx, th, text, x, y, color, weight, size) {
    ctx.font = (weight || 500) + ' ' + (size || 11) + 'px ' + th.font;
    ctx.lineJoin = 'round'; ctx.lineWidth = th['label-halo'] * 2; ctx.strokeStyle = th['plan-paper'];
    ctx.strokeText(text, x, y); ctx.fillStyle = color; ctx.fillText(text, x, y);
  }

  /** Dimension between a and b (screen px). offset: signed px from geometry; mode: interior | centerline; state: default | live | focus. */
  S.PlanDimension = function (ctx, o) {
    var th = T(o), a = o.a, b = o.b, off = o.offset == null ? th['dim-offset'] : o.offset;
    var u = unit2(sub(b, a)), n = perp(u), A = addv(a, n, off), B = addv(b, n, off), sg = off < 0 ? -1 : 1;
    var accent = o.state === 'live' || o.state === 'focus';
    var line = accent ? th['plan-face'] : th['plan-ink-tertiary'];
    var textCol = accent ? th['plan-face'] : th['plan-ink-secondary'];
    ctx.save();
    // extension lines
    if (Math.abs(off) > 3) {
      ctx.strokeStyle = line; ctx.lineWidth = th['line-extension'];
      ctx.setLineDash(o.mode === 'centerline' ? [8, 2, 2, 2] : []);
      ctx.beginPath();
      [[a, A], [b, B]].forEach(function (p) { var s = addv(p[0], n, 2 * sg), e = addv(p[1], n, 3 * sg); ctx.moveTo(s[0], s[1]); ctx.lineTo(e[0], e[1]); });
      ctx.stroke(); ctx.setLineDash([]);
    }
    // dimension line + 45° ticks
    ctx.strokeStyle = line; ctx.lineWidth = th['line-dimension'] * (o.state === 'focus' ? 1.5 : 1);
    ctx.beginPath(); var A2 = addv(A, u, -4), B2 = addv(B, u, 4); ctx.moveTo(A2[0], A2[1]); ctx.lineTo(B2[0], B2[1]); ctx.stroke();
    var tk = th['dim-tick'] / 2, d45 = unit2(addv(u, n)); ctx.lineWidth = 1.25; ctx.strokeStyle = accent ? th['plan-face'] : th['plan-ink-secondary'];
    ctx.beginPath(); [A, B].forEach(function (p) { var s = addv(p, d45, -tk), e = addv(p, d45, tk); ctx.moveTo(s[0], s[1]); ctx.lineTo(e[0], e[1]); }); ctx.stroke();
    // label, kept upright
    if (o.label != null) {
      var ang = Math.atan2(u[1], u[0]); if (ang > Math.PI / 2 + 1e-6 || ang <= -Math.PI / 2 + 1e-6) ang += Math.PI;
      var mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
      ctx.translate(mid[0], mid[1]); ctx.rotate(ang);
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.font = '500 11px ' + th.font;
      var tw = ctx.measureText(String(o.label)).width;
      if (o.mode === 'centerline') { // centreline mark ℄ drawn as C + vertical bar before the number
        var gx = -tw / 2 - 7, gy = -7.5;
        ctx.strokeStyle = textCol; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(gx, gy, 3.2, 0.5, 2 * Math.PI - 0.5, false); ctx.moveTo(gx, gy - 5); ctx.lineTo(gx, gy + 5); ctx.stroke();
      }
      haloText(ctx, th, String(o.label), 0, -2.5, textCol, 500, 11);
    }
    ctx.restore();
  };

  /** Room fill + label. rings = interior polygon (screen px). state: ok | open | invalid. gap: [a,b] of an open boundary. */
  S.PlanRoom = function (ctx, o) {
    var th = T(o), st = o.state || 'ok';
    ctx.save();
    if (o.rings || o.points) {
      path(ctx, rings(o));
      ctx.fillStyle = st === 'ok' ? th['plan-room'] : th['warning-soft']; ctx.globalAlpha = st === 'ok' ? 1 : 0.6; ctx.fill('evenodd'); ctx.globalAlpha = 1;
    }
    if (o.gap) {
      ctx.strokeStyle = th['plan-warning']; ctx.lineWidth = th['line-preview']; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(o.gap[0][0], o.gap[0][1]); ctx.lineTo(o.gap[1][0], o.gap[1][1]); ctx.stroke(); ctx.setLineDash([]);
      var gm = [(o.gap[0][0] + o.gap[1][0]) / 2, (o.gap[0][1] + o.gap[1][1]) / 2];
      S.PlanIssuePin(ctx, { point: gm, severity: 'warning', theme: th });
    }
    if (o.label) {
      var p = o.label, ctr = o.labelAt || [0, 0];
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      if (p.name) haloText(ctx, th, p.name, ctr[0], ctr[1] - 2, p.unresolved ? th['warning'] : th['plan-ink'], 600, 12);
      var second = st === 'ok' ? p.area : '—';
      if (second) haloText(ctx, th, second, ctr[0], ctr[1] + 12, th['plan-ink-secondary'], 400, 11);
      if (p.unresolved) {
        ctx.font = '600 12px ' + th.font; var w = ctx.measureText(p.name).width + 12;
        ctx.strokeStyle = th['plan-warning']; ctx.setLineDash([3, 2]); ctx.lineWidth = 1;
        ctx.strokeRect(ctr[0] - w / 2, ctr[1] - 15, w, 18); ctx.setLineDash([]);
      }
    }
    ctx.restore();
  };

  /** Issue pin on the plan (open boundary, invalid room, unresolved label). */
  S.PlanIssuePin = function (ctx, o) {
    var th = T(o), p = o.point, col = o.severity === 'error' ? th['plan-invalid'] : th['plan-warning'];
    ctx.save(); ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, 7); ctx.fillStyle = col; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = th['plan-paper']; ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.font = '600 11px ' + th.font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(o.count ? String(o.count) : '!', p[0], p[1] + 0.5); ctx.restore();
  };

  /* --- furniture: generic symbols with semantic dimensions; drawn in local space, back edge at -d/2 */
  function rr(ctx, x, y, w, h2, r) { r = Math.min(r, w / 2, h2 / 2); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h2, r); ctx.arcTo(x + w, y + h2, x, y + h2, r); ctx.arcTo(x, y + h2, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  var SYMBOLS = {
    sofa: function (c, w, d) { var arm = Math.min(w * 0.1, d * 0.28), back = d * 0.24; rr(c, -w / 2, -d / 2, w, d, 4); c.moveTo(-w / 2 + arm, -d / 2 + back); c.lineTo(w / 2 - arm, -d / 2 + back); c.moveTo(-w / 2 + arm, -d / 2 + back); c.lineTo(-w / 2 + arm, d / 2); c.moveTo(w / 2 - arm, -d / 2 + back); c.lineTo(w / 2 - arm, d / 2); var n = w > 1.6 * d ? 3 : 2, s = (w - 2 * arm) / n; for (var i = 1; i < n; i++) { c.moveTo(-w / 2 + arm + s * i, -d / 2 + back); c.lineTo(-w / 2 + arm + s * i, d / 2 - 2); } },
    armchair: function (c, w, d) { var arm = w * 0.18, back = d * 0.24; rr(c, -w / 2, -d / 2, w, d, 4); c.moveTo(-w / 2 + arm, -d / 2 + back); c.lineTo(w / 2 - arm, -d / 2 + back); c.moveTo(-w / 2 + arm, -d / 2 + back); c.lineTo(-w / 2 + arm, d / 2); c.moveTo(w / 2 - arm, -d / 2 + back); c.lineTo(w / 2 - arm, d / 2); },
    bed: function (c, w, d) { c.rect(-w / 2, -d / 2, w, d); var hb = d * 0.05; c.moveTo(-w / 2, -d / 2 + hb); c.lineTo(w / 2, -d / 2 + hb); var n = w > d * 0.7 ? 2 : 1, pw = n === 2 ? w * 0.42 : w * 0.7, g = (w - n * pw) / (n + 1); for (var i = 0; i < n; i++) rr(c, -w / 2 + g + i * (pw + g), -d / 2 + hb + d * 0.04, pw, d * 0.14, 3); var bl = -d / 2 + d * 0.32; c.moveTo(-w / 2, bl); c.lineTo(w / 2, bl); c.moveTo(-w / 2, bl + d * 0.08); c.lineTo(-w / 2 + w * 0.22, bl); },
    table: function (c, w, d) { rr(c, -w / 2, -d / 2, w, d, 2); },
    'table-round': function (c, w, d) { c.ellipse(0, 0, w / 2, d / 2, 0, 0, 7); },
    chair: function (c, w, d) { rr(c, -w / 2, -d / 2 + d * 0.18, w, d * 0.82, 3); rr(c, -w / 2, -d / 2, w, d * 0.14, 2); },
    wardrobe: function (c, w, d) { c.rect(-w / 2, -d / 2, w, d); c.moveTo(-w / 2 + 3, 0); c.lineTo(w / 2 - 3, 0); var n = Math.max(2, Math.round(w / Math.max(d * 0.35, 8))); for (var i = 1; i < n; i++) { var x = -w / 2 + (w / n) * i; c.moveTo(x - d * 0.12, -d * 0.22); c.lineTo(x + d * 0.12, d * 0.22); } },
    cabinet: function (c, w, d) { c.rect(-w / 2, -d / 2, w, d); c.moveTo(-w / 2, d / 2 - d * 0.1); c.lineTo(w / 2, d / 2 - d * 0.1); },
    fridge: function (c, w, d) { c.rect(-w / 2, -d / 2, w, d); c.moveTo(-w / 2, d / 2 - d * 0.12); c.lineTo(w / 2, d / 2 - d * 0.12); c.moveTo(-w / 2 + w * 0.2, -d / 2 + d * 0.2); c.lineTo(w / 2 - w * 0.2, d / 2 - d * 0.3); c.moveTo(w / 2 - w * 0.2, -d / 2 + d * 0.2); c.lineTo(-w / 2 + w * 0.2, d / 2 - d * 0.3); },
    hob: function (c, w, d) { c.rect(-w / 2, -d / 2, w, d); var r1 = Math.min(w, d) * 0.17, r2 = Math.min(w, d) * 0.12;[[-w / 4, -d / 4, r1], [w / 4, -d / 4, r2], [-w / 4, d / 4, r2], [w / 4, d / 4, r1]].forEach(function (k) { c.moveTo(k[0] + k[2], k[1]); c.arc(k[0], k[1], k[2], 0, 7); }); },
    sink: function (c, w, d) { c.rect(-w / 2, -d / 2, w, d); rr(c, -w / 2 + w * 0.12, -d / 2 + d * 0.2, w * 0.76, d * 0.62, 4); c.moveTo(2.5, d * 0.05); c.arc(0, d * 0.05, 2.5, 0, 7); },
    washbasin: function (c, w, d) { c.rect(-w / 2, -d / 2, w, d * 0.22); c.moveTo(w * 0.42, d * 0.12); c.ellipse(0, d * 0.12, w * 0.42, d * 0.36, 0, 0, 7); c.moveTo(2, d * 0.1); c.arc(0, d * 0.1, 2, 0, 7); },
    toilet: function (c, w, d) { rr(c, -w / 2, -d / 2, w, d * 0.28, 2); c.moveTo(w * 0.42, -d / 2 + d * 0.28); c.ellipse(0, d * 0.12, w * 0.42, d * 0.38, 0, 0, 7); },
    bathtub: function (c, w, d) { rr(c, -w / 2, -d / 2, w, d, 3); rr(c, -w / 2 + d * 0.1, -d / 2 + d * 0.1, w - d * 0.2, d * 0.8, d * 0.3); c.moveTo(-w / 2 + d * 0.25 + 2.5, 0); c.arc(-w / 2 + d * 0.25, 0, 2.5, 0, 7); },
    shower: function (c, w, d) { c.rect(-w / 2, -d / 2, w, d); c.moveTo(-w / 2, -d / 2); c.lineTo(w / 2, d / 2); c.moveTo(w / 2, -d / 2); c.lineTo(-w / 2, d / 2); c.moveTo(3, 0); c.arc(0, 0, 3, 0, 7); },
    washer: function (c, w, d) { c.rect(-w / 2, -d / 2, w, d); c.moveTo(-w / 2, d / 2 - d * 0.14); c.lineTo(w / 2, d / 2 - d * 0.14); var r = Math.min(w, d) * 0.3; c.moveTo(r, -d * 0.06); c.arc(0, -d * 0.06, r, 0, 7); }
  };
  S.furnitureSymbols = Object.keys(SYMBOLS);
  /** Furniture symbol. x,y = centre; w,d = width and depth (px); rotation in radians; state optional. */
  S.PlanFurniture = function (ctx, o) {
    var th = T(o), w = o.w, d = o.d, f = SYMBOLS[o.symbol] || SYMBOLS.table;
    ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rotation || 0);
    ctx.beginPath(); (o.symbol === 'table-round' ? SYMBOLS['table-round'] : function (c) { c.rect(-w / 2, -d / 2, w, d); })(ctx, w, d);
    if (o.symbol === 'table-round' || o.symbol === 'sofa' || o.symbol === 'armchair' || o.symbol === 'bathtub') { ctx.beginPath(); (o.symbol === 'table-round' ? SYMBOLS['table-round'] : function (c) { rr(c, -w / 2, -d / 2, w, d, o.symbol === 'bathtub' ? 3 : 4); })(ctx, w, d); }
    if (o.symbol !== 'washbasin' && o.symbol !== 'toilet' && o.symbol !== 'chair') { ctx.fillStyle = th['plan-furniture']; ctx.fill(); }
    ctx.beginPath(); f(ctx, w, d);
    if (o.symbol === 'washbasin' || o.symbol === 'toilet' || o.symbol === 'chair') { ctx.fillStyle = th['plan-furniture']; ctx.fill(); }
    ctx.strokeStyle = th['plan-ink-secondary']; ctx.lineWidth = th['line-furniture']; ctx.stroke();
    ctx.restore();
    if (o.state) {
      var c = Math.cos(o.rotation || 0), s = Math.sin(o.rotation || 0);
      var corner = function (x, y) { return [o.x + x * c - y * s, o.y + x * s + y * c]; };
      var box = [corner(-w / 2, -d / 2), corner(w / 2, -d / 2), corner(w / 2, d / 2), corner(-w / 2, d / 2)];
      var hs = o.state === 'selected' ? box.concat([corner(0, -d / 2), corner(w / 2, 0), corner(0, d / 2), corner(-w / 2, 0)]) : null;
      S.PlanSelection(ctx, { rings: [box], kind: o.state, handles: hs, rotate: o.state === 'selected' ? corner(0, -d / 2 - 16) : null, rotateFrom: corner(0, -d / 2), theme: th });
    }
  };

  /** State overlay for any geometry. kind: selected | hover | moving | affected | fixed | invalid. */
  S.PlanSelection = function (ctx, o) {
    var th = T(o), k = o.kind, rg = rings(o);
    ctx.save(); ctx.lineJoin = 'miter';
    if (k === 'selected' || k === 'moving') { path(ctx, rg); ctx.fillStyle = th['plan-select-fill']; ctx.fill('evenodd'); }
    if (k === 'invalid') { path(ctx, rg); ctx.fillStyle = th['plan-invalid-fill']; ctx.fill('evenodd'); }
    var stroke = { selected: th['plan-select'], hover: th['plan-hover'], moving: th['plan-preview'], affected: th['plan-affected'], fixed: th['plan-fixed'], invalid: th['plan-invalid'] }[k];
    var lw = { selected: th['line-select'], hover: 1, moving: th['line-preview'], affected: th['line-select'], fixed: th['line-preview'], invalid: th['line-preview'] }[k];
    ctx.setLineDash(k === 'affected' ? [6, 4] : k === 'invalid' ? [7, 3] : []);
    path(ctx, rg); ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); ctx.setLineDash([]);
    if (o.rotate) {
      ctx.beginPath(); ctx.moveTo(o.rotateFrom[0], o.rotateFrom[1]); ctx.lineTo(o.rotate[0], o.rotate[1]); ctx.lineWidth = 1; ctx.strokeStyle = th['plan-select']; ctx.stroke();
      ctx.beginPath(); ctx.arc(o.rotate[0], o.rotate[1], 4.5, 0, 7); ctx.fillStyle = th['plan-handle']; ctx.fill(); ctx.lineWidth = 1.5; ctx.stroke();
    }
    (o.handles || []).forEach(function (p) {
      if (k === 'fixed') { // anchor: filled triangle on a base line
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] - 5.5, p[1] + 8); ctx.lineTo(p[0] + 5.5, p[1] + 8); ctx.closePath(); ctx.fillStyle = th['plan-fixed']; ctx.fill();
        ctx.beginPath(); ctx.moveTo(p[0] - 8, p[1] + 10.5); ctx.lineTo(p[0] + 8, p[1] + 10.5); ctx.lineWidth = 1.5; ctx.strokeStyle = th['plan-fixed']; ctx.stroke();
      } else {
        var s = th['handle-size']; ctx.fillStyle = th['plan-handle']; ctx.strokeStyle = stroke; ctx.lineWidth = 1.5;
        ctx.fillRect(p[0] - s / 2, p[1] - s / 2, s, s); ctx.strokeRect(p[0] - s / 2, p[1] - s / 2, s, s);
      }
    });
    if (k === 'invalid' && o.pin) S.PlanIssuePin(ctx, { point: o.pin, severity: 'error', theme: th });
    ctx.restore();
  };

  /** Snap feedback. kind: vertex | segment | midpoint | grid | perpendicular | guide. label: short text, e.g. "Join vertex". */
  S.PlanSnap = function (ctx, o) {
    var th = T(o), p = o.point, s = th['snap-marker'] / 2, col = th['plan-snap'];
    ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.5;
    if (o.from) { ctx.setLineDash([4, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(o.from[0], o.from[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.arc(o.from[0], o.from[1], 2.5, 0, 7); ctx.fill(); ctx.lineWidth = 1.5; }
    ctx.beginPath();
    switch (o.kind) {
      case 'vertex': ctx.rect(p[0] - s, p[1] - s, 2 * s, 2 * s); break;
      case 'segment': ctx.moveTo(p[0] - s, p[1] - s); ctx.lineTo(p[0] + s, p[1] + s); ctx.moveTo(p[0] + s, p[1] - s); ctx.lineTo(p[0] - s, p[1] + s); ctx.rect(p[0] - s, p[1] - s, 2 * s, 2 * s); break;
      case 'midpoint': ctx.moveTo(p[0], p[1] - s); ctx.lineTo(p[0] + s, p[1] + s * 0.8); ctx.lineTo(p[0] - s, p[1] + s * 0.8); ctx.closePath(); break;
      case 'perpendicular': ctx.moveTo(p[0] - s, p[1] - s); ctx.lineTo(p[0] - s, p[1] + s); ctx.lineTo(p[0] + s, p[1] + s); ctx.moveTo(p[0] - s, p[1]); ctx.lineTo(p[0], p[1]); ctx.lineTo(p[0], p[1] + s); break;
      case 'grid': ctx.moveTo(p[0] - s, p[1]); ctx.lineTo(p[0] + s, p[1]); ctx.moveTo(p[0], p[1] - s); ctx.lineTo(p[0], p[1] + s); break;
      default: ctx.arc(p[0], p[1], 2.5, 0, 7); ctx.fill();
    }
    ctx.stroke();
    if (o.label) {
      ctx.font = '500 11px ' + th.font; var tw = ctx.measureText(o.label).width, x = p[0] + s + 6, y = p[1] + s + 6;
      ctx.beginPath(); rr(ctx, x, y, tw + 10, 18, 4); ctx.fillStyle = col; ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.textBaseline = 'middle'; ctx.fillText(o.label, x + 5, y + 9.5);
    }
    ctx.restore();
  };

  /** Image calibration: two anchors and the known distance. */
  S.PlanCalibration = function (ctx, o) {
    var th = T(o), a = o.a, b = o.b, col = th['accent'];
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    [a, b].forEach(function (p) {
      ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(p[0] - 11, p[1]); ctx.lineTo(p[0] - 3, p[1]); ctx.moveTo(p[0] + 3, p[1]); ctx.lineTo(p[0] + 11, p[1]); ctx.moveTo(p[0], p[1] - 11); ctx.lineTo(p[0], p[1] - 3); ctx.moveTo(p[0], p[1] + 3); ctx.lineTo(p[0], p[1] + 11); ctx.stroke();
    });
    if (o.label) {
      var m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; ctx.font = '600 11px ' + th.font; var tw = ctx.measureText(o.label).width;
      ctx.beginPath(); rr(ctx, m[0] - tw / 2 - 6, m[1] - 22, tw + 12, 18, 4); ctx.fillStyle = col; ctx.fill();
      ctx.fillStyle = th['on-accent']; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.label, m[0], m[1] - 12.5);
    }
    ctx.restore();
  };

  /** Reference image: greyscale at underlay-opacity. */
  S.PlanUnderlay = function (ctx, o) {
    var th = T(o); ctx.save(); ctx.globalAlpha = o.opacity == null ? th['underlay-opacity'] : o.opacity; ctx.filter = 'grayscale(1)';
    ctx.translate(o.x, o.y); ctx.rotate(o.rotation || 0); ctx.drawImage(o.image, 0, 0, o.w, o.h); ctx.restore();
  };

  /** Grid: origin = screen position of world (0,0); scale = screen px per mm. Levels fade in by spacing. */
  S.PlanGrid = function (ctx, o) {
    var th = T(o), W = o.width, H = o.height, sc = o.scale, org = o.origin || [0, 0];
    ctx.save(); ctx.fillStyle = th['plan-paper']; ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = th['line-grid'];
    [[100, 'plan-grid-minor'], [500, 'plan-grid-major'], [1000, 'plan-grid-metre']].forEach(function (lv) {
      var step = lv[0] * sc; if (step < 6) return;
      ctx.globalAlpha = Math.min(1, (step - 6) / 6);
      ctx.strokeStyle = th[lv[1]]; ctx.beginPath();
      for (var x = ((org[0] % step) + step) % step; x <= W; x += step) { var X = Math.round(x) + 0.5; ctx.moveTo(X, 0); ctx.lineTo(X, H); }
      for (var y = ((org[1] % step) + step) % step; y <= H; y += step) { var Y = Math.round(y) + 0.5; ctx.moveTo(0, Y); ctx.lineTo(W, Y); }
      ctx.stroke();
    });
    ctx.restore();
  };

  /* ---------------------------------------------------------------- CatalogItem (uses PlanFurniture for its thumbnail) */
  S.CatalogItem = function (o) {
    var thumb = h('div', { class: 'sp-cat__thumb' });
    var w = o.width || 2000, d = o.depth || 900, box = 64, k = (box - 12) / Math.max(w, d);
    var ctx = S.createPlanCanvas(box, box, thumb);
    S.PlanFurniture(ctx, { symbol: o.symbol, x: box / 2, y: box / 2, w: w * k, d: d * k });
    var dims = units.format(w, { unit: o.unit || 'cm', locale: o.locale }) + ' × ' + units.format(d, { unit: o.unit || 'cm', locale: o.locale });
    return h('button', { type: 'button', class: cx('sp-cat', o.selected && 'is-on'), draggable: 'true', title: o.name }, [thumb,
      h('span', { class: 'sp-cat__name', text: o.name }), h('span', { class: 'sp-cat__dims', text: dims })]);
  };

  if (typeof window !== 'undefined') window.Spatium = S;
})();
