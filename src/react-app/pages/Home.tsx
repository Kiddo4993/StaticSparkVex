import { Link } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Users, Upload, Target } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-7xl font-black mb-4 graffiti-logo">
            <span className="inline-block transform -rotate-2">SPARK</span>
            <span className="inline-block transform rotate-1 ml-2">VEX</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            VEX Robotics Alliance Selection System
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
            Powered by Bayesian Performance Modeling
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-16 animate-slide-up">
          <Link to="/teams" className="group">
            <Card className="h-full bg-card border-2 border-vexBlue hover:border-vexBlue/80 transition-all">
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-vexBlue text-white mb-6">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Team Rankings
                </h3>
                <p className="text-base text-muted-foreground">
                  View performance ratings with confidence levels
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/import" className="group">
            <Card className="h-full bg-card border-2 border-vexBrown hover:border-vexBrown/80 transition-all">
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-vexBrown text-white mb-6">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Import Matches
                </h3>
                <p className="text-base text-muted-foreground">
                  Upload XLS/CSV files from Robot Events
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/scouting" className="group">
            <Card className="h-full bg-card border-2 border-vexRed hover:border-vexRed/80 transition-all">
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-vexRed text-white mb-6">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Scouting Data
                </h3>
                <p className="text-base text-muted-foreground">
                  Track autonomous and calculate synergy
                </p>
              </div>
            </Card>
          </Link>
        </div>

        <Card className="max-w-5xl mx-auto bg-card border-2 border-border animate-slide-up">
          <div className="p-10">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Why Bayesian Performance Modeling?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-l-4 border-vexBlue pl-6">
                <h3 className="font-bold text-foreground mb-3 text-lg">
                  Beyond Simple Rankings
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Provides both team strength estimates and confidence levels,
                  helping you identify which teams need more scouting.
                </p>
              </div>
              <div className="border-l-4 border-vexRed pl-6">
                <h3 className="font-bold text-foreground mb-3 text-lg">
                  Accounts for Chaos
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Automatically detects anomalies like disqualifications or
                  equipment failures, preventing outliers from skewing ratings.
                </p>
              </div>
              <div className="border-l-4 border-vexBrown pl-6">
                <h3 className="font-bold text-foreground mb-3 text-lg">
                  Fair Credit Distribution
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Stronger alliance partners receive proportionally more credit
                  for wins, accurately reflecting carry dynamics.
                </p>
              </div>
              <div className="border-l-4 border-vexBlue pl-6">
                <h3 className="font-bold text-foreground mb-3 text-lg">
                  Synergy Calculations
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Combine performance ratings with scouting data to identify
                  ideal alliance partners.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
