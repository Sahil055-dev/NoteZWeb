'use client'

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import Header from "@/app/Header/Header";
import Logo from "@/app/Components/Logo";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/app/Components/DatePicker";
import { Card } from "@/components/ui/card";
import useIsSmallScreen from "@/app/hooks/isSmallScreen";

export default function SignUpPage() {
  const isSmallScreen = useIsSmallScreen();
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
                          className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10 "
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
                        Date of Birth
                      </FieldLabel>
                      <DatePicker />
                    </Field>

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
                                        <div className="flex gap-2 ">
                      <Field>
                        <FieldLabel
                          className="text-sm md:text-base"
                          htmlFor="checkout-7j9-card-name-43j"
                        >
                          Password
                        </FieldLabel>
                        <Input
                          id="checkout-7j9-card-name-43j"
                          placeholder="Enter your Password"
                          required
                          className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10 "
                        />
                      </Field>
                      <Field>
                        <FieldLabel
                          className="text-sm md:text-base"
                          htmlFor="checkout-7j9-card-name-43j"
                        >
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id="checkout-7j9-card-name-43j"
                          placeholder="Confirm your Password"
                          required
                          className="bg-card border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/10"
                        />
                      </Field>
                    </div>
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
