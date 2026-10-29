import { PrismaClient, Condition } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with secure bcrypt passwords and hardware items...");

  // Clear existing records
  await prisma.notification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Salt and hash passwords using bcrypt with 12 rounds
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash("pass123", salt);

  // Create Admin User (admin / pass123)
  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      password_hash: hashedPassword,
      name: "Hardware Admin",
      role: "ADMIN",
    },
  });
  console.log(`Created admin user: ${adminUser.username} (${adminUser.role}) with bcrypt hash`);

  // Create Test Customer User (ndk / pass123)
  const testUser = await prisma.user.create({
    data: {
      username: "ndk",
      password_hash: hashedPassword,
      name: "NDK Hardware Enthusiast",
      phone: "09798765432",
      address: "No. 42, Hledan Road, Kamayut Township, Yangon",
      role: "USER",
    },
  });
  console.log(`Created test user: ${testUser.username} (${testUser.role}) with bcrypt hash`);

  // Create initial welcome notification
  await prisma.notification.create({
    data: {
      user_id: testUser.id,
      title: "Welcome to HARDWARE//CORE!",
      message: "Your account is secured with bcrypt password hashing and cryptographic session tokens. You can track your hardware orders and delivery status here.",
      is_read: false,
    },
  });
  console.log("Created initial welcome notification for test user.");

  const products = [
    {
      title: "Intel Xeon E5-2680 v2 Processor",
      description: "10 Cores, 20 Threads, 2.80 GHz Base / 3.60 GHz Turbo, 25MB Intel Smart Cache, FCLGA2011 socket. Reliable workstation & homelab server performance. Tested and guaranteed working.",
      price: 120000,
      condition: Condition.SECONDHAND,
      stock: 14,
      image_url: "/images/products/xeon-e5-2680v2.svg",
    },
    {
      title: "NVIDIA GeForce GTX 1080 8GB GDDR5X",
      description: "Founders Edition / Custom Dual Fan cooler, 2560 CUDA Cores, 8GB 256-bit GDDR5X VRAM. Freshly cleaned and repasted. Superb 1080p and 1440p gaming fidelity.",
      price: 480000,
      condition: Condition.SECONDHAND,
      stock: 6,
      image_url: "/images/products/gtx-1080.svg",
    },
    {
      title: "Acer Aspire Lite 16 Laptop",
      description: "16-inch WUXGA (1920 x 1200) IPS anti-glare display, Intel Core i5-1235U (10 Cores), 16GB DDR4 RAM, 512GB PCIe Gen4 NVMe SSD, Backlit Keyboard, Windows 11 Home, Steel Gray.",
      price: 1850000,
      condition: Condition.NEW,
      stock: 9,
      image_url: "/images/products/acer-aspire-16.svg",
    },
    {
      title: "Samsung 980 PRO 1TB PCIe 4.0 NVMe SSD",
      description: "Next-gen PCIe 4.0 NVMe M.2 2280 internal SSD. Sequential read speeds up to 7,000 MB/s and write speeds up to 5,000 MB/s. Nickel-coated thermal control heat spreader.",
      price: 310000,
      condition: Condition.NEW,
      stock: 22,
      image_url: "/images/products/samsung-980pro.svg",
    },
    {
      title: "Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz",
      description: "High-performance DDR4 memory kit designed for high-performance overclocking. Pure aluminum heat spreader for faster heat dissipation. XMP 2.0 supported.",
      price: 220000,
      condition: Condition.NEW,
      stock: 18,
      image_url: "/images/products/corsair-ddr4.svg",
    },
    {
      title: "Corsair RM750e 750W 80 PLUS Gold Fully Modular PSU",
      description: "Compact low-noise ATX 3.0 & PCIe 5.0 compliant power supply. 105°C-rated capacitors, 120mm rifle bearing fan with Zero RPM mode. 80 PLUS Gold certified.",
      price: 350000,
      condition: Condition.NEW,
      stock: 11,
      image_url: "/images/products/corsair-rm750e.svg",
    },
    {
      title: "AMD Ryzen 7 5700X 8-Core 16-Thread Processor",
      description: "3.4 GHz Base / 4.6 GHz Max Boost, 36MB GameCache, Socket AM4, 65W TDP. Excellent power efficiency and performance for creators and gamers. Pin-tested and pristine.",
      price: 490000,
      condition: Condition.SECONDHAND,
      stock: 8,
      image_url: "/images/products/ryzen-5700x.svg",
    },
    {
      title: "ASUS ROG Strix B650-A Gaming WiFi Motherboard",
      description: "AMD Socket AM5 for Ryzen 7000/8000 series, 12+2 power stages, DDR5 6400+(OC), PCIe 5.0 M.2 slot, WiFi 6E, Intel 2.5Gb Ethernet, Aura Sync RGB.",
      price: 750000,
      condition: Condition.NEW,
      stock: 7,
      image_url: "/images/products/asus-b650a.svg",
    },
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`Created product: ${created.title} (${created.condition}) - ${created.price} MMK`);
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
