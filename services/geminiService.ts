import { GoogleGenAI } from "@google/genai";
import { KeyConfig } from "../types";

// Lazy initialization to avoid top-level errors and ensure process.env is ready
let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    // Safety check for process.env to avoid ReferenceError if not shimmed in browser
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
    if (!apiKey) {
      console.warn("API Key not found. Ensure process.env.API_KEY is configured.");
    }
    ai = new GoogleGenAI({ apiKey: apiKey || 'MISSING_KEY' });
  }
  return ai;
};

const model = "gemini-3-flash-preview";

export const generateSecurityScript = async (prompt: string): Promise<string> => {
  try {
    const client = getAIClient();
    const fullPrompt = `
      You are an expert Ubuntu 24.04 System Administrator and Security Engineer.
      Generate a robust, executable BASH script (or Python if complex) for the following task.
      Include comments explaining critical security steps.
      Focus on "Security Hardening", "LUKS Encryption", "TPM2 Tools", and "MySQL Hardening".
      
      Task: ${prompt}
      
      Output ONLY the code block without markdown backticks if possible, or plain text code.
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: "You are a Linux Kernel and Security Specialist. Output raw code optimized for Ubuntu 24.04 LTS.",
      }
    });

    return response.text || "# Error generating script.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "# Error connecting to AI Security Engine: " + (error instanceof Error ? error.message : String(error));
  }
};

export const generateKeyLogic = async (config: KeyConfig): Promise<string> => {
  const prompt = `
    Create a Python script that generates a signed system license key.
    - Algorithm: ${config.algorithm}
    - Expiration: ${config.expiryDate}
    - Hardware Binding: ${config.hardwareBinding ? "Must bind to Machine ID (/etc/machine-id) and BIOS Serial" : "None"}
    - The script should output a license file verifyable by a PAM module.
  `;
  return generateSecurityScript(prompt);
};

export const generateHardwareLockScript = async (): Promise<string> => {
  const prompt = `
    Generate a script to:
    1. Install tpm2-tools.
    2. Read the current PCR values (0, 1, and 7 for BIOS/SecureBoot).
    3. Generate a LUKS key based on these PCR values (Hardware binding).
    4. Provide commands to enroll this key into a LUKS partition.
    This ensures the OS cannot boot if hardware/BIOS changes.
  `;
  return generateSecurityScript(prompt);
};