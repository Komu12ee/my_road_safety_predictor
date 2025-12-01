import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HistoryRecord {
  id: number;
  timestamp: string;
  weather: string;
  lighting: string;
  vehicle: string;
  severity: string;
}

const mockHistory: HistoryRecord[] = [
  {
    id: 1,
    timestamp: "2025-12-01 14:30",
    weather: "Clear",
    lighting: "Daylight",
    vehicle: "Car",
    severity: "Low Severity",
  },
  {
    id: 2,
    timestamp: "2025-12-01 13:15",
    weather: "Rainy",
    lighting: "Daylight",
    vehicle: "Truck",
    severity: "High Severity",
  },
  {
    id: 3,
    timestamp: "2025-12-01 11:45",
    weather: "Foggy",
    lighting: "Darkness - Lights Lit",
    vehicle: "Motorcycle",
    severity: "Medium Severity",
  },
  {
    id: 4,
    timestamp: "2025-11-30 22:00",
    weather: "Clear",
    lighting: "Darkness - No Lighting",
    vehicle: "Car",
    severity: "High Severity",
  },
  {
    id: 5,
    timestamp: "2025-11-30 18:30",
    weather: "Snowy",
    lighting: "Darkness - Lights Lit",
    vehicle: "Bus",
    severity: "Medium Severity",
  },
  {
    id: 6,
    timestamp: "2025-11-30 15:20",
    weather: "Clear",
    lighting: "Daylight",
    vehicle: "Bicycle",
    severity: "Low Severity",
  },
  {
    id: 7,
    timestamp: "2025-11-30 10:00",
    weather: "Windy",
    lighting: "Daylight",
    vehicle: "Car",
    severity: "Low Severity",
  },
  {
    id: 8,
    timestamp: "2025-11-29 20:45",
    weather: "Rainy",
    lighting: "Darkness - Lights Unlit",
    vehicle: "Truck",
    severity: "High Severity",
  },
];

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(mockHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = mockHistory.slice(startIndex, endIndex);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Data refreshed",
        description: "Prediction history has been updated",
      });
      setIsRefreshing(false);
    }, 1000);
  };

  const getSeverityVariant = (severity: string) => {
    if (severity.includes("High")) return "destructive";
    if (severity.includes("Medium")) return "default";
    return "secondary";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Prediction History</h1>
            <p className="text-muted-foreground">
              View all your past accident severity predictions
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Predictions</CardTitle>
            <CardDescription>
              All predictions are stored and can be reviewed anytime
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Weather</TableHead>
                    <TableHead>Lighting</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.timestamp}</TableCell>
                      <TableCell>{record.weather}</TableCell>
                      <TableCell>{record.lighting}</TableCell>
                      <TableCell>{record.vehicle}</TableCell>
                      <TableCell>
                        <Badge variant={getSeverityVariant(record.severity)}>
                          {record.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, mockHistory.length)} of{" "}
                {mockHistory.length} predictions
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default History;
