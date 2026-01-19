import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, History, User, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

interface PredictionHistory {
  date: string;
  input: any;
  prediction: number;
  processed: any;
  timestamp: string;
}

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "User";
  console.log(userName);

  const [stats, setStats] = useState({
    total: 0,
    highSeverity: 0,
    lowSeverity: 0,
    highPercentage: 0,
    lowPercentage: 0
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/history");
        const data: PredictionHistory[] = await response.json();

        // Calculate Stats
        const total = data.length;
        const highSeverity = data.filter(item => item.prediction > 50).length;
        const lowSeverity = total - highSeverity;

        setStats({
          total,
          highSeverity,
          lowSeverity,
          highPercentage: total > 0 ? Math.round((highSeverity / total) * 100) : 0,
          lowPercentage: total > 0 ? Math.round((lowSeverity / total) * 100) : 0
        });

        // Process Chart Data (Last 7 Days)
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const last7Days = new Map<string, number>();
        
        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dayName = days[d.getDay()];
          last7Days.set(dayName, 0);
        }

        // Fill with actual data
        data.forEach(item => {
          const date = new Date(item.timestamp);
          const dayName = days[date.getDay()];
          if (last7Days.has(dayName)) {
            last7Days.set(dayName, (last7Days.get(dayName) || 0) + 1);
          }
        });

        const formattedChartData = Array.from(last7Days).map(([day, count]) => ({
          day,
          predictions: count
        }));

        setChartData(formattedChartData);

      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
          <p className="text-muted-foreground">
            Predict road accident severity using machine learning
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/predict">
            <Card className="shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-2">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Make a Prediction</CardTitle>
                <CardDescription>
                  Input accident parameters to predict severity level
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/history">
            <Card className="shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-2">
                  <History className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Prediction History</CardTitle>
                <CardDescription>
                  View all your past predictions and results
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-2">
                  <User className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Predictions
              </CardTitle>
              <CardDescription>Your prediction activity over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="predictions" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="space-y-4">
            <Link to="/history">
              <Card className="shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime total</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/history?filter=high">
              <Card className="shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    High Severity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.highSeverity}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stats.highPercentage}% of total</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/history?filter=low">
              <Card className="shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Low Severity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.lowSeverity}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stats.lowPercentage}% of total</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
