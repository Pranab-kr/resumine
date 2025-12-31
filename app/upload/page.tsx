"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import FileUploader from "@/components/FileUploader";
import { usePuterStore } from "@/lib/puter-store";
import { prepareInstructions, generateUUID } from "@/lib/constants";
import { convertPdfToImage } from "@/lib/pdf2img";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AnalyzeParams {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File;
}

export default function UploadPage() {
  const { auth, isLoading: puterLoading, fs, ai, kv, init, puterReady } = usePuterStore();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState("");
  const [hasError, setHasError] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (puterReady && !puterLoading && !auth.isAuthenticated && !isProcessing) {
      router.push("/auth?next=/upload");
    }
  }, [puterReady, puterLoading, auth.isAuthenticated, router, isProcessing]);

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: AnalyzeParams) => {
    try {
      setIsProcessing(true);
      setHasError(false);
      setStatusText("Uploading the file...");
      console.log("Starting upload...", file.name);

      const uploadedFile = await fs.upload([file]);
      console.log("Upload result:", uploadedFile);

      if (!uploadedFile) {
        setStatusText("Error: Failed to upload the File. Please make sure you are logged in.");
        setHasError(true);
        return;
      }

      setStatusText("Converting to image...");
      console.log("Converting PDF to image...");
      const imageFile = await convertPdfToImage(file);
      console.log("Conversion result:", imageFile);

      if (!imageFile || !imageFile.file) {
        const errorMsg = imageFile?.error || "Failed to convert PDF to image";
        setStatusText(`Conversion failed: ${errorMsg}`);
        setHasError(true);
        return;
      }

      setStatusText("Uploading the image...");
      console.log("Uploading image...");
      const uploadedImage = await fs.upload([imageFile.file]);
      console.log("Image upload result:", uploadedImage);

      if (!uploadedImage) {
        setStatusText("Failed to upload image.");
        setHasError(true);
        return;
      }

      setStatusText("Processing data...");
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };
      console.log("Saving initial data:", data);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analyzing your resume with AI (this may take a minute)...");
      console.log("Calling AI feedback...");

      const feedBack = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobTitle, jobDescription })
      );
      console.log("AI feedback result:", feedBack);

      if (!feedBack) {
        setStatusText("Error: failed to analyze resume. Please try again.");
        setHasError(true);
        return;
      }

      const feedbackText =
        typeof feedBack.message.content === "string"
          ? feedBack.message.content
          : feedBack.message.content[0].text;

      console.log("Raw feedback:", feedbackText);

      // Clean up the response - remove markdown code blocks if present
      let cleanedFeedback = feedbackText.trim();
      if (cleanedFeedback.startsWith("```json")) {
        cleanedFeedback = cleanedFeedback.slice(7);
      } else if (cleanedFeedback.startsWith("```")) {
        cleanedFeedback = cleanedFeedback.slice(3);
      }
      if (cleanedFeedback.endsWith("```")) {
        cleanedFeedback = cleanedFeedback.slice(0, -3);
      }
      cleanedFeedback = cleanedFeedback.trim();

      console.log("Cleaned feedback:", cleanedFeedback);
      const updatedData = {
        ...data,
        feedback: JSON.parse(cleanedFeedback),
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(updatedData));
      setStatusText("Analysis complete, redirecting...");
      router.push(`/resume/${uuid}`);
    } catch (error) {
      console.error("Error during resume analysis:", error);
      let errorMessage = "Something went wrong. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        // Handle Puter.js error objects
        const errObj = error as Record<string, unknown>;
        errorMessage = errObj.message as string || errObj.error as string || JSON.stringify(error);
      } else {
        errorMessage = String(error);
      }
      setStatusText(`Error: ${errorMessage}`);
      setHasError(true);
    }
  };

  const handleReset = () => {
    setIsProcessing(false);
    setHasError(false);
    setStatusText("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) {
      setStatusText("Please select a PDF file to upload.");
      return;
    }

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  return (
    <main className="min-h-screen pt-10">
      <NavBar />
      <section className="main-section">
        <div className="page-heading py-8">
          <h1 className="max-sm:text-4xl text-6xl text-gradient leading-tight font-semibold">
            Smart Feedback for Your Dream Job
          </h1>
          {isProcessing && !hasError ? (
            <>
              <div className="flex items-center gap-2 text-xl text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                {statusText}
              </div>
              <Image
                src="/images/resume-scan.gif"
                alt="Analyzing"
                width={400}
                height={400}
                className="w-full max-w-md"
                unoptimized
              />
            </>
          ) : hasError ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl text-destructive">{statusText}</p>
              <Button
                onClick={handleReset}
                className="rounded-full px-8 py-4"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <p className="text-xl text-muted-foreground">
              Drop Your resume for an ATS score and improvement tips
            </p>
          )}

          {!isProcessing && !hasError && (
            <Card className="w-full max-w-2xl">
              <CardContent className="pt-6">
                <form
                  id="upload-form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  <div className="form-div">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      type="text"
                      name="company-name"
                      id="company-name"
                      placeholder="Company Name"
                      className="inset-shadow"
                    />
                  </div>
                  <div className="form-div">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input
                      type="text"
                      name="job-title"
                      id="job-title"
                      placeholder="Job Title"
                      className="inset-shadow"
                    />
                  </div>
                  <div className="form-div">
                    <Label htmlFor="job-description">Job Description</Label>
                    <Textarea
                      rows={5}
                      name="job-description"
                      id="job-description"
                      placeholder="Job Description"
                      className="inset-shadow"
                    />
                  </div>
                  <div className="form-div">
                    <Label>Upload Resume</Label>
                    <FileUploader onFileSelect={handleFileSelect} />
                  </div>

                  <Button
                  variant={"default"}
                    className="rounded-full py-6 text-lg"
                    type="submit"
                    disabled={!file}
                  >
                    Analyze Resume
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
