"use client";

import Header from "@/app/Header/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 🧭 Top Navbar */}
      <Header />

      {/* 🧱 Main Section */}
 <section className="flex flex-1 items-center justify-center px-4 py-16 md:py-32">
        <div className="w-full max-w-sm md:max-w-xl lg:max-w-2xl flex flex-col items-center text-center">
          <div className="mb-8 mt-8 md:mt-0">
            <span className="flex gap-4 justify-center items-baseline">
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                Welcome To
              </h1>
              <Logo size="medium"></Logo>
            </span>

            <p className="text-muted-foreground mt-2 text-base  md:text-lg">
              Sign Up to continue — exiciting notes, tasks, and ideas are
              waiting for you.
            </p>
          </div>
          <Card className="w-full p-4 md:p-6 shadow-md border-border bg-card backdrop-blur-sm">
            <form className="flex flex-col items-start ">
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>
                    <h2 className="text-md md:text-xl">Profile Details</h2>
                  </FieldLegend>
                  <FieldDescription className="text-base md:text-lg">
                    All your data is stored securely
                  </FieldDescription>
                  <FieldGroup>
                    <div className="flex gap-2 ">
                      <Field>
                        <FieldLabel
                          className="text-sm md:text-base"
                          htmlFor="checkout-7j9-card-name-43j"
                        >
                          First Name
                        </FieldLabel>
                        <Input
                          id="checkout-7j9-card-name-43j"
                          placeholder="Enter your first name"
                          required
                          className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10"
                        />
                      </Field>
                      <Field>
                        <FieldLabel
                          className="text-sm md:text-base"
                          htmlFor="checkout-7j9-card-name-43j"
                        >
                          Last Name
                        </FieldLabel>
                        <Input
                          id="checkout-7j9-card-name-43j"
                          placeholder="Enter your last name"
                          required
                          className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10"
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel
                        className="text-sm md:text-base"
                        htmlFor="checkout-7j9-card-number-uw1"
                      >
                        Email Address
                      </FieldLabel>
                      <Input
                        id="checkout-7j9-card-number-uw1"
                        placeholder="example@gmail.com"
                        required
                        className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10"
                      />
                    </Field>
                    <Field>
                      <FieldLabel
                        className="text-sm md:text-base"
                        htmlFor="checkout-7j9-card-number-uw1"
                      >
                        Date of Birth
                      </FieldLabel>
                      <DatePicker />
                    </Field>
                    <Field className="flex flex">
                      <FieldLabel
                        className="text-sm md:text-base"
                        htmlFor="checkout-7j9-card-number-uw1"
                      >
                        Select Your Role
                      </FieldLabel>
                      <RadioGroup className="flex" defaultValue="comfortable">
                        <p className="text-muted-foreground">
                          You want to enroll as
                        </p>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="learner" id="r2" />
                          <Label htmlFor="r2">Learner</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="mentor" id="r3" />
                          <Label htmlFor="r3">Mentor</Label>
                        </div>
                      </RadioGroup>
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <Field
                  className="flex items-center flex-col md:flex-row justify-between"
                  orientation="horizontal"
                >
                  <Button
                    className="w-2/5 bg-primary hover:bg-primary-hover text-foreground text-sm md:text-base"
                    type="submit"
                  >
                    Submit
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
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
