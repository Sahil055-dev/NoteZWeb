"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { studentEducationOptions } from "@/app/data/eduOptions";
import SelectMenuField from "../EducationSelectMenu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
  Field,
} from "@/components/ui/field";
import Logo from "@/app/Components/Logo";

type OptionsState = {
  degreeOptions: string[];
  branchOptions: string[];
  subjectOptions: string[];
};

type SelectedState = {
  educationField: string;
  degree: string;
  branch: string;
  universityTier: string;
  subjectTags: string[];
};

export default function StudentSignUp() {
  const [options, setOptions] = useState<OptionsState>({
    degreeOptions: [],
    branchOptions: [],
    subjectOptions: [],
  });

  const [selectedOptions, setSelectedOptions] = useState<SelectedState>({
    educationField: "",
    degree: "",
    branch: "",
    universityTier: "",
    subjectTags: [],
  });

  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherSubject, setOtherSubject] = useState("");
  const [subjectTagsSelected, setSubjectTagsSelected] = useState<string[]>(
    []
  );

  const handleEducationChange = (selectedType: string) => {
    setSelectedOptions((prev) => ({ ...prev, educationField: selectedType }));

    const selected =
      studentEducationOptions.educationType[
        selectedType as keyof typeof studentEducationOptions.educationType
      ];

    if (selected) {
      setOptions((prev) => ({
        ...prev,
        degreeOptions: selected.degreeType ?? [],
        branchOptions: selected.branch ?? [],
        subjectOptions: selected.subjectTags ?? [],
      }));
    } else {
      setOptions((prev) => ({ ...prev }));
    }
  };

  const handleSelect = (val: string, field: keyof SelectedState) => {
    setSelectedOptions((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <section className="flex flex-1 items-center justify-center px-4 py-16 md:py-32">
        <div className="w-full max-w-2xl flex flex-col items-center text-center">
          {/* Header */}
          <div className="mb-8">
            <span className="flex gap-4 justify-center items-baseline">
              <h1 className="text-3xl md:text-4xl font-semibold">Welcome To</h1>
              <Logo size="medium" />
              <h3>for Learners</h3>
            </span>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              Enter your academic details to explore exciting notes
            </p>
          </div>

          {/* Form */}
          <Card className="w-full p-4 shadow-md bg-card">
            <motion.form
              className="w-full flex flex-col items-start gap-4"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              // onSubmit={handleSubmit}
            >
              <FieldGroup>
                <FieldSet>
                  <FieldLegend className="text-lg md:text-xl">
                    Academic Details
                  </FieldLegend>
                  <FieldDescription className="text-base md:text-lg">
                    This data helps us show the best content for your field
                  </FieldDescription>

                  {/* Education Type + University Tier */}
                  <div className="flex gap-2 mt-2">
                    <SelectMenuField
                      label="Education Type"
                      options={Object.keys(
                        studentEducationOptions.educationType
                      )}
                      placeholder="Select education type"
                      onChange={handleEducationChange}
                      value={selectedOptions.educationField}
                    />

                    <SelectMenuField
                      label="University Tier"
                      options={studentEducationOptions.universityTier}
                      placeholder="Select university tier"
                      onChange={(val) => handleSelect(val, "universityTier")}
                      value={selectedOptions.universityTier}
                    />
                  </div>

                  {/* Degree + Branch */}
                  <div className="flex gap-2 mt-4">
                    <div className="flex-1">
                      <SelectMenuField
                        label="Degree Type"
                        options={options.degreeOptions}
                        placeholder="Select degree"
                        disabled={!selectedOptions.educationField}
                        onChange={(val) => handleSelect(val, "degree")}
                        value={selectedOptions.degree}
                      />
                    </div>

                    <div className="flex-1">
                      <SelectMenuField
                        label="Branch / Major"
                        options={options.branchOptions}
                        placeholder="Select branch"
                        disabled={!selectedOptions.educationField}
                        onChange={(val) => handleSelect(val, "branch")}
                        value={selectedOptions.branch}
                      />
                    </div>
                  </div>

                  {/* Subject Interests */}
                  <div className="flex flex-col mt-4 w-full">
                    <label className="text-sm font-medium mb-1">
                      Subject Interests
                    </label>

                    <select
                      multiple
                      className="rounded-md border p-2 bg-background text-foreground w-full h-32"
                      value={subjectTagsSelected}
                      onChange={(e) => {
                        const selected = Array.from(
                          e.target.selectedOptions,
                          (opt) => opt.value
                        );
                        setSubjectTagsSelected(selected);
                        if (selected.includes("Other")) {
                          setShowOtherInput(true);
                        } else {
                          setShowOtherInput(false);
                        }
                      }}
                    >
                      {options.subjectOptions.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>

                    {/* Show input for “Other” when selected */}
                    {showOtherInput && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter other subject"
                          value={otherSubject}
                          onChange={(e) => setOtherSubject(e.target.value)}
                          className="rounded-md border p-2 flex-1 bg-background text-foreground"
                        />
                        <button
                          type="button"
                          className="border rounded-md px-3 py-1"
                          onClick={() => {
                            if (otherSubject.trim() !== "") {
                              setSubjectTagsSelected((prev) => [
                                ...prev.filter((v) => v !== "Other"),
                                otherSubject.trim(),
                              ]);
                              setOtherSubject("");
                              setShowOtherInput(false);
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-1">
                      (Hold Ctrl or Cmd to select multiple subjects)
                    </p>
                  </div>
                </FieldSet>

                {/* Buttons */}
                <Field orientation="horizontal" className="mt-6 gap-3">
                  <Button type="submit">Submit</Button>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Field>
              </FieldGroup>
            </motion.form>
          </Card>
        </div>
      </section>
    </div>
  );
}
