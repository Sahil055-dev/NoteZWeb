"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StudentSignUp() {
  const [options, setOptions] = useState({
    degreeOptions: [] as string[],
    branchOptions: [] as string[],
    subjectOptions: [] as string[],
  });
  const [selectedOptions, setSelectedOptions] = useState({
    educationField: "",
    degree: "",
    branch: "",
    universityTier: "",
    subjectTags: [] as string[],
  });
  const [open, setOpen] = useState(false);

  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherSubject, setOtherSubject] = useState("");

  // New fields
  const [subjectTagsSelected, setSubjectTagsSelected] = useState<string[]>([]);

  // Handle Education Type change
  const handleEducationChange = (selectedType: string) => {
    setSelectedOptions((prevValues) => ({
      ...prevValues,
      educationField: selectedType,
    }));
    const selected =
      studentEducationOptions.educationType[
        selectedType as keyof typeof studentEducationOptions.educationType
      ];
    if (selected) {
      setOptions((prev) => ({
        ...prev,
        degreeOptions: selected.degreeType,
        branchOptions: selected.branch,
        subjectOptions: selected.subjectTags,
      }));
    } else {
      setOptions((prev) => ({
        ...prev,
      }));
    }
  };

  const handleSelect = (val: string, field: keyof typeof selectedOptions) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const studentData = {
  //     educationType,
  //     degree:
  //       degreeSelected === "Other" ? otherDegree : degreeSelected || "N/A",
  //     branch:
  //       branchSelected === "Other" ? otherBranch : branchSelected || "N/A",
  //     universityTier,
  //     subjectTags: subjectTagsSelected,
  //   };
  //   console.log("📘 Submitted Data:", studentData);
  // };

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
                    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>

      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-[500px]" forceMount>
            <motion.div
              key="dialog-inner"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <DialogHeader>
                <DialogTitle>Choose Your Subject Interests</DialogTitle>
                <DialogDescription>
                  Select one or more subjects below.
                </DialogDescription>
              </DialogHeader>

              {/* ---- Multi-select menu ---- */}
              
                <Label htmlFor="subjects">Subjects</Label>
                <select
                  id="subjects"
                  multiple
                  className="rounded-md border p-2 bg-background text-foreground w-full h-32 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={selectedSubjects}
                  onChange={handleSelectChange}
                >
                  {subjectOptions.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>

                {showOtherInput && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Enter other subject"
                      value={otherSubject}
                      onChange={(e) => setOtherSubject(e.target.value)}
                      className="rounded-md border p-2 flex-1 bg-background text-foreground"
                    />
                    <Button type="button" onClick={addOtherSubject}>
                      Add
                    </Button>
                  </div>
                )}

                {/* ---- Display selected items as themed chips ---- */}
                {selectedSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedSubjects.map((subj) => (
                      <div
                        key={subj}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm"
                      >
                        <span>{subj}</span>
                        <button
                          type="button"
                          onClick={() => removeSubject(subj)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-1">
                  (Hold Ctrl or Cmd to select multiple subjects)
                </p>
              </div>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
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
