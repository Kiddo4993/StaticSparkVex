import { useState, useEffect } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";
import { Button } from "@/react-app/components/ui/button";
import { Label } from "@/react-app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";
import { Badge } from "@/react-app/components/ui/badge";
import Navigation from "@/react-app/components/Navigation";
import { Target, TrendingUp } from "lucide-react";

interface ScoutingData {
  teamNumber: string;
  autoSide: string;
  autoStrength: number;
  driverSkill: number;
  synergy?: number;
}

export default function ScoutingPage() {
  const [teams, setTeams] = useState<ScoutingData[]>([]);
  const [formData, setFormData] = useState<ScoutingData>({
    teamNumber: "",
    autoSide: "",
    autoStrength: 50,
    driverSkill: 50,
  });

  useEffect(() => {
    fetch("/api/scouting")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/scouting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newTeam = await response.json();
        setTeams([...teams, newTeam]);
        setFormData({
          teamNumber: "",
          autoSide: "",
          autoStrength: 50,
          driverSkill: 50,
        });
      }
    } catch (error) {
      console.error("Failed to save scouting data:", error);
    }
  };

  const calculateSynergy = (team1: ScoutingData, team2: ScoutingData) => {
    let synergy = 50;
    
    if (team1.autoSide !== team2.autoSide && team1.autoSide && team2.autoSide) {
      synergy += 20;
    }
    
    const avgStrength = (team1.autoStrength + team2.autoStrength) / 2;
    synergy += (avgStrength - 50) * 0.3;
    
    return Math.min(100, Math.max(0, synergy));
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Scouting Data
            </h1>
            <p className="text-muted-foreground text-lg">
              Track team autonomous performance and calculate alliance synergy
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="bg-card border-2 border-vexBlue sticky top-24">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-vexBlue" />
                    Add Team Data
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="teamNumber" className="text-base font-bold">
                        Team Number
                      </Label>
                      <Input
                        id="teamNumber"
                        value={formData.teamNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, teamNumber: e.target.value })
                        }
                        placeholder="e.g., 886W"
                        required
                        className="mt-1.5 border-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="autoSide" className="text-base font-bold">
                        Autonomous Side
                      </Label>
                      <Select
                        value={formData.autoSide}
                        onValueChange={(value) =>
                          setFormData({ ...formData, autoSide: value })
                        }
                      >
                        <SelectTrigger className="mt-1.5 border-2">
                          <SelectValue placeholder="Select side" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="autoStrength" className="text-base font-bold">
                        Autonomous Strength: {formData.autoStrength}%
                      </Label>
                      <Input
                        id="autoStrength"
                        type="range"
                        min="0"
                        max="100"
                        value={formData.autoStrength}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            autoStrength: parseInt(e.target.value),
                          })
                        }
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="driverSkill" className="text-base font-bold">
                        Driver Skill: {formData.driverSkill}%
                      </Label>
                      <Input
                        id="driverSkill"
                        type="range"
                        min="0"
                        max="100"
                        value={formData.driverSkill}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            driverSkill: parseInt(e.target.value),
                          })
                        }
                        className="mt-1.5"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-vexBlue text-white hover:bg-vexBlue/90 border-2 border-vexBlue"
                      size="lg"
                    >
                      Add Team
                    </Button>
                  </form>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-4 animate-slide-up">
              {teams.map((team, idx) => (
                <Card
                  key={idx}
                  className="bg-card border-2 border-border hover:border-vexBrown transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {team.teamNumber}
                        </h3>
                        <Badge
                          variant="outline"
                          className="mt-2 border-2 border-vexBlue text-vexBlue bg-vexBlue/10"
                        >
                          {team.autoSide} autonomous
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">
                          Overall Score
                        </div>
                        <div className="text-3xl font-bold text-vexBlue">
                          {Math.round(
                            (team.autoStrength + team.driverSkill) / 2
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-border">
                      <div>
                        <div className="text-sm text-muted-foreground mb-2 font-bold">
                          Auto Strength
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 bg-secondary border-2 border-border">
                            <div
                              className="h-full bg-vexRed"
                              style={{ width: `${team.autoStrength}%` }}
                            />
                          </div>
                          <span className="text-lg font-bold text-foreground min-w-[45px]">
                            {team.autoStrength}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground mb-2 font-bold">
                          Driver Skill
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 bg-secondary border-2 border-border">
                            <div
                              className="h-full bg-vexBlue"
                              style={{ width: `${team.driverSkill}%` }}
                            />
                          </div>
                          <span className="text-lg font-bold text-foreground min-w-[45px]">
                            {team.driverSkill}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {teams.length === 0 && (
                <Card className="bg-card border-2 border-dashed border-border p-16 text-center">
                  <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No scouting data yet. Add teams using the form on the left.
                  </p>
                </Card>
              )}

              {teams.length >= 2 && (
                <Card className="bg-vexBlue/10 border-2 border-vexBlue">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-vexBlue" />
                      Alliance Synergy Suggestions
                    </h3>
                    <div className="space-y-3">
                      {teams.slice(0, 3).map((team1, i) =>
                        teams.slice(i + 1, 4).map((team2, j) => {
                          const synergy = calculateSynergy(team1, team2);
                          return (
                            <div
                              key={`${i}-${j}`}
                              className="flex items-center justify-between p-4 bg-card border-2 border-border"
                            >
                              <div className="flex items-center gap-4">
                                <span className="font-bold text-lg text-foreground">
                                  {team1.teamNumber}
                                </span>
                                <span className="text-muted-foreground">+</span>
                                <span className="font-bold text-lg text-foreground">
                                  {team2.teamNumber}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">
                                  Synergy:
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-base font-bold border-2 ${
                                    synergy >= 70
                                      ? "bg-vexBlue/20 text-vexBlue border-vexBlue"
                                      : synergy >= 50
                                        ? "bg-vexBrown/20 text-vexBrown border-vexBrown"
                                        : "bg-vexRed/20 text-vexRed border-vexRed"
                                  }`}
                                >
                                  {Math.round(synergy)}%
                                </Badge>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
