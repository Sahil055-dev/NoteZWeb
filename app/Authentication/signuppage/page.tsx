"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns/format";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
  Field,
  FieldLabel,
} from "@/components/ui/field"; // Assuming these are your custom or catalyst components
import Link from "next/link";
import useIsSmallScreen from "@/app/hooks/isSmallScreen";
import Logo from "@/app/Components/Logo";
import DatePicker from "@/app/Components/DatePicker"; // Assuming path
import { Eye, EyeOff } from "lucide-react";
import supabase from "@/app/API/supabase";
import { useAuth } from "@/components/context/AuthProvider";
import { useSonner } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { set } from "date-fns";

type formDataType = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string | undefined;
  password: string;
  confirmPassword: string;
  areDetailsFilled: boolean;
};

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const isSmallScreen = useIsSmallScreen();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState({
    show: false,
    showConfirm: false,
  });
  const [formData, setFormData] = useState<formDataType>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: undefined,
    password: "",
    confirmPassword: "",
    areDetailsFilled: false,
  });

  const [error, setError] = useState<string | null>(null);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  // Handle Date Change (Mock implementation depending on your DatePicker component)
  const handleDateChange = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setFormData((prev) => ({ ...prev, dateOfBirth: formattedDate }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    // 2. Validation Check
    if (formData.password !== formData.confirmPassword) {
      
      setError("Passwords do not match. Please try again.");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    if (!formData.dateOfBirth) {
      setError("Please select your date of birth.");
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          areDetailsFilled: false, // Stored in Auth Metadata only
        },
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // Redirect to the Details Page
    router.push("./signuppage/detailspage");
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
              Sign Up to continue — exiciting notes, tasks, and ideas are
              waiting for you.
            </p>
          </div>
          <Card className="w-full p-4 md:p-6 shadow-md border-border bg-card backdrop-blur-sm">
            {/* Error Alert */}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-start w-full"
            >
              <FieldGroup className="w-full">
                <FieldSet className="w-full">
                  <FieldLegend>
                    <h2 className="text-md md:text-xl text-center">
                      Profile Details
                    </h2>
                  </FieldLegend>
                  <FieldDescription className="text-base md:text-lg text-center mb-4">
                    All your data is stored securely
                  </FieldDescription>
                  <FieldGroup>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Field className="w-full">
                        <FieldLabel className="text-sm md:text-base">
                          First Name
                        </FieldLabel>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          required
                          className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10 "
                        />
                      </Field>
                      <Field className="w-full">
                        <FieldLabel className="text-sm md:text-base">
                          Last Name
                        </FieldLabel>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          required
                          className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10"
                        />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel className="text-sm md:text-base">
                        Date of Birth
                      </FieldLabel>
                      {/* Assuming DatePicker accepts an onChange prop */}
                      <DatePicker onSelectDate={handleDateChange} />
                    </Field>

                    <Field>
                      <FieldLabel className="text-sm md:text-base">
                        Email Address
                      </FieldLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@gmail.com"
                        required
                        className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10"
                      />
                    </Field>
                    <div className="flex flex-col md:flex-row gap-2">
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

                      <Field className="w-full">
                        <FieldLabel className="text-sm md:text-base">
                          Confirm Password
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            name="confirmPassword"
                            type={
                              showPassword.showConfirm ? "text" : "password"
                            }
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your Password"
                            required
                            className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                showConfirm: !prev.showConfirm,
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword.showConfirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </Field>
                    </div>
                  </FieldGroup>
                  {error && (
                    <Alert variant="destructive" className="mb-6 text-start">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </FieldSet>
                <Field
                  className="flex items-center flex-col md:flex-row justify-between  w-full"
                  orientation="horizontal"
                >
                  <Button
                    className="w-full md:w-2/5 bg-primary hover:bg-primary-hover text-foreground text-sm md:text-base"
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
                  <p className="text-sm md:text-base flex gap-2 text-muted-foreground mt-4 md:mt-0">
                    Already have an account?{" "}
                    <Link
                      href="./signinpage"
                      className="text-primary hover:underline underline-offset-4"
                    >
                      Sign In
                    </Link>
                  </p>
                </Field>
              </FieldGroup>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
