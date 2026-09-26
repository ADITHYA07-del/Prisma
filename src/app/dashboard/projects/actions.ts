"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import { db } from "@/lib/db";
import { ProjectStatus } from "@prisma/client";

export type StatusTransitionResult =
  | { success: true; error?: never }
  | { success?: false; error: string };

/**
 * Server action to update a project's status with legal transition enforcement:
 * - NOT_STARTED -> IN_PROGRESS
 * - IN_PROGRESS -> COMPLETED
 * - IN_PROGRESS -> NOT_STARTED (revert)
 *
 * Only an ADMIN may update a project's status.
 */
export async function updateProjectStatus(
  projectId: string,
  newStatus: ProjectStatus,
): Promise<StatusTransitionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await getOrCreateUser(user);

  if (!dbUser) {
    redirect("/login");
  }

  if (!Object.values(ProjectStatus).includes(newStatus)) {
    return { error: `"${newStatus}" is not a valid project status.` };
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      members: true,
    },
  });

  if (!project) {
    return { error: "Project not found." };
  }

  if (dbUser.role !== "ADMIN") {
    return { error: "Only administrators can change project status." };
  }

  const currentStatus = project.status;

  // Enforce legal transitions only
  const isLegalTransition =
    (currentStatus === "NOT_STARTED" && newStatus === "IN_PROGRESS") ||
    (currentStatus === "IN_PROGRESS" &&
      (newStatus === "COMPLETED" || newStatus === "NOT_STARTED"));

  if (!isLegalTransition) {
    return {
      error: `Invalid status transition from ${currentStatus} to ${newStatus}. Permitted transitions: NOT_STARTED -> IN_PROGRESS, IN_PROGRESS -> COMPLETED, or IN_PROGRESS -> NOT_STARTED (revert).`,
    };
  }

  // Setting status to COMPLETED sets completedAt to current timestamp;
  // reverting to NOT_STARTED clears completedAt back to null.
  const completedAt =
    newStatus === "COMPLETED"
      ? new Date()
      : newStatus === "NOT_STARTED"
        ? null
        : null;

  try {
    await db.project.update({
      where: { id: projectId },
      data: {
        status: newStatus,
        completedAt,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/archive");
    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true };
  } catch (err) {
    console.error("Failed to update project status:", err);
    return {
      error: "An unexpected database error occurred while updating status.",
    };
  }
}
export async function createProject(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await getOrCreateUser(user);

  if (!dbUser) {
    redirect("/login");
  }

  if (dbUser.role !== "ADMIN") {
    redirect(
      `/dashboard/projects/new?error=${encodeURIComponent("Only administrators can create projects.")}`,
    );
  }

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const memberIds = formData.getAll("memberIds") as string[];

  if (!name) {
    redirect(
      `/dashboard/projects/new?error=${encodeURIComponent("Project name is required.")}`,
    );
  }

  let newProjectId: string;

  try {
    const project = await db.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: { name, description, status: "NOT_STARTED" },
      });

      if (memberIds.length > 0) {
        await tx.projectMember.createMany({
          data: memberIds.map((userId) => ({
            projectId: created.id,
            userId,
          })),
        });
      }

      return created;
    });

    newProjectId = project.id;
    revalidatePath("/dashboard");
  } catch (err) {
    console.error("Failed to create project:", err);
    redirect(
      `/dashboard/projects/new?error=${encodeURIComponent("An unexpected error occurred while creating the project.")}`,
    );
  }

  redirect(`/dashboard/projects/${newProjectId}`);
}
