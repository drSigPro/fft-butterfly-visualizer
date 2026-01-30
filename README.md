# FFT Explorer: DIT Radix-2 Visualizer

<div align="center">
  <h3>Interactive Digital Signal Processing Educator</h3>
  <p>A powerful, interactive visualization tool for understanding the Decimation-in-Time (DIT) Radix-2 Fast Fourier Transform (FFT) algorithm.</p>
  <p>The app is built using Google Antigravity.</p>
</div>

## 🌟 Features

- **Interactive Butterfly Diagram**: Visualize the flow of data through the FFT stages with an interactive SVG-based butterfly diagram.
- **Step-by-Step Animation**: animate the computation process stage-by-stage and butterfly-by-butterfly to understand the algorithm's recursive nature.
- **Real-time Signal Generation**: Create custom signals with configurable frequencies, amplitudes, and phases, or use presets like Single Tone, Two Tones, Square Wave, etc.
- **Deep Dive "Teacher Mode"**: Enable teacher mode to reveal mathematical details like twiddle factors ($W_N^k$) and operation flows.
- **Performance Benchmarks**: Compare DFT vs. FFT execution times and operation counts in real-time.
- **Responsive Design**: Built with Tailwind CSS for a modern, clean, and responsive user interface.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [FontAwesome](https://fontawesome.com/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v16.0.0 or higher recommended).
- **npm** or **yarn**: A package manager to install dependencies.

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd fft-explorer-dit-radix-2-visualizer
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

### Running Locally

To start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

To build the application for production deployment:

```bash
npm run build
```

The optimized assets will be generated in the `dist/` directory.

## 📦 Deployment

### Deploy to Vercel (Recommended)

This project uses Vite, which is optimized for deployment on Vercel.

1.  **Install Vercel CLI** (Optional but recommended):
    ```bash
    npm i -g vercel
    ```

2.  **Deploy from Terminal**:
    ```bash
    vercel
    ```
    Follow the prompts. Vercel will automatically detect the Vite settings.

3.  **Deploy via Dashboard**:
    - Push your code to a GitHub repository.
    - Go to [Vercel](https://vercel.com/new).
    - Import your repository.
    - Click **Deploy**.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
