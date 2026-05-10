// Edge function: evaluate an English paragraph using Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert English writing evaluator for CSS aspirants and English learners. Evaluate strictly and professionally on 9 criteria. Each criterion is scored 0-10 (overall is the sum, max 90).

Grade scale: A+ (85-90), A (75-84), B (60-74), C (45-59), D (0-44).

Be specific and constructive. Issues must be exact phrases from the paragraph. Highlights "text" must match exact substrings of the paragraph for client-side highlighting. Always return the improvedVersion as a fully rewritten paragraph (same topic, polished English).`;

const evaluationTool = {
  type: "function",
  function: {
    name: "submit_evaluation",
    description: "Submit the structured English paragraph evaluation",
    parameters: {
      type: "object",
      properties: {
        overallScore: { type: "number", description: "0-90" },
        grade: { type: "string", enum: ["A+", "A", "B", "C", "D"] },
        summary: { type: "string", description: "2-3 sentence overall assessment" },
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
          additionalProperties: false,
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
            additionalProperties: false,
          },
        },
        improvedVersion: { type: "string" },
      },
      required: ["overallScore","grade","summary","criteria","highlights","improvedVersion"],
      additionalProperties: false,
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
    additionalProperties: false,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, paragraph } = await req.json();
    if (!topic || !paragraph || typeof topic !== "string" || typeof paragraph !== "string") {
      return new Response(JSON.stringify({ error: "Missing topic or paragraph" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (paragraph.trim().split(/\s+/).length < 30) {
      return new Response(JSON.stringify({ error: "Paragraph must be at least 30 words" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Topic: ${topic}\n\nParagraph:\n${paragraph}` },
        ],
        tools: [evaluationTool],
        tool_choice: { type: "function", function: { name: "submit_evaluation" } },
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI evaluation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Invalid AI response" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ result }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-paragraph error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
