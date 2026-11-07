# 💖 Happy 1 Year Anniversary – A Gift for Bhumii

A romantic, animated single-page website built with love by **Harsh** for **Bhumii** to celebrate their 12-month anniversary.

## 🌸 Features

- **Lock Screen** – Password-protected with a cute teddy bear animation
- **12-Month Journey** – Scroll-driven storytelling with parallax depth effects
- **Love Letter Mailbox** – Interactive mailbox that opens a handwritten letter
- **Background Music** – Autoplays after unlock with mute/unmute control
- **Floating Decorations** – Hearts, sparkles, petals throughout
- **Confetti Finale** – Celebration at the end

## 🚀 Getting Started

1. Open `index.html` in a browser, or serve locally:
   ```
   npx serve .
   ```
2. Enter the password: **Harsh** (case-insensitive)
3. Scroll through 12 months of memories
4. Tap the mailbox to read the love letter

## 📝 How to Customize

All editable content is in the **`CONFIG` object** at the top of [`script.js`](script.js). Here's what you can change:

### Password
```js
PASSWORD: "Harsh"  // Case-insensitive, trims whitespace
```

### Names
```js
HER_NAME: "Bhumii"
MY_NAME: "Harsh"
```

### Monthly Photos & Captions
```js
MONTHS: [
  {
    photo: "assets/photos/month-01.jpg",   // Path to the photo
    caption: "Our beginning 🌸",           // Caption below the polaroid
    sideText: "Where our little story began 🌸",  // Love quote beside the photo
    side: "left"                            // "left" or "right" placement
  },
  // ... repeat for all 12 months
]
```

### Love Letter
```js
LETTER: {
  title: "Dear Bhumii,",
  paragraphs: [
    "Your first paragraph...",
    "Your second paragraph...",
    // Add as many as you want
  ],
  photos: [
    "assets/letter-photos/letter-01.jpg",  // Inserted between paragraphs
    "assets/letter-photos/letter-02.jpg",
  ],
  signature: "Forever yours, Harsh 💗"
}
```

### Background Music
Replace `assets/music.mp3` with your song. The music auto-starts after the unlock button is clicked (to comply with browser autoplay policies).

## 📁 File Structure

```
365/
├── index.html          # Main HTML
├── style.css           # All styles
├── script.js           # Logic + CONFIG
├── README.md           # This file
└── assets/
    ├── music.mp3       # Background music (add your own)
    ├── photos/
    │   ├── month-01.jpg ... month-12.jpg
    └── letter-photos/
        ├── letter-01.jpg
        └── letter-02.jpg
```

## 🖼️ Photo Tips

- **Monthly photos**: Portrait orientation (4:5 ratio) works best
- **Letter photos**: Any ratio works, they'll be displayed inline
- If any photo is missing, a cute pink placeholder is shown instead
- Supported formats: jpg, png, webp, gif
- Videos (`.mp4`) are also supported in the letter section

## 🎨 Design

- **Palette**: Baby pink, blush, soft rose, cream, berry accent
- **Fonts**: Dancing Script, Pacifico, Quicksand, Caveat
- **Libraries**: GSAP + ScrollTrigger (animations), Lenis (smooth scroll)
- All libraries are loaded from CDN – no install required

## 📱 Responsive

The site is mobile-first and works from 360px to 1440px+. It's optimized for phone viewing since Bhumii will mostly see it on her phone.

## ♿ Accessibility

Respects `prefers-reduced-motion` – animations are minimized for users who prefer reduced motion.

---

*Made with 💖 by Harsh*

