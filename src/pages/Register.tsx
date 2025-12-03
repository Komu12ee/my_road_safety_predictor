
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Form validations
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://172.16.204.149:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Registration successful",
          description: "Please sign in with your credentials.",
        });

        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Cannot reach server");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-card hover:shadow-hover transition-all duration-300">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up to start predicting accident severity</CardDescription>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;





// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { AlertCircle, Activity } from "lucide-react";
// import { toast } from "@/hooks/use-toast";

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       toast({
//         title: "Registration successful",
//         description: "Please sign in with your credentials",
//       });
//       navigate("/login");
//       setIsLoading(false);
//     }, 1000);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-4">
//       <Card className="w-full max-w-md shadow-card hover:shadow-hover transition-all duration-300">
//         <CardHeader className="space-y-3 text-center">
//           <div className="mx-auto w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
//             <Activity className="h-6 w-6 text-white" />
//           </div>
//           <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
//           <CardDescription>Sign up to start predicting accident severity</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleRegister}>
//           <CardContent className="space-y-4">
//             {error && (
//               <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
//                 <AlertCircle className="h-4 w-4" />
//                 {error}
//               </div>
//             )}
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input
//                 id="name"
//                 name="name"
//                 placeholder="John Doe"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="your.email@example.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm Password</Label>
//               <Input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 placeholder="••••••••"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4">
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Creating Account..." : "Create Account"}
//             </Button>
//             <div className="text-sm text-center text-muted-foreground">
//               Already have an account?{" "}
//               <Link to="/login" className="text-primary hover:underline font-medium">
//                 Sign In
//               </Link>
//             </div>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   );
// };

// export default Register;
