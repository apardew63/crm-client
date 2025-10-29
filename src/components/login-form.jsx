"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { IconMail, IconLock, IconEye, IconEyeOff, IconBrandGithub } from "@tabler/icons-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const URL = process.env.NEXT_PUBLIC_URL;
  const PRODUCTION_URL = process.env.PRODUCTION_URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(URL, "URL")

    try {
      // const response = await fetch('https://adnan4498-infinitum-crm-server-glob.vercel.app/api/auth/login', {
      // const response = await fetch(`${PRODUCTION_URL}/api/auth/login`, {
      const response = await fetch(`${URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log(response, "rrr")

      const data = await response.json();

      if (response.ok && data.success) {
        // Use auth context to handle login
        login(data.data.user, data.data.tokens);

        toast.success(data.message || "Login successful!");
        router.push("/dashboard");
      } else {
        toast.error(data.error || data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-medium hover:shadow-soft transition-all duration-300 animate-fade-in glass-effect">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-earth-brown flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary-foreground"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-earth-brown bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to your Infinitum CRM account
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" {...props}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <IconMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 font-medium" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button 
              type="button"
              variant="outline" 
              className="w-full h-11 font-medium"
            >
              <IconBrandGithub className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a 
                href="/signup" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Create account
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
