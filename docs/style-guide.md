# Farcast - Style Guide

This document defines the colours, fonts, spacing, and component styles used in Farcast.

---

## 1. Colours

### Background colours

| Name | Hex | Where it is used |
|---|---|---|
| White | `#FFFFFF` | Main page background, card surfaces |
| Light grey | `#F2F2F2` | Section card backgrounds |

### Text colours

| Name | Hex | Where it is used |
|---|---|---|
| Dark navy | `#1C2B3A` | All primary text, headings, numbers |
| Medium grey | `#6B7E8F` | Secondary text, labels, descriptions |
| Light grey | `#A0ADB8` | Placeholder text, slider labels (LOW, HIGH) |

### Brand and accent colours

| Name | Hex | Where it is used |
|---|---|---|
| Green (CAST) | `#7DC8A0` | CAST in the wordmark, score gauge circle, score labels, comfort scores in forecast |
| Dark navy | `#1C2B3A` | FAR in the wordmark, active activity tab background, primary button outline, text colours |

### Score colours

These are used on the comfort wheel arc and the score labels in the 5-day outlook.

| Score | Label | Hex |
|---|---|---|
| 90–100 | Optimal | `#88C898` |
| 70–89 | Good | `#B8DDB8` |
| 45–69 | Fair | `#E8C870` |
| 20–44 | Poor | `#E89080` |
| 0–19 | Avoid | `#B84030` |

### Score bar colours in "What's affecting the score"

Bar colour should reflect how good or bad that factor is: green when conditions are good, amber when below ideal, red when to avoid.

| Category | Colour | Hex |
|---|---|---|
| Good | Green | `#88C898` |
| Below Ideal | Amber | `#E8C870` |
| Avoid | Red | `#88C898` |

---

## 2. Typography

Farcast uses Barlow Condensed, imported from Google Fonts.

---

## 3. Spacing

Farcast uses an 8-point spacing grid. All padding, margins, and gaps should be multiples of 8.

| Token | Value |
|---|---|
| Extra small | 8px |
| Small | 16px |
| Medium | 24px |
| Large | 32px |
| Extra large | 40px |
| Touch target minimum | 48px |

---

## 4. Icons

Farcast uses Material UI icons throughout the app. This covers the settings gear, info button, location pin, activity icons, and weather condition icons.

Install with:
```bash
npm install @mui/icons-material
```

All icons use the dark navy colour `#1C2B3A`.

---

## 5. Screen size

Farcast is designed for mobile at **360 x 800px** using an 8-point spacing grid. It should be responsive and work on wider screens by centering the content in a max-width container.