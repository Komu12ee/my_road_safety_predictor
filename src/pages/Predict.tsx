import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PredictionForm {
  road_type: string;
  num_lanes: string;
  curvature: string;
  speed_limit: string;
  lighting: string;
  weather: string;
  road_signs_present: string;
  public_road: string;
  time_of_day: string;
  holiday: string;
  school_season: string;
  num_reported_accidents: string;
}

const BACKEND_BASE = "http://172.16.204.149:5000";

const Predict = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const [formData, setFormData] = useState<PredictionForm>({
    road_type: "",
    num_lanes: "",
    curvature: "",
    speed_limit: "",
    lighting: "",
    weather: "",
    road_signs_present: "",
    public_road: "",
    time_of_day: "",
    holiday: "",
    school_season: "",
    num_reported_accidents: ""
  });

  const handleSelectChange = (field: keyof PredictionForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);

    try {
      const payload = {
        road_type: formData.road_type,
        num_lanes: Number(formData.num_lanes),
        curvature: Number(formData.curvature),
        speed_limit: Number(formData.speed_limit),
        lighting: formData.lighting,
        weather: formData.weather,
        road_signs_present: formData.road_signs_present,  
        public_road: formData.public_road,                
        time_of_day: formData.time_of_day,                
        holiday: formData.holiday,
        school_season: formData.school_season,
        num_reported_accidents: Number(formData.num_reported_accidents)
      };

      console.log("Sending predict payload:", payload);

      const res = await fetch(`${BACKEND_BASE}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (!res.ok) {
        toast({
          title: "Prediction failed",
          description: data.error || data.message || "Unknown error.",
        });
        return;
      }

      const severity = String(data.severity_prediction);
      setPrediction(severity);

      toast({
        title: "Prediction Complete",
        description: `Predicted Severity: ${severity}`,
      });

    } catch (err: any) {
      toast({
        title: "Prediction Error",
        description: err.message || "Backend not reachable.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Predict Accident Severity</h1>
          <p className="text-muted-foreground">
            Provide accident parameters to calculate severity risk
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Accident Parameters
            </CardTitle>
            <CardDescription>Fill all fields to get prediction</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handlePredict} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Road Type */}
                <div className="space-y-2">
                  <Label>Road Type</Label>
                  <Select
                    value={formData.road_type}
                    onValueChange={(v) => handleSelectChange("road_type", v)}
                    required
                  >
                    <SelectTrigger><SelectValue placeholder="Select road type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highway">highway</SelectItem>
                      <SelectItem value="urban">urban</SelectItem>
                      <SelectItem value="rural">rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Number of Lanes */}
                <div>
                  <Label>Number of Lanes</Label>
                  <Input
                    name="num_lanes"
                    type="number"
                    value={formData.num_lanes}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Curvature */}
                <div>
                  <Label>Curvature</Label>
                  <Input
                    name="curvature"
                    type="number"
                    value={formData.curvature}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Speed Limit */}
                <div>
                  <Label>Speed Limit</Label>
                  <Input
                    name="speed_limit"
                    type="number"
                    value={formData.speed_limit}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Lighting */}
                <div className="space-y-2">
                  <Label>Lighting</Label>
                  <Select
                    value={formData.lighting}
                    onValueChange={(v) => handleSelectChange("lighting", v)}
                    required
                  >
                    <SelectTrigger><SelectValue placeholder="Select lighting" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daylight">Daylight</SelectItem>
                      <SelectItem value="dim">Night - Lit</SelectItem>
                      <SelectItem value="night">Night - No Lights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Weather */}
                <div className="space-y-2">
                  <Label>Weather</Label>
                  <Select
                    value={formData.weather}
                    onValueChange={(v) => handleSelectChange("weather", v)}
                    required
                  >
                    <SelectTrigger><SelectValue placeholder="Select weather" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">Clear</SelectItem>
                      <SelectItem value="rainy">Rainy</SelectItem>
                      {/* <SelectItem value="snow">Snow</SelectItem> */}
                      <SelectItem value="foggy">Foggy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Road Signs Present */}
                <div className="space-y-2">
                  <Label>Road Signs Present</Label>
                  <Select
                    value={formData.road_signs_present}
                    onValueChange={(v) => handleSelectChange("road_signs_present", v)}
                    required
                  >
                    <SelectTrigger><SelectValue placeholder="Yes / No" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Public Road */}
                <div className="space-y-2">
                  <Label>Public Road</Label>
                  <Select
                    value={formData.public_road}
                    onValueChange={(v) => handleSelectChange("public_road", v)}
                    required
                  >
                    <SelectTrigger><SelectValue placeholder="Yes / No" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time of Day */}
                <div className="space-y-2">
                  <Label>Time of Day</Label>
                  <Select
                    value={formData.time_of_day}
                    onValueChange={(v) => handleSelectChange("time_of_day", v)}
                    required
                  >
                    <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Holiday */}
                <div className="space-y-2">
                  <Label>Holiday</Label>
                  <Select
                    value={formData.holiday}
                    onValueChange={(v) => handleSelectChange("holiday", v)}
                    required
                  >
                    <SelectTrigger><SelectValue placeholder="Holiday?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* School Season */}
                <div className="space-y-2">
                  <Label>School Season</Label>
                  <Select
                    value={formData.school_season}
                    onValueChange={(v) => handleSelectChange("school_season", v)}
                    required
                  >
                    <SelectTrigger><SelectValue placeholder="Select season"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Num Reported Accidents */}
                <div>
                  <Label>Number of Reported Accidents</Label>
                  <Input
                    name="num_reported_accidents"
                    type="number"
                    value={formData.num_reported_accidents}
                    onChange={handleInputChange}
                    required
                  />
                </div>

              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Predicting..." : "Predict Severity"}
              </Button>

              {prediction && (
                <Card
                  className={`${
                    prediction.includes("High")
                      ? "bg-destructive/10 border-destructive"
                      : prediction.includes("Medium")
                      ? "bg-amber-500/10 border-amber-500"
                      : "bg-accent/10 border-accent"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Prediction Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">
                      Severity Risk in (%): <span className="text-primary">{prediction}</span>
                    </p>
                  </CardContent>
                </Card>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Predict;
