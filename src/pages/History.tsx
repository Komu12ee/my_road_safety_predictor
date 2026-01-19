import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HistoryRaw {
  input: any;
  processed: any;
  prediction: number;
  timestamp: string;
}

const History = () => {
  const [history, setHistory] = useState<HistoryRaw[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const itemsPerPage = 5;
  console.log("history wala code running  ")
  // -----------------------------
  // Correct Fetch URL
  // -----------------------------
  const fetchHistory = async () => {
    try {
      setIsRefreshing(true);

      const res = await fetch("http://localhost:5000/api/history"); // FIXED
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      setHistory(data.reverse());
     
      toast({
        title: "History Updated",
        description: "Latest prediction history loaded successfully",
      });
    } catch (error: any) {
      console.error("❌ Fetch Error:", error);

      toast({
        title: "Error Fetching History",
        description: error.message || "Cannot reach the backend",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // -----------------------------
  // Filter Logic
  // -----------------------------
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get("filter");

  useEffect(() => {
    fetchHistory();
  }, [filterType]); // re-fetch isn't strictly necessary if we filter client-side, but let's keep it simple for now or just filter client side.

  // Let's filter client-side since we fetch all data anyway
  const getFilteredHistory = () => {
    if (!history.length) return [];
    
    switch (filterType) {
      case "high":
        return history.filter(item => item.prediction > 50);
      case "low":
        return history.filter(item => item.prediction <= 50);
      default:
        return history;
    }
  };

  const filteredHistory = getFilteredHistory();

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredHistory.slice(startIndex, endIndex);

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Prediction History</h1>
            <p className="text-muted-foreground">Raw results returned from backend</p>
          </div>

          <Button onClick={fetchHistory} disabled={isRefreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Raw Prediction History</CardTitle>
            <CardDescription>Direct data from history.json</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Prediction</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {currentData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        No history found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentData.map((item: HistoryRaw, index: number) => {
                      const globalIndex = startIndex + index;
                      const isOpen = expandedRow === globalIndex;

                      return (
                        <>
                          {/* Main Row */}
                          <TableRow key={globalIndex}>
                            <TableCell className="font-medium">{item.timestamp}</TableCell>
                            <TableCell>{item.prediction.toFixed(2)}</TableCell>

                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleRow(globalIndex)}
                                className="flex items-center gap-1"
                              >
                                {isOpen ? (
                                  <>
                                    Hide <ChevronUp size={16} />
                                  </>
                                ) : (
                                  <>
                                    Show <ChevronDown size={16} />
                                  </>
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>

                          {/* Expandable JSON Row */}
                          {isOpen && (
                            <TableRow>
                              <TableCell colSpan={3}>
                                <div className="bg-muted p-4 rounded-lg space-y-4">

                                  <div>
                                    <h3 className="font-semibold">Input:</h3>
                                    <pre className="text-xs whitespace-pre-wrap bg-background p-2 rounded">
                                      {JSON.stringify(item.input, null, 2)}
                                    </pre>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold">Processed (model features):</h3>
                                    <pre className="text-xs whitespace-pre-wrap bg-background p-2 rounded">
                                      {JSON.stringify(item.processed, null, 2)}
                                    </pre>
                                  </div>

                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredHistory.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredHistory.length)} of{" "}
                {filteredHistory.length} entries
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4" />
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
