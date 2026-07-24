# SankalpVani Admin Portal — Detailed Comprehensive Project & Functionality Analysis

**Project Name:** SankalpVani Admin Portal (`sankalpvani-admin-v1.0`)  
**Target Domain:** Devasthanam & Temple Administrative Management System  
**Framework & Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion family), Lucide React, LocalStorage Persistence Engine.

---

## Executive Summary

The **SankalpVani Admin Portal** is an enterprise-grade, sacred-themed temple administration platform designed for Devasthanam authorities, Chief Priests (*Maha-Purohitas*), Pujaris, and administrative personnel. The application manages the end-to-end operational workflow of a Hindu temple—ranging from core temple parameters, priest registries, seva pooja offerings setup, and duty shift roster scheduling to live financial transaction ledgers, thermal receipt/slip printing, remote prasadam shipping logistics, and real-time infrastructure metrics.

---

## Detailed Minute Functionalities Breakdown

### 1. Authentication & Security Engine
*Located in:* `components/LoginScreen.tsx`, `app/page.tsx`

* **Sacred-Themed Authenticator Screen:**
  * Custom background banner overlay with glassmorphism backdrop blur (`backdrop-blur-md`).
  * Sacred branding with Hindu temple iconography (`temple_hindu`) and spring-animated header badge.
* **Credential Validation & Session Management:**
  * Email and password login validation (default administrative account: `admin@temple1.com`).
  * Simulated authentication delay for real-world API experience.
  * LocalStorage session persistence via key `sankalpvani_session`.
  * Auto-login guard on app initialization to restore authenticated state across browser refreshes.
* **Password Reset Notice Modal:**
  * Direct user alert for administrative credential recovery via head priest or system administrator.
* **Multi-Point Logout Controls:**
  * Global logout execution available from Sidebar, Profile Dropdown, and Mobile Drawer Menu.

---

### 2. Global Header & Dynamic Navigation System
*Located in:* `app/page.tsx`, `components/Sidebar.tsx`

* **Dynamic Page Title Breadcrumbs:**
  * Context-aware top header title updating automatically based on the active menu tab.
* **Live Indian Standard Time (IST) Ticker:**
  * Real-time ticking clock displaying day, date, month, year, hours, minutes, and seconds in 12-hour AM/PM format for `en-IN` locale.
* **Responsive Drawer Navigation:**
  * Desktop fixed sidebar with golden divider accents (`divider-gold`).
  * Mobile overlay navigation drawer triggered via hamburger button with smooth slide-in animations.
  * Smart tab selection with nested active state recognition (e.g., highlighting *Masters* when in sub-pages like Priest Master or Seva Master).
* **Administrator Persona Quick Dropdown:**
  * Profile avatar image, admin full name, and designation display.
  * Quick access menu for updating profile details, system settings, and executing logout.
* **System-Wide Toast Notification System:**
  * Floating toast messages with status icons (`CheckCircle`, `Printer`, `PackageCheck`) providing real-time feedback for background syncs, label prints, and updates.

---

### 3. Administrator Profile & Credential Management
*Located in:* `app/page.tsx`

* **Persona Details Editor:**
  * Modifiable Full Name / Sacred Title (e.g. Chief Priest Rama Prasad).
  * System Designation / Role configuration (e.g. Maha-Purohita / System Admin).
  * Primary Email Address update with automatic session synchronization.
  * Emergency Hotline Contact Number updating.
* **Avatar & Profile Icon Chooser:**
  * 4 high-resolution avatar presets with selection highlight ring.
  * Custom avatar URL input for uploading personal/temple priest photos.
* **Administrative Security Credentials Reset:**
  * Current password verification field.
  * New password specification with minimum length check (min 6 characters).
  * Confirmation password match validation.
  * Animated error alerts and toast feedback.

---

### 4. Executive Dashboard Portal
*Located in:* `components/DashboardPortal.tsx`

* **KPI Performance Bento Grid:**
  * **Today's Sevas:** Displays count of daily sevas performed with percentage comparison vs yesterday (+12%).
  * **Recent Bookings:** Tracking total bookings made within the last 4 hours.
  * **Prasadam to Dispatch:** Pending shipment counter with progress bar visualization (65% progress).
  * **Total Collections:** Total revenue counter formatted in Indian Rupees (₹24.5k) with positive trend indicator (+5%).
