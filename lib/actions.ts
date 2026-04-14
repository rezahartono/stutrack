"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCourse(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const category = formData.get("category") as string;
  const semesterId = formData.get("semesterId") as string;
  const day = (formData.get("day") as string) || null;
  const startTime = (formData.get("startTime") as string) || null;
  const endTime = (formData.get("endTime") as string) || null;
  const room = (formData.get("room") as string) || null;

  if (!name || !code || !category) {
    throw new Error("Missing required fields");
  }

  // Create a default semester if none exists or isn't provided correctly
  let actualSemesterId = semesterId;
  if (!actualSemesterId) {
    const defaultSemester = await db.semester.findFirst() || await db.semester.create({
      data: {
        name: "Semester 1",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6))
      }
    });
    actualSemesterId = defaultSemester.id;
  }

  const course = await (db.course.create as any)({
    data: {
      name,
      code,
      category,
      semesterId: actualSemesterId,
      day,
      startTime,
      endTime,
      room,
    },
  });

  revalidatePath("/courses");
  revalidatePath("/schedule");
  redirect(`/courses/${course.id}`);
}

export async function updateCourseSchedule(courseId: string, formData: FormData) {
  const day = (formData.get("day") as string) || null;
  const startTime = (formData.get("startTime") as string) || null;
  const endTime = (formData.get("endTime") as string) || null;
  const room = (formData.get("room") as string) || null;

  await (db.course.update as any)({
    where: { id: courseId },
    data: { day, startTime, endTime, room },
  });

  revalidatePath("/schedule");
  revalidatePath("/courses");
}

export async function createSession(courseId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const taskType = formData.get("taskType") as string;
  
  const hasDiscussion = taskType === "discussion" || taskType === "both";
  const hasTask = taskType === "task" || taskType === "both";

  await db.session.create({
    data: {
      courseId,
      name,
      startDate: new Date(startDateStr),
      endDate: new Date(endDateStr),
      hasDiscussion,
      hasTask,
    }
  });

  revalidatePath(`/courses/${courseId}`);
}

export async function upsertStudyRecord(sessionId: string, formData: FormData, courseId?: string) {
  const attendance = formData.get("attendance") === "on";
  const discussion = formData.get("discussion") === "on";
  const task = formData.get("task") === "on";
  const scoreRaw = formData.get("score") as string;
  const score = scoreRaw ? parseFloat(scoreRaw) : null;

  // Since we don't have user IDs yet (single user app), we'll assume one record per session
  const existingRecord = await db.studyRecord.findFirst({
    where: { sessionId }
  });

  if (existingRecord) {
    await db.studyRecord.update({
      where: { id: existingRecord.id },
      data: { attendance, discussion, task, score }
    });
  } else {
    await db.studyRecord.create({
      data: { sessionId, attendance, discussion, task, score }
    });
  }

  revalidatePath("/study-tracker");
  if (courseId) {
    revalidatePath(`/study-tracker?courseId=${courseId}`);
  }
}

export async function createSemesterConfig(formData: FormData) {
  const name = formData.get("name") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;

  if (!name || !startDateStr || !endDateStr) {
    throw new Error("Missing required semester fields");
  }

  await db.semester.create({
    data: {
      name,
      startDate: new Date(startDateStr),
      endDate: new Date(endDateStr)
    }
  });

  revalidatePath("/settings");
  revalidatePath("/courses/new");
}

export async function nukeDatabase() {
  // SQLite Prisma handles cascades, but simply wiping the core will clear nested ones
  await db.studyRecord.deleteMany({});
  await db.session.deleteMany({});
  await db.course.deleteMany({});
  await db.semester.deleteMany({});
  
  revalidatePath("/");
  redirect("/settings");
}
