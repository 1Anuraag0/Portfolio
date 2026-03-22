# 🌟 RPG-Style Dynamic Portfolio

Welcome to my portfolio! This isn't just a static website—it's an interactive, narrative-driven experience built directly with **Next.js 16**, **React 19**, and **TailwindCSS v4**, featuring advanced animations and live integrations. 

Check out the live code and watch the environments change, the stats load dynamically, and the carrier pigeon fly!

## ✨ Key Features
- **🌍 Dynamic Time of Day Environments:** The Hero Section dynamically switches its video background between day (`Herobg.mp4`) and night (`Nighthero.mp4`) based on the user's real-time local clock.
- **📊 Live API Integrations:** The **"Character Stats"** and **"Quest Log"** aren't hard-coded. They fetch directly from the GitHub API on load, analyzing repository languages and displaying up-to-date repositories as "quests".
- **🎨 Pixel-Art Skeumorphic aesthetic:** Deeply styled custom CSS panels, glowing text buttons, pixel cards, and dialogue boxes merge nostalgic RPG elements with clean modern web design.
- **🎥 Advanced GSAP Animations:** Seamless page loads, timeline-bound UI pop-ins, and scroll-linked camera/element effects.
- **🏂 Smooth Scrolling Engine:** Powered by **Lenis** to provide a fluid, satisfying navigation experience.
- **🕊️ Carrier Pigeon Courier:** A creatively engineered interactive contact form using timeline-controlled HTML/CSS animations.

## 🛠️ Tech Stack
- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS v4 (PostCSS config optimized) & Custom CSS Keyframes
- **Animations:** GSAP (GreenSock) & ScrollTrigger
- **Scrolling:** Lenis
- **Language:** TypeScript

## 🚀 Getting Started

If you'd like to run the project locally or examine the code:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/1Anuraag0/Portfolio.git
   ```

2. **Navigate into the project:**
   ```bash
   cd Portfolio
   ```

3. **Install the dependencies:**
   ```bash
   npm install
   ```
   *(Ensure you are using a modern version of Node.js)*

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:** Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Repository Structure
- **/app**: Contains the main routing logic, global CSS files, and the primary application entry components.
- **/components/sections**: Houses the heavily detailed RPG segments (Hero, About, Projects, and Contact sections).
- **/components**: Shared interactive elements like the `DialogueBox`, `MiniMap`, `ParticleField`, and `SmoothScroll`.
- **/public**: Stores all the core video wrappers and assets.

---
*Crafted with ☕, ❤️, and lots of pixels by [Anurag Dolui](https://github.com/1Anuraag0)*