* **Real-Time Data Refresh Engine:**
  * One-click dataset synchronization trigger simulating backend database fetch.
  * Dynamically perturbs KPI figures, updates trend graph heights, and prepends new simulated transactions to the live ledger.
* **Interactive 7-Day Donation Trends Graph:**
  * Responsive SVG/CSS shaded bar chart for weekly collection trends (Mon–Sun).
  * Interactive hover tooltips displaying exact daily revenue figures (e.g., `Fri: ₹24.5k`).
* **Recent Transactions Feed:**
  * Quick-view table of devotee names, initial badges, seva types, booking amounts, and completion statuses (`Completed`, `Pending`).
  * Direct route button to full Transactions ledger.
* **Quick Actions Bento Box:**
  * Shortcut button to **Generate Prasadam Slips**.
  * Shortcut button to **Send Daily Schedule** (dispatches SMS & Email updates to assigned priests).
  * Shortcut button to **Update Darshan Timings**.
* **Seva Popularity Donut Visualizer:**
  * SVG multi-colored donut chart showing offering distribution (Archana 45%, Annadanam 30%, Vahan Puja 25%).
  * Center metric display showing total active sevas (124).
  * Interactive color-coded legend.

---

### 5. Structural Masters Hub
*Located in:* `components/MastersHub.tsx`

* **Central Master Indices Routing:**
  * Gateway cards connecting to 5 underlying structural sub-masters:
    1. *Temple Core Information*
    2. *Seva & Pooja Master*
    3. *Temple Facilities Master*
    4. *Priest Master Registry*
    5. *Priest Roster & Scheduling*
* **Master Status Badges:**
  * Visual indicators displaying current record counts (e.g., "18 Offerings", "6 Active Priests", "Roster Set").
* **Sync Engine Status Monitor:**
  * Real-time status badge showing encryption, offline-cached schema sync, and Durable-Sync ID (`SV-60882-SYS`).

---

### 6. Acharyas & Priest Master Registry
*Located in:* `components/PriestMaster.tsx`

* **Official Priest Directory Table:**
  * Detailed registry listing Priest Name, System ID (`SV-ID: 00X`), Official Role, Specialized Rituals, Mobile Contact Number, and Duty Status.
* **Role Classifications:**
  * Supports *Chief Priest*, *Senior Pujari*, *Pujari*, *Archaka*, and *Rigveda Specialist*.
* **Interactive Duty Status Cycle:**
  * One-click status toggle cycling between `Active`, `Duty-Assign`, and `On Leave`.
* **Search & Multi-Filter Toolbar:**
  * Real-time text search filtering by priest name or ritual specialization.
  * Role filter tabs for quick segmenting (*All*, *Chief Priest*, *Pujari*, *Archaka*).
* **Add Official Priest Modal:**
  * Form for adding new priests with name, role dropdown, mobile number, and specialization tags.
  * Automatic assignment of distinct avatar badge colors.
* **Data Persistence & Management:**
  * LocalStorage backup (`sankalpvani_priests`).
  * Confirmation dialogs for priest record deletion.

---

### 7. Seva & Pooja Master Setup
*Located in:* `components/SevaMaster.tsx`

* **Offering Master List Table:**
  * Catalog showing Seva ID (`#SV-SV-00X`), Ritual Name, Category Type, Price Ticket (₹), Daily Capacity Limit, Availability Status, and Action Controls.
* **Category Types:**
  * Classifies offerings into `Daily`, `Weekly`, `Monthly`, and `Special`.
* **Inline Quick-Edit Mode:**
  * Inline table row editing for Seva Name, Category Type, Price, and Capacity with direct Save/Cancel controls.
* **Inline Registration Form:**
  * Collapsible form to define new ritual offerings with price, daily slot limit, and category badges.
* **Availability Toggle:**
  * Toggle button to instantly switch offering status between `Active` and `Suspended`.
* **Compliance & Propagation Safeguards:**
  * Advisory alert detailing live mobile app price propagation and midnight IST capacity resets.

---

### 8. Temple Core Parameters Setup
*Located in:* `components/TempleInfo.tsx`

* **General Identity Management:**
  * Inputs for Temple Name, Physical Address, Telephone Hotline, Official Email, Web Portal URL, and Google Maps Location Link.
* **Sthala Mahime (Temple Heritage & Significance):**
  * Editable text section for managing historical lore, spiritual importance, and grounds information displayed to pilgrims.
