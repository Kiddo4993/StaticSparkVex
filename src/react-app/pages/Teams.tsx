import { useState, useEffect } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Progress } from "@/react-app/components/ui/progress";
import Navigation from "@/react-app/components/Navigation";

interface Team {
  id: number;
  teamNumber: string;
  teamName: string;
  rating: number;
  uncertainty: number;
  matchesPlayed: number;
  autoSide: string | null;
  autoStrength: number | null;
  rank: number;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getConfidenceLevel = (uncertainty: number) => {
    if (uncertainty < 15) return "high";
    if (uncertainty < 30) return "medium";
    return "low";
  };

  const confidencePercentage = (uncertainty: number) => {
    return Math.max(0, Math.min(100, 100 - (uncertainty / 50) * 100));
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background flex items-center justify-center pt-20">
          <div className="text-muted-foreground">Loading teams...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 animate-fade-in">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Team Rankings
            </h1>
            <p className="text-muted-foreground">
              Bayesian Performance Model with confidence ratings
            </p>
          </div>

          <div className="space-y-4 animate-slide-up">
            {teams.map((team) => {
              const confidence = confidencePercentage(team.uncertainty);
              const confidenceLevel = getConfidenceLevel(team.uncertainty);

              return (
                <Card
                  key={team.id}
                  className="bg-card border-border hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="text-center min-w-[50px]">
                          <div className="text-2xl font-medium text-muted-foreground">
                            #{team.rank}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-medium text-foreground">
                              {team.teamNumber}
                            </h3>
                            <span className="text-muted-foreground text-sm">
                              {team.teamName}
                            </span>
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                Rating:
                              </span>
                              <span className="font-mono font-medium text-foreground">
                                {team.rating.toFixed(1)}
                              </span>
                              <span className="text-muted-foreground/60">
                                ± {team.uncertainty.toFixed(1)}
                              </span>
                            </div>

                            <div className="h-4 w-px bg-border" />

                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                Matches:
                              </span>
                              <span className="text-foreground">
                                {team.matchesPlayed}
                              </span>
                            </div>

                            {team.autoSide && (
                              <>
                                <div className="h-4 w-px bg-border" />
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-secondary"
                                >
                                  {team.autoSide} auto
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="min-w-[160px]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            Confidence
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              confidenceLevel === "high"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : confidenceLevel === "medium"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {confidenceLevel}
                          </Badge>
                        </div>
                        <Progress
                          value={confidence}
                          className="h-1.5 bg-secondary"
                        />
                        <div className="text-xs text-muted-foreground mt-1.5 text-right">
                          {confidence.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {teams.length === 0 && (
            <Card className="bg-card border-border p-12 text-center">
              <p className="text-muted-foreground">
                No teams yet. Import match data to get started.
              </p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
