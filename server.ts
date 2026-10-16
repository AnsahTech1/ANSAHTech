import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK on the server with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are the ANSAH Technology AI Technical Assistant.
ANSAH Technology is a dual-discipline engineering practice founded by a Systems Developer & Electrical Hardware Engineer.
Key capabilities & background:
1. Systems Software Engineering: C/C++ (Vulkan real-time ray-query engines, SIMD leaf traversal, FreeRTOS sensor hubs, CAN 2.0B drivers), C# (.NET 9 lock-free ring-buffer telemetry buses), and WebGL/Three.js procedural spatial graphics.
2. CCTV Infrastructure Deployments: Commercial 4K IP surveillance topography, 64+ channel NVR arrays, RAID-6 storage archives, rigid EMT conduit routing, PoE+ power budgets, and optical fiber backbones.
3. Solar Photovoltaic Installations: Commercial & industrial grid-tied rooftop solar PV arrays (e.g. 48kWp systems), three-phase commercial inverters, balanced DC string topologies up to 1000V, zero-export controls, and NEC Article 690 compliance.
4. Embedded Hardware: Custom STM32 ARM Cortex-M4 circuit design, 2.5kV galvanic isolated RS-485 Modbus RTU telemetry bridges, and low-latency deterministic firmware.

Guidelines:
- Provide clear, direct, and technically rigorous answers.
- Keep answers concise (2 to 4 sentences or tight technical bullet points).
- If asked about hiring, site audits, or consulting rates, direct the user to the Contact section or direct email: ansahmbanginu@gmail.com.
- Maintain a professional, minimalist, engineering tone.`;

// AI Assistant Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    // Build contents array including recent history if provided
    const contents: any[] = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.role && item.text) {
          contents.push({
            role: item.role === 'model' ? 'model' : 'user',
            parts: [{ text: item.text }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    let answer: string | undefined;

    // Try primary model gemini-3.8-flash, with fallback to gemini-flash-latest if experiencing high demand
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
      answer = response.text;
    } catch (primaryErr: any) {
      console.warn('Primary model error, attempting fallback to gemini-flash-latest:', primaryErr?.message);
      try {
        const responseFallback = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        answer = responseFallback.text;
      } catch (fallbackErr: any) {
        console.warn('Fallback model also unavailable:', fallbackErr?.message);
        // Clean engineering deterministic response if upstream API is temporarily over capacity
        answer = `ANSAH Technology specializes in systems software engineering (C/C++, C#, WebGL, Three.js) and physical hardware infrastructure (commercial 4K CCTV surveillance topography, 48kWp industrial solar photovoltaic installations, and custom STM32 embedded firmware). For project quotes or technical consultations, please reach out via the Contact form or directly at ansahmbanginu@gmail.com.`;
      }
    }

    res.json({ reply: answer });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    res.json({
      reply: 'ANSAH Technology is available for systems engineering, commercial CCTV deployments, and solar PV commissioning. You can submit inquiries through the contact section or directly at ansahmbanginu@gmail.com.',
    });
  }
});

// Mount Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