* **Darshan Schedule & Queue Capacity:**
  * Configuration for Morning Darshan hours (e.g. 06:00 AM - 12:30 PM).
  * Configuration for Evening Darshan hours (e.g. 04:30 PM - 09:00 PM).
  * Max Hourly Queue Capacity specification (devotees per slot).
* **Live Deployment Engine:**
  * One-click deployment simulating live parameter propagation to mobile app, kiosks, and online calendars.
* **Verification Status Widget:**
  * Live status display for external integrations (Google Maps API).

---

### 9. Temple Facilities Master Setup
*Located in:* `components/TempleFacilities.tsx`

* **Guest Amenities Management:**
  * Toggle controls to enable/disable 7 core temple facilities:
    1. **Function Hall / Choultry** (Weddings & community events)
    2. **Rest Rooms** (Clean washrooms)
    3. **Accommodation** (Guest rooms/stay)
    4. **Dining Hall** (Meal service areas)
    5. **Private Poojas** (Personal ritual bookings)
    6. **Drinking Water Facility** (Filtered water stations)
    7. **Prasadam Counter** (Devotional items distribution)
* **Custom Icon Mapping:**
  * Integrates dynamic icon rendering for each facility (`Building2`, `Bath`, `Hotel`, `UtensilsCrossed`, `Sparkles`, `Droplets`, `Gift`, `Home`).
* **Robust Data Normalization:**
  * Normalizer function handling cached schema migrations gracefully.

---

### 10. Seva Transactions Ledger & Receipt Generator
*Located in:* `components/Transactions.tsx`

* **Devotee Booking Ledger:**
  * Table tracking Receipt # (`SV-2026-XXXX`), Devotee Name, Gotra & Nakshetra details, Booked Seva, Settled Ticket Amount, Payment Status (`Paid`, `Pending`, `Refunded`), and Action Slips.
* **Search & Status Filtering:**
  * Search bar for filtering by devotee name, receipt number, or seva type.
  * Quick filter tabs (*All*, *Paid*, *Pending*).
* **High-Fidelity Official Seva Darshan Slip Modal:**
  * Authentic Devasthanam header with traditional Sanskrit Sloka (`॥ श्रीः शुभमस्तु देवकार्य सिद्ध्यर्थम् ॥`).
  * Detailed breakdown of Devotee Gotra, Nakshetra, Seva Name, Reporting Time, and Settled Amount.
  * Geometric simulated QR Code and Sanctorum Entry barcode box.
  * Direct **Thermal Slip Print** trigger and **PDF Download** simulation.
* **Thermal Printer Dispatch:**
  * Simulates sending receipt slips directly to on-site thermal receipt printers with toast notification feedback.

---

### 11. Priest Duty Roster & Scheduling
*Located in:* `components/Scheduling.tsx`

* **Interactive 4-Day Roster Board:**
  * Column layout rendering assigned shifts across Today, Tomorrow, and upcoming dates.
* **Duty Shift Cards:**
  * Shift cards showing assigned Acharya Name, Seva Pooja type, and Time Slot (`Morning (06:00 AM)`, `Noon (11:00 AM)`, `Evening (05:00 PM)`).
* **Automated Conflict Safeguard Engine:**
  * Prevents double-booking a priest for concurrent sevas or assigning priests who are marked *On Leave*.
* **Shift Assignment Modal:**
  * Dialog to pick Target Date, Priest Acharya (populated from Priest Master), Seva Pooja, and Shift Slot.
* **Quick Assign CTA:**
  * One-click prefilled assignment trigger on each calendar column card.

---

### 12. Prasadam Shipping & Logistics Manager
*Located in:* `components/Prasadam.tsx`

* **Remote Pilgrim Package Tracker:**
  * Card-based logistics tracker for remote devotees receiving holy offerings.
  * Displays Package ID (`PR-1090`), Devotee Name, Address, Sacred Contents (e.g. Kumkum, Laddu, Panchamrit, Sacred Thread), and Booking Date.
* **Pipeline Status Tracking:**
  * 3-stage status progression: `Pending` → `Packed` → `Shipped` → `Completed`.
* **Automated Postal Tracking Generation:**
  * Generates India Post tracking codes (e.g. `INDPOST_4992`) upon marking orders as shipped.
* **Thermal Packing Label Printing:**
  * One-click trigger for printing physical shipping labels on thermal printers.

---

### 13. Administrative Reports & System Overview
*Located in:* `components/SystemOverview.tsx`

