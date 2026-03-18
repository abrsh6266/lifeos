import { PrismaClient, TaskPriority } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed some blocked sites
  const defaultBlockedSites = [
    "twitter.com",
    "x.com",
    "facebook.com",
    "instagram.com",
    "reddit.com",
    "youtube.com",
    "tiktok.com",
    "netflix.com",
  ];

  for (const domain of defaultBlockedSites) {
    await prisma.blockedSite.upsert({
      where: { domain },
      update: {},
      create: { domain, isActive: true },
    });
  }

  // Seed sample tasks
  const tasks = [
    {
      title: "Complete project proposal",
      description: "Write and review the Q1 project proposal document",
      priority: TaskPriority.HIGH,
      estimatedPomodoros: 4,
    },
    {
      title: "Review pull requests",
      description: "Review pending PRs on the main repository",
      priority: TaskPriority.MEDIUM,
      estimatedPomodoros: 2,
    },
    {
      title: "Read technical article",
      description: "Read the distributed systems paper",
      priority: TaskPriority.LOW,
      estimatedPomodoros: 1,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log("seed completed successfully");
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .catch(async () => {
    await prisma.$disconnect();
  });
