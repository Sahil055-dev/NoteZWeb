"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Logo from "@/app/Components/Logo";
import { Card } from "@/components/ui/card";
import useIsSmallScreen from "@/app/hooks/isSmallScreen";
import { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import supabase from "@/app/API/supabase";
import { useRouter } from "next/navigation";

type formDataType = {
  email: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const isSmallScreen = useIsSmallScreen();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<{ show: boolean }>({
    show: false,
  });
  const [formData, setFormData] = useState<formDataType>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // Redirect to the Details Page
    router.push("/mainpages/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <section className="flex flex-1 items-center justify-center px-4 py-16 md:py-32">
        <div className="w-full max-w-sm md:max-w-xl lg:max-w-2xl flex flex-col items-center text-center">
          <div className="mb-8 mt-8 md:mt-0">
            <span className="flex gap-4 justify-center items-baseline">
              <h1 className="text-xl md:text-4xl font-semibold text-foreground">
                Welcome To
              </h1>
              <Logo size={isSmallScreen ? "small" : "medium"} />
            </span>

            <p className="text-muted-foreground mt-2 text-sm  md:text-lg">
              Sign In to continue — exiciting notes, tasks, and ideas are
              waiting for you.
            </p>
          </div>
          <Card className="w-5/6 p-4 md:p-6 shadow-md border-border bg-card backdrop-blur-sm">
            <form className="flex flex-col items-start " onSubmit={handleSubmit}>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>
                    <h2 className="text-md md:text-xl">Profile Details</h2>
                  </FieldLegend>
                  <FieldDescription className="text-base md:text-lg">
                    All your data is stored securely
                  </FieldDescription>
                  <FieldGroup>
                    <Field>
                      <FieldLabel
                        className="text-sm md:text-base"
                        htmlFor="checkout-7j9-card-number-uw1"
                      >
                        Email Address
                      </FieldLabel>
                      <Input
                        name="email"
                        id="checkout-7j9-card-number-uw1"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        type="email"
                        className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10"
                      />
                    </Field>
                    <div className="flex gap-2 ">
                      <Field className="w-full">
                        <FieldLabel className="text-sm md:text-base">
                          Password
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            name="password"
                            // 1. Toggle type based on state
                            type={showPassword.show ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your Password"
                            required
                            // 2. Add padding-right (pr-10) so text doesn't overlap the icon
                            className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10 pr-10"
                          />
                          {/* 3. Toggle Button */}
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                show: !prev.show,
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword.show ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>
                <Field
                  className="flex items-center flex-col  justify-between mt-4"
                  orientation="horizontal"
                >
                  <Button
                    className="w-2/5 bg-primary hover:bg-primary-hover text-foreground text-sm md:text-base"
                    type="submit"
                   
                  >
                    {isLoading ? (
                      <span className=" w-full flex gap-4 items-center">
                        <Spinner className="size-4" /> Submitting
                      </span>
                    ) : (
                      " Submit"
                    )}
                  </Button>
                  <p className="text-sm md:text-base flex gap-2 text-muted-foreground mt-2">
                    Don’t have an account?{" "}
                    <Link
                      href="./signuppage"
                      className="text-primary hover:underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </p>
                </Field>
              </FieldGroup>
              {error && (
                <Alert variant="destructive" className="mb-6 text-start">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