* **Infrastructure Health Metrics:**
  * Server CPU Load (4.2% - Normal capacity).
  * API Gateway Latency (18ms - 99.9th percentile).
  * Database Sync State (*In-Sync* - All nodes healthy).
  * Global Network Uptime (99.99% - Annual average).
* **Donation Source Breakdown Chart:**
  * Progress bar visualizer segmenting income sources:
    * General Devotional Offerings (45% - ₹1,12,500)
    * Special Pooja Tickets (35% - ₹87,500)
    * Infrastructure & Building Fund (20% - ₹50,000)
* **Active Core Gateways Monitor:**
  * Status monitor showing real-time health of `PILGRIM-API-GW-01`, `DATABASE-REPLICA-MAIN`, and `SMS-GATEWAY-PROV-02`.

---

### 14. System Configuration & Safety Controls
*Located in:* `components/Settings.tsx`

* **Pilgrim Alerts Gateway Preferences:**
  * Checkbox toggle for **Auto-dispatch SMS Tickets** (instant barcode URLs to devotees).
  * Checkbox toggle for **End-of-day Roster Digest** (dispatches tomorrow's duty schedule to priests at 8:00 PM).
* **Administrative Security Controls:**
  * Session Inactivity Timeout selection (30 Minutes, 1 Hour, 2 Hours, Never).
  * Authentication Factor selection (Standard Password vs Two-Factor SMS Token MFA).
* **Data Factory Diagnostics (Factory Reset):**
  * One-click reset feature ("Reset Factory Presets") that wipes local storage registries and restores factory default datasets with automatic page reload.

---

## Architectural & Technical Highlights

1. **Sacred Theme Design System (`globals.css`):**
   * Curated color palette (Sacred Saffron `#8f4e00`, Deep Gold `#ff9933`, Divine Amber `#735c00`, Temple Vermilion `#b22b1d`, and Ivory Background `#fafaeb`).
   * Custom typography pairing: **Libre Caslon Text** (Serif) for headings and **Manrope** (Sans) for UI controls.
   * Sacred glow utility classes (`sacred-glow`), radial dot pattern overlays (`bg-pattern`), and golden borders (`divider-gold`).
2. **Offline Resilience & Hydration Safety:**
   * Custom SSR hydration guard in `page.tsx` preventing React hydration mismatches.
   * State persistence across all sub-modules using browser `localStorage` lazy initializers.
3. **Responsive Mobile-First Ergonomics:**
   * Mobile drawer, touch-friendly buttons, overflow-x scrollable tables with hidden scrollbars (`hide-scrollbar`), and adaptive grid layouts.

---

## Summary Matrix of Modules & Data Models

| Module Name | Component File | Primary Purpose | Key Features |
| :--- | :--- | :--- | :--- |
| **Authentication** | `LoginScreen.tsx` | Access control & login | Sacred card layout, session creation, password reset prompt |
| **Dashboard Portal** | `DashboardPortal.tsx` | Executive summary | KPI stats, 7-day trend chart, recent transactions, donut chart, quick actions |
| **Masters Hub** | `MastersHub.tsx` | Master indices gateway | Sub-master directory cards, sync engine health indicator |
| **Priest Master** | `PriestMaster.tsx` | Acharyas registry | Priest directory table, status toggles, add priest modal, specialization tags |
| **Seva Master** | `SevaMaster.tsx` | Pooja offerings setup | Offerings pricing matrix, inline editing, capacity limits, active/suspended toggle |
| **Temple Info** | `TempleInfo.tsx` | Core parameters | General contact info, darshan timings, Sthala Mahime, capacity rules |
| **Temple Facilities**| `TempleFacilities.tsx` | Guest amenities setup | 7 facility toggles with dynamic icon mapping and description |
| **Transactions** | `Transactions.tsx` | Financial & slip ledger | Searchable receipt ledger, official Darshan slip modal, thermal print trigger |
| **Scheduling** | `Scheduling.tsx` | Priest duty roster | 4-day calendar roster grid, conflict safeguard validation, shift assignment modal |
| **Prasadam** | `Prasadam.tsx` | Remote shipping | 3-stage shipment tracker, India Post code auto-generator, packing label printing |
| **System Overview** | `SystemOverview.tsx` | System health reports | CPU/Latency/Uptime metrics, donation source breakdown, gateway monitor |
| **Settings** | `Settings.tsx` | System configuration | SMS/Email digest alerts, session timeouts, factory reset diagnostic |

---
*Report compiled automatically for SankalpVani Devasthanam Administration.*
