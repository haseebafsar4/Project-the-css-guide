import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// We will build the dynamic prompt inside the handler now
const getSystemPrompt = (adminInstructions: string) => `
You are an expert English writing evaluator for CSS aspirants. Evaluate strictly and professionally on 9 criteria. 
Each criterion is scored 0-10 (overall sum, max 90).

GRADE SCALE: A+ (85-90), A (75-84), B (60-74), C (45-59), D (0-44).

CRITICAL ADMIN MASTER RULES:
"${adminInstructions}"
(You MUST prioritize these rules above all else. If the admin rules conflict with standard grading, follow the admin).

Always return the improvedVersion as a fully rewritten paragraph. Issues must match exact substrings for highlighting.
`;

const evaluationTool = {
  type: "function",
  function: {
    name: "submit_evaluation",
    description: "Submit the structured English paragraph evaluation",
    parameters: {
      type: "object",
      properties: {
        overallScore: { type: "number" },
        grade: { type: "string", enum: ["A+", "A", "B", "C", "D"] },
        summary: { type: "string" },
        criteria: {
          type: "object",
          properties: {
            spelling: criterionSchema(),
            grammar: criterionSchema(),
            vocabulary: criterionSchema(),
            topicRelevance: criterionSchema(),
            structure: criterionSchema(),
            coherence: criterionSchema(),
            flow: criterionSchema(),
            keywords: criterionSchema(),
            clarity: criterionSchema(),
          },
          required: ["spelling","grammar","vocabulary","topicRelevance","structure","coherence","flow","keywords","clarity"],
        },
        highlights: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              type: { type: "string", enum: ["grammar","spelling","vocabulary","good"] },
              explanation: { type: "string" },
            },
            required: ["text","type","explanation"],
          },
        },
        improvedVersion: { type: "string" },
      },
      required: ["overallScore","grade","summary","criteria","highlights","improvedVersion"],
    },
  },
};

function criterionSchema() {
  return {
    type: "object",
    properties: {
      score: { type: "number" },
      feedback: { type: "string" },
      issues: { type: "array", items: { type: "string" } },
      suggestions: { type: "array", items: { type: "string" } },
    },
    required: ["score","feedback","issues","suggestions"],
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // 1. Accept adminPrompt from your Evaluate.tsx
    const { topic, paragraph, adminPrompt } = await req.json();
    
    if (!topic || !paragraph) {
      return new Response(JSON.stringify({ error: "Missing data" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // 2. Use the custom system prompt with Admin Instructions
    const customSystemPrompt = getSystemPrompt(adminPrompt || "Grade based on standard CSS criteria.");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash", // Ensure this matches your gateway's supported models
        messages: [
          { role: "system", content: customSystemPrompt },
          { role: "user", content: `Topic: ${topic}\n\nParagraph:\n${paragraph}` },
        ],
        tools: [evaluationTool],
        tool_choice: { type: "function", function: { name: "submit_evaluation" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: "AI Gateway Error", details: errorText }), {
        status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) throw new Error("Invalid AI response");

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ result }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
