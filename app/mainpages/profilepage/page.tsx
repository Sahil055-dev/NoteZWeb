
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { studentEducationOptions } from "@/app/data/eduOptions";
import SelectMenuField from "@/app/Authentication/signuppage/EducationSelectMenu";
import DialogMultiSelect from "@/app/Authentication/signuppage/subjectModal";
import supabase from "@/app/API/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
  Field,
} from "@/components/ui/field";
import { useAuth } from "@/components/context/AuthProvider";

type OptionsState = {
  branchOptions: string[];
  subjectOptions: string[];
};

type SelectedState = {
  educationField: string;
  branch: string;
  universityTier: string;
  subjectTags: string[];
};

const emptyOptions: OptionsState = {
  branchOptions: [],
  subjectOptions: [],
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [options, setOptions] = useState<OptionsState>(emptyOptions);
  const [selectedOptions, setSelectedOptions] = useState<SelectedState>({
    educationField: "",
    branch: "",
    universityTier: "",
    subjectTags: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      setIsLoadingProfile(false);
      return;
    }

    const loadProfile = async () => {
      setIsLoadingProfile(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("educationField, branch, universityTier, subjectTags")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Failed to load profile:", error);
        setIsLoadingProfile(false);
        return;
      }

      setSelectedOptions({
        educationField: data?.educationField ?? "",
        branch: data?.branch ?? "",
        universityTier: data?.universityTier ?? "",
        subjectTags: Array.isArray(data?.subjectTags) ? data.subjectTags : [],
      });

      setIsLoadingProfile(false);
    };

    loadProfile();
  }, [user, isLoading]);

  useEffect(() => {
    const selected =
      studentEducationOptions.educationType[
        selectedOptions.educationField as keyof typeof studentEducationOptions.educationType
      ];

    if (selected) {
      setOptions({
        branchOptions: selected.branch ?? [],
        subjectOptions: selected.subjectTags ?? [],
      });
    } else {
      setOptions(emptyOptions);
    }
  }, [selectedOptions.educationField]);

  const handleEducationChange = (selectedType: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      educationField: selectedType,
      branch: "",
      subjectTags: [],
    }));
  };

  const handleSelect = (val: string | string[], field: keyof SelectedState) => {
    setSelectedOptions((prev) => ({ ...prev, [field]: val }));
  };

  const removeTag = (tag: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      subjectTags: prev.subjectTags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    const { error: dbError } = await supabase
      .from("profiles")
      .update({
        educationField: selectedOptions.educationField,
        branch: selectedOptions.branch,
        universityTier: selectedOptions.universityTier,
        subjectTags: selectedOptions.subjectTags,
      })
      .eq("id", user.id);

    setIsSaving(false);

    if (dbError) {
      console.error("Failed to save profile:", dbError);
      return;
    }

    router.push("/mainpages/dashboard");
  };

  const subjectCountLabel =
    selectedOptions.subjectTags.length > 0
      ? `Selected Subjects (${selectedOptions.subjectTags.length})`
      : "Select Subjects";

  const displayName = user?.user_metadata?.firstName
    ? `${user.user_metadata.firstName} ${user.user_metadata?.lastName ?? ""}`.trim()
    : "User";
  const email = user?.email ?? "No email on file";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "U";

  return (
    <div className="min-h-screen flex flex-col bg-background mt-20">
      <section className="flex flex-1 items-center justify-center px-4 py-10 md:py-14">
        <div className="w-full max-w-5xl flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl border bg-card/60 p-6 md:p-8 shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <div className="absolute -top-16 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-secondary/10 blur-2xl" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary/40">
                  <AvatarFallback className="bg-gradient-to-br from-primary/60 to-secondary/60 text-primary-foreground text-lg font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    {displayName}
                  </h1>
                  <p className="text-muted-foreground mt-1">{email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Academic Preferences
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Profile Settings
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedOptions.educationField || isSaving}
                  form="profile-form"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.08 }}
          >
            <Card className="w-full p-5 md:p-6 shadow-sm bg-card">
              <motion.form
                id="profile-form"
                className="w-full flex flex-col items-start gap-5"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
              >
                <FieldGroup className="w-full">
                  <FieldSet className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="text-left">
                        <FieldLegend className="text-lg md:text-xl">
                          Academic Details
                        </FieldLegend>
                        <FieldDescription className="text-sm md:text-base">
                          Fine-tune your preferences to match the right notes.
                        </FieldDescription>
                      </div>
                      <Badge variant="outline" className="w-fit text-xs">
                        Personalized Feed
                      </Badge>
                    </div>

                    <Separator className="my-4" />

                    {isLoadingProfile ? (
                      <div className="w-full py-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-8 w-56" />
                          <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-7 w-28" />
                            <Skeleton className="h-7 w-24" />
                            <Skeleton className="h-7 w-20" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <SelectMenuField
                            label="Education Type"
                            options={Object.keys(
                              studentEducationOptions.educationType
                            )}
                            placeholder="Select education type"
                            onChange={handleEducationChange}
                            value={selectedOptions.educationField}
                            width="w-full"
                          />

                          <SelectMenuField
                            label="University Tier"
                            options={studentEducationOptions.universityTier}
                            placeholder="Select university tier"
                            onChange={(val) =>
                              handleSelect(val, "universityTier")
                            }
                            value={selectedOptions.universityTier}
                            width="w-full"
                          />

                          <div className="md:col-span-2">
                            <SelectMenuField
                              label="Branch / Major"
                              options={options.branchOptions}
                              placeholder="Select branch"
                              disabled={!selectedOptions.educationField}
                              onChange={(val) => handleSelect(val, "branch")}
                              value={selectedOptions.branch}
                              width="w-full"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col mt-4 w-full">
                          <label className="text-start text-sm md:text-base font-medium mb-1">
                            Subject Interests
                          </label>
                          {!selectedOptions.educationField ? (
                            <FieldDescription className="text-start text-base md:text-md mt-2">
                              Select the education type above to choose
                              subjects.
                            </FieldDescription>
                          ) : (
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                              <p className="text-muted-foreground">
                                Add subjects you are interested in
                              </p>
                              <DialogMultiSelect
                                key={`subjects-${selectedOptions.subjectTags.join("|")}`}
                                options={options.subjectOptions}
                                initialSelected={selectedOptions.subjectTags}
                                onSubmit={(val) =>
                                  handleSelect(val, "subjectTags")
                                }
                                label={subjectCountLabel}
                              />
                            </div>
                          )}

                          {selectedOptions.subjectTags.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {selectedOptions.subjectTags.map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="flex items-center gap-2 rounded-full px-3 py-1 bg-card/80 border border-muted text-sm text-foreground shadow-sm hover:bg-muted/40 transition-colors"
                                  title={`Remove ${tag}`}
                                >
                                  <span className="truncate max-w-[12rem]">
                                    {tag}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    x
                                  </span>
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </>
                    )}
                  </FieldSet>
                </FieldGroup>
              </motion.form>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
