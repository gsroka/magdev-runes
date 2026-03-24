# Cistercian Numeral Translator

A modern React application that translates decimal numbers (0–9999) into their **Cistercian rune** representations. This project demonstrates a mathematically clean SVG implementation of the historical monk-devised numeral system.

## 🚀 Key Features

-   **Instant Translation:** Converts any number from 0 to 9999 into a unique Cistercian rune.
-   **SVG Graphics:** High-quality, responsive vector graphics that look sharp at any size.
-   **Export Capability:** Download the generated runes as `.svg` files for use in other projects.
-   **Modern Stack:** Built with the latest tools for performance and accessibility.

## 🛠️ Technology Stack

-   **Framework:** React 19 (using native compiler improvements)
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS (utility-first design)
-   **Icons:** Lucide React
-   **Language:** TypeScript (strict typing)

## 🏗️ Technical Implementation

The core logic resides in `src/components/CistercianRune.tsx`. The implementation uses a **modular SVG approach** that avoids code repetition by leveraging geometric symmetry.

### How it works:

1.  **Central Stave:** A vertical line acts as the foundation for the numeral.
2.  **Quadrants:** The space around the stave is divided into four quadrants, each representing a power of ten:
    -   **Top Right:** Units (1–9)
    -   **Top Left:** Tens (10–90) — *Mirrored horizontally*
    -   **Bottom Right:** Hundreds (100–900) — *Mirrored vertically*
    -   **Bottom Left:** Thousands (1000-9000) — *Mirrored both ways*
3.  **SVG Transformations:** Instead of defining 36 separate paths, we define only **9 base paths** (for digits 1–9). These base paths are then reused in different quadrants using `scale` and `translate` transforms:
    -   **Units:** No transformation (`translate(50, 20)`)
    -   **Tens:** `scale(-1, 1)`
    -   **Hundreds:** `scale(1, -1)`
    -   **Thousands:** `scale(-1, -1)`

This approach ensures "mathematically clean" code where the visual representation perfectly matches the logic of the Cistercian system.

## 🏃 Getting Started

To run the application locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```

3.  **Open in browser:**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📄 License

This project is open-source and available for educational purposes.
