import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, History, User, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockChartData = [
  { day: "Mon", predictions: 12 },
  { day: "Tue", predictions: 19 },
  { day: "Wed", predictions: 15 },
  { day: "Thu", predictions: 25 },
  { day: "Fri", predictions: 22 },
  { day: "Sat", predictions: 18 },
  { day: "Sun", predictions: 10 },
];

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "User";

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
                <BarChart data={mockChartData}>
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
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">121</div>
                <p className="text-xs text-muted-foreground mt-1">+12 from last week</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  High Severity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">23</div>
                <p className="text-xs text-muted-foreground mt-1">19% of total</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  Low Severity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">98</div>
                <p className="text-xs text-muted-foreground mt-1">81% of total</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
