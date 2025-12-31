"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePuterStore } from "@/lib/puter-store";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Trash2, Loader2, FileText, CheckCircle } from "lucide-react";
import type { FSItem } from "@/types";

export default function SettingsPage() {
  const { auth, isLoading: puterLoading, fs, kv, init, puterReady } = usePuterStore();
  const router = useRouter();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (puterReady && !puterLoading && !auth.isAuthenticated) {
      router.push("/auth?next=/settings");
    }
  }, [puterReady, puterLoading, auth.isAuthenticated, router]);

  const loadFiles = async () => {
    if (!auth.isAuthenticated) return;
    setIsLoading(true);
    try {
      const fileList = await fs.readDir("./");
      setFiles((fileList as FSItem[]) || []);
    } catch (error) {
      console.error("Error loading files:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      loadFiles();
    }
  }, [auth.isAuthenticated]);

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    setDeleteSuccess(false);
    try {
      // Delete all files
      for (const file of files) {
        try {
          await fs.delete(file.path);
        } catch (err) {
          console.error(`Error deleting file ${file.path}:`, err);
        }
      }
      // Flush KV store
      await kv.flush();
      // Reload files
      await loadFiles();
      setDeleteSuccess(true);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    setIsDeleting(false);
  };

  if (!puterReady || puterLoading) {
    return (
      <main className="min-h-screen pt-10">
        <NavBar />
        <section className="main-section">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-10">
      <NavBar />
      <section className="main-section">
        <div className="page-heading py-8">
          <h1 className="max-sm:text-4xl text-6xl text-gradient leading-tight font-semibold">
            Settings
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your account and data
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your Puter account information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                Logged in as: <span className="font-semibold">{auth.user?.username}</span>
              </p>
            </CardContent>
          </Card>

          {/* Files List */}
          <Card>
            <CardHeader>
              <CardTitle>Stored Files</CardTitle>
              <CardDescription>
                {isLoading ? "Loading files..." : `${files.length} file(s) stored in your Puter account`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : files.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No files stored</p>
              )}
            </CardContent>
          </Card>

          {/* Delete All Data */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete all your resume data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deleteSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span>All data deleted successfully!</span>
                </div>
              )}

              <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogTrigger
                  render={
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={isDeleting || files.length === 0}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete All Data
                        </>
                      )}
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your
                      uploaded resumes, images, and analysis data from your Puter account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAll}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, delete everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <Link href="/">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
