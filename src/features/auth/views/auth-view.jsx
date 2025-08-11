"use client";

import { useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/features/auth/components/login-form";
import { SignupForm } from "@/features/auth/components/signup-form";

export function AuthView() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-background flex min-h-dvh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to your account to continue"
              : "Sign up to get started with your account"}
          </CardDescription>
        </CardHeader>

        {isLogin ? <LoginForm /> : <SignupForm />}

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-muted-foreground text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full"
          >
            {isLogin ? "Sign up here" : "Sign in here"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
