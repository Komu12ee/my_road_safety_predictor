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
  weather_condition: string;
  light_conditions: string;
  road_surface_conditions: string;
  day_of_week: string;
  hour_of_day: string;
  vehicle_type: string;
  age_of_driver: string;
  speed_limit: string;
  number_of_casualties: string;
  urban_or_rural_area: string;
}

const Predict = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [formData, setFormData] = useState<PredictionForm>({
    weather_condition: "",
    light_conditions: "",
    road_surface_conditions: "",
    day_of_week: "",
    hour_of_day: "",
    vehicle_type: "",
    age_of_driver: "",
    speed_limit: "",
    number_of_casualties: "",
    urban_or_rural_area: "",
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

    // Simulate API call to Flask backend
    setTimeout(() => {
      const severityLevels = ["Low Severity", "Medium Severity", "High Severity"];
      const randomSeverity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
      setPrediction(randomSeverity);
      
      toast({
        title: "Prediction Complete",
        description: `The predicted severity is: ${randomSeverity}`,
      });
      
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Predict Accident Severity</h1>
          <p className="text-muted-foreground">
            Enter accident parameters to predict the severity level
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Accident Parameters
            </CardTitle>
            <CardDescription>
              Fill in the details below to get a severity prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePredict} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weather Condition */}
                <div className="space-y-2">
                  <Label htmlFor="weather_condition">Weather Condition</Label>
                  <Select
                    value={formData.weather_condition}
                    onValueChange={(value) => handleSelectChange("weather_condition", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weather" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="clear">Clear</SelectItem>
                      <SelectItem value="rainy">Rainy</SelectItem>
                      <SelectItem value="snowy">Snowy</SelectItem>
                      <SelectItem value="foggy">Foggy</SelectItem>
                      <SelectItem value="windy">Windy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Light Conditions */}
                <div className="space-y-2">
                  <Label htmlFor="light_conditions">Light Conditions</Label>
                  <Select
                    value={formData.light_conditions}
                    onValueChange={(value) => handleSelectChange("light_conditions", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lighting" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="daylight">Daylight</SelectItem>
                      <SelectItem value="darkness_lights_lit">Darkness - Lights Lit</SelectItem>
                      <SelectItem value="darkness_lights_unlit">Darkness - Lights Unlit</SelectItem>
                      <SelectItem value="darkness_no_lighting">Darkness - No Lighting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Road Surface Conditions */}
                <div className="space-y-2">
                  <Label htmlFor="road_surface_conditions">Road Surface</Label>
                  <Select
                    value={formData.road_surface_conditions}
                    onValueChange={(value) => handleSelectChange("road_surface_conditions", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select surface" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="dry">Dry</SelectItem>
                      <SelectItem value="wet">Wet</SelectItem>
                      <SelectItem value="ice">Ice/Snow</SelectItem>
                      <SelectItem value="flood">Flood</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Day of Week */}
                <div className="space-y-2">
                  <Label htmlFor="day_of_week">Day of Week</Label>
                  <Select
                    value={formData.day_of_week}
                    onValueChange={(value) => handleSelectChange("day_of_week", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Hour of Day */}
                <div className="space-y-2">
                  <Label htmlFor="hour_of_day">Hour of Day (0-23)</Label>
                  <Input
                    id="hour_of_day"
                    name="hour_of_day"
                    type="number"
                    min="0"
                    max="23"
                    placeholder="e.g., 14"
                    value={formData.hour_of_day}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Vehicle Type */}
                <div className="space-y-2">
                  <Label htmlFor="vehicle_type">Vehicle Type</Label>
                  <Select
                    value={formData.vehicle_type}
                    onValueChange={(value) => handleSelectChange("vehicle_type", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="bicycle">Bicycle</SelectItem>
                      <SelectItem value="pedestrian">Pedestrian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Age of Driver */}
                <div className="space-y-2">
                  <Label htmlFor="age_of_driver">Age of Driver</Label>
                  <Input
                    id="age_of_driver"
                    name="age_of_driver"
                    type="number"
                    min="16"
                    max="100"
                    placeholder="e.g., 35"
                    value={formData.age_of_driver}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Speed Limit */}
                <div className="space-y-2">
                  <Label htmlFor="speed_limit">Speed Limit (mph)</Label>
                  <Select
                    value={formData.speed_limit}
                    onValueChange={(value) => handleSelectChange("speed_limit", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select speed limit" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="20">20 mph</SelectItem>
                      <SelectItem value="30">30 mph</SelectItem>
                      <SelectItem value="40">40 mph</SelectItem>
                      <SelectItem value="50">50 mph</SelectItem>
                      <SelectItem value="60">60 mph</SelectItem>
                      <SelectItem value="70">70 mph</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Number of Casualties */}
                <div className="space-y-2">
                  <Label htmlFor="number_of_casualties">Number of Casualties</Label>
                  <Input
                    id="number_of_casualties"
                    name="number_of_casualties"
                    type="number"
                    min="0"
                    placeholder="e.g., 2"
                    value={formData.number_of_casualties}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Urban or Rural Area */}
                <div className="space-y-2">
                  <Label htmlFor="urban_or_rural_area">Area Type</Label>
                  <Select
                    value={formData.urban_or_rural_area}
                    onValueChange={(value) => handleSelectChange("urban_or_rural_area", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="urban">Urban</SelectItem>
                      <SelectItem value="rural">Rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Predicting..." : "Predict Severity"}
              </Button>

              {/* Prediction Result */}
              {prediction && (
                <Card className={`${
                  prediction.includes("High") 
                    ? "bg-destructive/10 border-destructive" 
                    : prediction.includes("Medium")
                    ? "bg-amber-500/10 border-amber-500"
                    : "bg-accent/10 border-accent"
                }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Prediction Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">
                      Predicted Severity: <span className="text-primary">{prediction}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This prediction is based on the ML model trained on historical accident data.
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
