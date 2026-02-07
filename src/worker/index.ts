import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

const matchSchema = z.object({
  matches: z.array(
    z.object({
      match: z.string(),
      redAlliance: z.array(z.string()),
      blueAlliance: z.array(z.string()),
      redScore: z.number(),
      blueScore: z.number(),
    })
  ),
});

app.post(
  "/api/matches/import",
  zValidator("json", matchSchema),
  async (c) => {
    const { matches } = c.req.valid("json");

    // For now, just return success
    // In next step, we'll add database storage and Bayesian calculation
    console.log(`Importing ${matches.length} matches`);

    return c.json({ success: true, imported: matches.length });
  }
);

// Temporary stub data for initial UI
app.get("/api/teams", (c) => {
  const stubTeams = [
    {
      id: 1,
      teamNumber: "886W",
      teamName: "Wildcats",
      rating: 1847.3,
      uncertainty: 12.5,
      matchesPlayed: 18,
      autoSide: "left",
      autoStrength: 85,
      rank: 1,
    },
    {
      id: 2,
      teamNumber: "1234A",
      teamName: "Thunder",
      rating: 1792.8,
      uncertainty: 15.2,
      matchesPlayed: 16,
      autoSide: "right",
      autoStrength: 78,
      rank: 2,
    },
    {
      id: 3,
      teamNumber: "5678B",
      teamName: "Phoenix",
      rating: 1745.6,
      uncertainty: 18.9,
      matchesPlayed: 14,
      autoSide: "left",
      autoStrength: 92,
      rank: 3,
    },
    {
      id: 4,
      teamNumber: "9101C",
      teamName: "Titans",
      rating: 1698.2,
      uncertainty: 22.1,
      matchesPlayed: 12,
      autoSide: null,
      autoStrength: null,
      rank: 4,
    },
    {
      id: 5,
      teamNumber: "2468D",
      teamName: "Spartans",
      rating: 1654.7,
      uncertainty: 28.5,
      matchesPlayed: 9,
      autoSide: "right",
      autoStrength: 65,
      rank: 5,
    },
    {
      id: 6,
      teamNumber: "3579E",
      teamName: "Eagles",
      rating: 1589.3,
      uncertainty: 35.8,
      matchesPlayed: 6,
      autoSide: null,
      autoStrength: null,
      rank: 6,
    },
  ];

  return c.json(stubTeams);
});

app.get("/api/scouting", (c) => {
  const stubScouting = [
    {
      teamNumber: "886W",
      autoSide: "left",
      autoStrength: 85,
      driverSkill: 90,
    },
    {
      teamNumber: "1234A",
      autoSide: "right",
      autoStrength: 78,
      driverSkill: 82,
    },
    {
      teamNumber: "5678B",
      autoSide: "left",
      autoStrength: 92,
      driverSkill: 88,
    },
  ];

  return c.json(stubScouting);
});

app.post("/api/scouting", async (c) => {
  const body = await c.req.json();
  return c.json(body);
});

export default app;
