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
import useIsSmallScreen from "@/app/hooks/isSmallScreen";
import DialogMultiSelect from "../subjectModal";

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

export default function StudentSignUp() {
  const isSmallScreen = useIsSmallScreen();
  const [options, setOptions] = useState<OptionsState>({
    branchOptions: [],
    subjectOptions: [],
  });

  const [selectedOptions, setSelectedOptions] = useState<SelectedState>({
    educationField: "",
    branch: "",
    universityTier: "",
    subjectTags: [],
  });

  const [subjectTagsSelected, setSubjectTagsSelected] = useState<string[]>([]);

  const handleEducationChange = (selectedType: string) => {
    setSelectedOptions((prev) => ({ ...prev, educationField: selectedType }));

    const selected =
      studentEducationOptions.educationType[
        selectedType as keyof typeof studentEducationOptions.educationType
      ];

    if (selected) {
      setOptions((prev) => ({
        ...prev,
        branchOptions: selected.branch ?? [],
        subjectOptions: selected.subjectTags ?? [],
      }));
    } else {
      setOptions((prev) => ({ ...prev }));
    }
  };

  const handleSelect = (val: string | string[], field: keyof SelectedState) => {
    setSelectedOptions((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted options:", selectedOptions);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <section className="flex flex-1 items-center justify-center px-4 py-16 md:py-32">
        <div className="w-full md:max-w-2xl flex flex-col items-center text-center">
          <div className="mt-4 mb-8">
            <span className="flex gap-4 justify-center items-baseline">
              <h1 className="text-xl md:text-4xl font-semibold">Welcome To</h1>
              <Logo size={isSmallScreen ? "small" : "medium"} />
              <h3 className="">for Learners</h3>
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
              onSubmit={handleSubmit}
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
                  <div className=" flex flex-col gap-4 mt-2">
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
                  <div className="flex flex-col mt-2 w-full">
                    <label className="text-start text-sm md:text-base font-medium mb-1">
                      Subject Interests
                    </label>
                    {!selectedOptions.educationField ? (
                    <FieldDescription className=" text-start text-base md:text-md mt-2">
                    Select the education type above to choose subjects
                  </FieldDescription>
                    ) : (
                      <DialogMultiSelect
                        options={options.subjectOptions}
                        initialSelected={selectedOptions.subjectTags}
                        onSubmit={(val) => handleSelect(val, "subjectTags")}
                      />
                    )}
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
