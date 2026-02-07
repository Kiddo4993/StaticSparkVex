import { useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Alert } from "@/react-app/components/ui/alert";
import { Upload, FileSpreadsheet, CheckCircle, XCircle } from "lucide-react";
import Navigation from "@/react-app/components/Navigation";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface ParsedMatch {
  match: string;
  redAlliance: string[];
  blueAlliance: string[];
  redScore: number;
  blueScore: number;
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parsedMatches, setParsedMatches] = useState<ParsedMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setParsedMatches([]);
      setError(null);
      setSuccess(false);
    }
  };

  const parseFile = async () => {
    if (!file) return;

    setParsing(true);
    setError(null);

    try {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (fileExtension === "csv") {
        const text = await file.text();
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const matches = parseMatchData(results.data);
            setParsedMatches(matches);
            setParsing(false);
          },
          error: () => {
            setError("Failed to parse CSV file");
            setParsing(false);
          },
        });
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstSheet);
        const matches = parseMatchData(data);
        setParsedMatches(matches);
        setParsing(false);
      } else {
        setError(
          "Unsupported file format. Please upload CSV or XLS/XLSX file."
        );
        setParsing(false);
      }
    } catch (err) {
      setError(
        "Failed to parse file: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
      setParsing(false);
    }
  };

  const parseMatchData = (data: any[]): ParsedMatch[] => {
    const matches: ParsedMatch[] = [];

    for (const row of data) {
      const match = row.Match || row.match || row.MATCH || "";
      const red1 = row["Red 1"] || row.red1 || row.RED1 || "";
      const red2 = row["Red 2"] || row.red2 || row.RED2 || "";
      const blue1 = row["Blue 1"] || row.blue1 || row.BLUE1 || "";
      const blue2 = row["Blue 2"] || row.blue2 || row.BLUE2 || "";
      const redScore = parseInt(
        row["Red Score"] || row.redScore || row.RED_SCORE || "0"
      );
      const blueScore = parseInt(
        row["Blue Score"] || row.blueScore || row.BLUE_SCORE || "0"
      );

      if (match && (red1 || red2 || blue1 || blue2)) {
        matches.push({
          match: match.toString(),
          redAlliance: [red1, red2].filter(Boolean),
          blueAlliance: [blue1, blue2].filter(Boolean),
          redScore: isNaN(redScore) ? 0 : redScore,
          blueScore: isNaN(blueScore) ? 0 : blueScore,
        });
      }
    }

    return matches;
  };

  const handleImport = async () => {
    setImporting(true);
    setError(null);

    try {
      const response = await fetch("/api/matches/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matches: parsedMatches }),
      });

      if (!response.ok) {
        throw new Error("Failed to import matches");
      }

      setSuccess(true);
      setImporting(false);
    } catch (err) {
      setError(
        "Failed to import matches: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
      setImporting(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 animate-fade-in">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Import Matches
            </h1>
            <p className="text-muted-foreground">
              Upload XLS or CSV files from Robot Events
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
            <Card className="bg-card border-border shadow-sm">
              <div className="p-10">
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-xl hover:border-primary/30 transition-colors">
                  <FileSpreadsheet className="w-12 h-12 text-muted-foreground mb-6" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Upload Match Data
                  </h3>
                  <p className="text-muted-foreground text-sm mb-8 text-center max-w-md leading-relaxed">
                    Select an XLS or CSV file exported from Robot Events
                    containing match results
                  </p>

                  <input
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button asChild variant="outline" size="lg">
                      <span className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </span>
                    </Button>
                  </label>

                  {file && (
                    <div className="mt-6 text-sm text-muted-foreground">
                      Selected:{" "}
                      <span className="font-medium text-foreground">
                        {file.name}
                      </span>
                    </div>
                  )}
                </div>

                {file && !parsedMatches.length && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      onClick={parseFile}
                      disabled={parsing}
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {parsing ? "Parsing..." : "Parse File"}
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {error && (
              <Alert
                variant="destructive"
                className="bg-red-50 border-red-200 text-red-900"
              >
                <XCircle className="w-4 h-4" />
                <div className="ml-2">{error}</div>
              </Alert>
            )}

            {success && (
              <Alert className="bg-emerald-50 border-emerald-200 text-emerald-900">
                <CheckCircle className="w-4 h-4" />
                <div className="ml-2">
                  Successfully imported {parsedMatches.length} matches!
                </div>
              </Alert>
            )}

            {parsedMatches.length > 0 && (
              <>
                <Card className="bg-card border-border shadow-sm">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-foreground">
                        Parsed Matches ({parsedMatches.length})
                      </h3>
                      <Button
                        onClick={handleImport}
                        disabled={importing || success}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {importing
                          ? "Importing..."
                          : success
                            ? "Imported"
                            : "Import All"}
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {parsedMatches.slice(0, 10).map((match, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-5 bg-secondary/50 rounded-lg"
                        >
                          <div className="flex items-center gap-6">
                            <span className="text-muted-foreground text-sm font-mono">
                              {match.match}
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="px-4 py-1.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                                {match.redAlliance.join(", ")}
                              </div>
                              <span className="text-muted-foreground/60">
                                vs
                              </span>
                              <div className="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                                {match.blueAlliance.join(", ")}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-red-700 font-medium">
                              {match.redScore}
                            </span>
                            <span className="text-muted-foreground/40">-</span>
                            <span className="text-blue-700 font-medium">
                              {match.blueScore}
                            </span>
                          </div>
                        </div>
                      ))}
                      {parsedMatches.length > 10 && (
                        <div className="text-center text-muted-foreground text-sm py-3">
                          And {parsedMatches.length - 10} more matches...
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                  <div className="p-8">
                    <h3 className="text-base font-medium text-foreground mb-4">
                      Expected File Format
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                      <p>Your file should contain columns with headers:</p>
                      <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                          <span className="text-foreground">•</span>
                          <div>
                            <span className="font-mono text-foreground">
                              Match
                            </span>{" "}
                            - Match identifier (e.g., "Q1", "Q2")
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-foreground">•</span>
                          <div>
                            <span className="font-mono text-foreground">
                              Red 1, Red 2
                            </span>{" "}
                            - Team numbers for red alliance
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-foreground">•</span>
                          <div>
                            <span className="font-mono text-foreground">
                              Blue 1, Blue 2
                            </span>{" "}
                            - Team numbers for blue alliance
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-foreground">•</span>
                          <div>
                            <span className="font-mono text-foreground">
                              Red Score, Blue Score
                            </span>{" "}
                            - Final scores
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
