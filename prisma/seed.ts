// prisma/seed.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
  ServiceStatus,
  InvoiceStatus,
  PaymentMethod,
  OrderType,
  OrderStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // ── RESET semua data (urutan penting karena foreign key) ──
  console.log("🗑️  Clearing all data...");
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.serviceItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.bookingRequest.deleteMany();
  await prisma.service.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.workshopService.deleteMany();
  await prisma.globalCustomer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workshop.deleteMany();
  console.log("✅ All data cleared");

  // ── WORKSHOPS ─────────────────────────────────────────────
  console.log("🏪 Creating workshops...");

  const workshops = await Promise.all([
    prisma.workshop.create({
      data: {
        name: "Bengkel Maju Jaya Motor",
        slug: "maju-jaya-motor",
        phone: "021-5551234",
        address: "Jl. Raya Kebon Jeruk No. 45, Jakarta Barat",
        city: "Jakarta",
        description:
          "Bengkel motor dan mobil berpengalaman lebih dari 15 tahun. Spesialis tune up, ganti oli, dan servis berkala. Teknisi bersertifikat dengan peralatan modern.",
        openHour: "08:00",
        closeHour: "17:00",
        isPublished: true,
        specialties: ["Motor", "Mobil", "Tune Up"],
      },
    }),
    prisma.workshop.create({
      data: {
        name: "Bengkel Sejahtera Auto",
        slug: "sejahtera-auto",
        phone: "022-7778899",
        address: "Jl. Soekarno Hatta No. 123, Bandung",
        city: "Bandung",
        description:
          "Spesialis AC mobil dan kelistrikan kendaraan. Melayani semua merek mobil dengan spare part original dan garansi perbaikan 30 hari.",
        openHour: "07:30",
        closeHour: "16:30",
        isPublished: true,
        specialties: ["Mobil", "AC Mobil", "Kelistrikan"],
      },
    }),
    prisma.workshop.create({
      data: {
        name: "Bengkel Prima Motor Surabaya",
        slug: "prima-motor-surabaya",
        phone: "031-3334567",
        address: "Jl. Ahmad Yani No. 88, Surabaya",
        city: "Surabaya",
        description:
          "Bengkel motor terpercaya di Surabaya. Ahli dalam servis motor matic, bebek, dan sport. Harga terjangkau dengan kualitas terjamin.",
        openHour: "08:00",
        closeHour: "18:00",
        isPublished: true,
        specialties: ["Motor", "Body Repair", "Ban & Velg"],
      },
    }),
    prisma.workshop.create({
      data: {
        name: "Bengkel Karya Mandiri",
        slug: "karya-mandiri",
        phone: "024-8889012",
        address: "Jl. Pandanaran No. 67, Semarang",
        city: "Semarang",
        description:
          "Bengkel umum yang melayani servis ringan dan berat untuk motor dan mobil. Pengerjaan cepat dan harga bersaing.",
        openHour: "08:30",
        closeHour: "17:30",
        isPublished: false, // belum publish
        specialties: ["Motor", "Mobil"],
      },
    }),
  ]);

  const [workshop1, workshop2, workshop3, workshop4] = workshops;
  console.log(`✅ ${workshops.length} workshops created`);

  // ── WORKSHOP SERVICES ─────────────────────────────────────
  console.log("🔧 Creating workshop services...");

  await prisma.workshopService.createMany({
    data: [
      // Workshop 1
      {
        name: "Ganti Oli Mesin",
        description: "Oli mesin + filter oli",
        priceMin: 75000,
        priceMax: 150000,
        duration: 30,
        workshopId: workshop1.id,
      },
      {
        name: "Tune Up Motor",
        description: "Busi, filter udara, karburator/injeksi",
        priceMin: 100000,
        priceMax: 250000,
        duration: 60,
        workshopId: workshop1.id,
      },
      {
        name: "Servis Rem",
        description: "Kampas rem depan & belakang",
        priceMin: 80000,
        priceMax: 200000,
        duration: 45,
        workshopId: workshop1.id,
      },
      {
        name: "Ganti Ban",
        description: "Lepas pasang + balancing",
        priceMin: 150000,
        priceMax: 400000,
        duration: 60,
        workshopId: workshop1.id,
      },
      {
        name: "Servis Berkala",
        description: "Paket servis lengkap 10.000 km",
        priceMin: 300000,
        priceMax: 600000,
        duration: 120,
        workshopId: workshop1.id,
      },
      // Workshop 2
      {
        name: "Service AC Mobil",
        description: "Cuci + isi freon",
        priceMin: 200000,
        priceMax: 500000,
        duration: 90,
        workshopId: workshop2.id,
      },
      {
        name: "Ganti Freon",
        description: "Freon R134a original",
        priceMin: 150000,
        priceMax: 300000,
        duration: 60,
        workshopId: workshop2.id,
      },
      {
        name: "Servis Kelistrikan",
        description: "Diagnosa & perbaikan sistem listrik",
        priceMin: 100000,
        priceMax: 500000,
        duration: 120,
        workshopId: workshop2.id,
      },
      {
        name: "Ganti Aki",
        description: "Aki basah & kering semua merek",
        priceMin: 350000,
        priceMax: 800000,
        duration: 30,
        workshopId: workshop2.id,
      },
      // Workshop 3
      {
        name: "Tune Up Motor Matic",
        description: "Servis lengkap motor matic",
        priceMin: 100000,
        priceMax: 200000,
        duration: 60,
        workshopId: workshop3.id,
      },
      {
        name: "Ganti Kampas Rem",
        description: "Kampas rem depan/belakang",
        priceMin: 60000,
        priceMax: 150000,
        duration: 30,
        workshopId: workshop3.id,
      },
      {
        name: "Cuci Motor",
        description: "Cuci bersih + semir ban",
        priceMin: 25000,
        priceMax: 50000,
        duration: 30,
        workshopId: workshop3.id,
      },
      {
        name: "Ganti CVT",
        description: "Roller, belt, kampas CVT",
        priceMin: 200000,
        priceMax: 400000,
        duration: 90,
        workshopId: workshop3.id,
      },
    ],
  });

  console.log("✅ Workshop services created");

  // ── USERS (Operator) ──────────────────────────────────────
  console.log("👤 Creating operator users...");

  const hashedPassword = await bcrypt.hash("password123", 12);

  const users = await Promise.all([
    // Workshop 1 users
    prisma.user.create({
      data: {
        name: "Budi Hartono",
        email: "owner@majujaya.com",
        password: hashedPassword,
        role: UserRole.OWNER,
        workshopId: workshop1.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Agus Setiawan",
        email: "mekanik1@majujaya.com",
        password: hashedPassword,
        role: UserRole.MECHANIC,
        workshopId: workshop1.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Dedi Kurniawan",
        email: "mekanik2@majujaya.com",
        password: hashedPassword,
        role: UserRole.MECHANIC,
        workshopId: workshop1.id,
      },
    }),
    // Workshop 2 users
    prisma.user.create({
      data: {
        name: "Hendra Wijaya",
        email: "owner@sejahteraauto.com",
        password: hashedPassword,
        role: UserRole.OWNER,
        workshopId: workshop2.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Rudi Santoso",
        email: "mekanik@sejahteraauto.com",
        password: hashedPassword,
        role: UserRole.MECHANIC,
        workshopId: workshop2.id,
      },
    }),
    // Workshop 3 users
    prisma.user.create({
      data: {
        name: "Slamet Riyadi",
        email: "owner@primamotor.com",
        password: hashedPassword,
        role: UserRole.OWNER,
        workshopId: workshop3.id,
      },
    }),
    // Workshop 4 users
    prisma.user.create({
      data: {
        name: "Wahyu Prasetyo",
        email: "owner@karyamandiri.com",
        password: hashedPassword,
        role: UserRole.OWNER,
        workshopId: workshop4.id,
      },
    }),
  ]);

  const [owner1, mechanic1, mechanic2, owner2, mechanic3, owner3] = users;
  console.log(`✅ ${users.length} users created`);

  // ── GLOBAL CUSTOMERS ──────────────────────────────────────
  console.log("🌍 Creating global customers...");

  const globalCustomers = await Promise.all([
    prisma.globalCustomer.create({
      data: {
        name: "Andi Firmansyah",
        email: "andi@gmail.com",
        password: hashedPassword,
        phone: "081234567890",
      },
    }),
    prisma.globalCustomer.create({
      data: {
        name: "Siti Rahayu",
        email: "siti@gmail.com",
        password: hashedPassword,
        phone: "082345678901",
      },
    }),
    prisma.globalCustomer.create({
      data: {
        name: "Rizki Pratama",
        email: "rizki@gmail.com",
        password: hashedPassword,
        phone: "083456789012",
      },
    }),
    prisma.globalCustomer.create({
      data: {
        name: "Maya Sari",
        email: "maya@gmail.com",
        password: hashedPassword,
        phone: "084567890123",
      },
    }),
  ]);

  console.log(`✅ ${globalCustomers.length} global customers created`);

  // ── CUSTOMERS (per workshop) ──────────────────────────────
  console.log("👥 Creating customers per workshop...");

  const customers1 = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Andi Firmansyah",
        phone: "081234567890",
        email: "andi@gmail.com",
        address: "Jl. Melati No. 12, Jakarta",
        workshopId: workshop1.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Siti Rahayu",
        phone: "082345678901",
        email: "siti@gmail.com",
        address: "Jl. Mawar No. 5, Jakarta",
        workshopId: workshop1.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Rizki Pratama",
        phone: "083456789012",
        email: "rizki@gmail.com",
        address: "Jl. Kenanga No. 8, Jakarta",
        workshopId: workshop1.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Maya Sari",
        phone: "084567890123",
        email: "maya@gmail.com",
        address: "Jl. Dahlia No. 3, Jakarta",
        workshopId: workshop1.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Doni Hermawan",
        phone: "085678901234",
        address: "Jl. Anggrek No. 15, Jakarta",
        workshopId: workshop1.id,
      },
    }),
  ]);

  const customers2 = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Eko Susanto",
        phone: "086789012345",
        email: "eko@gmail.com",
        address: "Jl. Cihampelas No. 22, Bandung",
        workshopId: workshop2.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Fitri Handayani",
        phone: "087890123456",
        address: "Jl. Dago No. 7, Bandung",
        workshopId: workshop2.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Galih Purnomo",
        phone: "088901234567",
        address: "Jl. Braga No. 11, Bandung",
        workshopId: workshop2.id,
      },
    }),
  ]);

  const customers3 = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Heri Sukmana",
        phone: "089012345678",
        address: "Jl. Darmo No. 33, Surabaya",
        workshopId: workshop3.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Indah Permata",
        phone: "081123456789",
        email: "indah@gmail.com",
        address: "Jl. Basuki Rahmat No. 9, Surabaya",
        workshopId: workshop3.id,
      },
    }),
  ]);

  console.log("✅ Customers created");

  // ── VEHICLES ──────────────────────────────────────────────
  console.log("🚗 Creating vehicles...");

  const vehicles1 = await Promise.all([
    prisma.vehicle.create({
      data: {
        plateNumber: "B 1234 XY",
        brand: "Honda",
        model: "Vario 125",
        year: 2021,
        color: "Hitam",
        engineCC: 125,
        customerId: customers1[0].id,
        workshopId: workshop1.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNumber: "B 5678 AB",
        brand: "Yamaha",
        model: "NMAX",
        year: 2022,
        color: "Biru",
        engineCC: 155,
        customerId: customers1[0].id,
        workshopId: workshop1.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNumber: "B 9012 CD",
        brand: "Toyota",
        model: "Avanza",
        year: 2020,
        color: "Putih",
        engineCC: 1300,
        customerId: customers1[1].id,
        workshopId: workshop1.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNumber: "B 3456 EF",
        brand: "Honda",
        model: "Beat",
        year: 2023,
        color: "Merah",
        engineCC: 110,
        customerId: customers1[2].id,
        workshopId: workshop1.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNumber: "B 7890 GH",
        brand: "Suzuki",
        model: "Ertiga",
        year: 2019,
        color: "Silver",
        engineCC: 1500,
        customerId: customers1[3].id,
        workshopId: workshop1.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNumber: "B 2345 IJ",
        brand: "Honda",
        model: "Scoopy",
        year: 2022,
        color: "Pink",
        engineCC: 110,
        customerId: customers1[4].id,
        workshopId: workshop1.id,
      },
    }),
  ]);

  const vehicles2 = await Promise.all([
    prisma.vehicle.create({
      data: {
        plateNumber: "D 1111 AA",
        brand: "Toyota",
        model: "Fortuner",
        year: 2021,
        color: "Hitam",
        engineCC: 2400,
        customerId: customers2[0].id,
        workshopId: workshop2.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNumber: "D 2222 BB",
        brand: "Honda",
        model: "CR-V",
        year: 2020,
        color: "Putih",
        engineCC: 1500,
        customerId: customers2[1].id,
        workshopId: workshop2.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNumber: "D 3333 CC",
        brand: "Mitsubishi",
        model: "Pajero Sport",
        year: 2022,
        color: "Silver",
        engineCC: 2400,
        customerId: customers2[2].id,
        workshopId: workshop2.id,
      },
    }),
  ]);

  const vehicles3 = await Promise.all([
    prisma.vehicle.create({
      data: {
        plateNumber: "L 4444 AA",
        brand: "Honda",
        model: "Vario 150",
        year: 2022,
        color: "Merah",
        engineCC: 150,
        customerId: customers3[0].id,
        workshopId: workshop3.id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plateNumber: "L 5555 BB",
        brand: "Yamaha",
        model: "Mio M3",
        year: 2021,
        color: "Kuning",
        engineCC: 125,
        customerId: customers3[1].id,
        workshopId: workshop3.id,
      },
    }),
  ]);

  console.log("✅ Vehicles created");

  // ── SERVICES ──────────────────────────────────────────────
  console.log("🔧 Creating services...");

  const services = await Promise.all([
    // DONE services — workshop 1
    prisma.service.create({
      data: {
        serviceNo: "SVC-20240301-A1B2",
        complaint:
          "Mesin susah dinyalakan saat pagi, oli sudah lama tidak diganti",
        diagnosis: "Oli mesin sudah kotor, busi lemah",
        notes: "Ganti oli + busi sekalian tune up ringan",
        status: ServiceStatus.DONE,
        vehicleId: vehicles1[0].id,
        mechanicId: mechanic1.id,
        workshopId: workshop1.id,
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-03-01"),
      },
    }),
    prisma.service.create({
      data: {
        serviceNo: "SVC-20240315-C3D4",
        complaint: "Rem belakang bunyi dan terasa blong",
        diagnosis: "Kampas rem belakang habis, minyak rem kurang",
        status: ServiceStatus.DONE,
        vehicleId: vehicles1[2].id,
        mechanicId: mechanic2.id,
        workshopId: workshop1.id,
        startDate: new Date("2024-03-15"),
        endDate: new Date("2024-03-15"),
      },
    }),
    prisma.service.create({
      data: {
        serviceNo: "SVC-20240401-E5F6",
        complaint: "Servis berkala 10.000 km",
        diagnosis: "Kondisi umum baik, perlu ganti oli + filter",
        status: ServiceStatus.DONE,
        vehicleId: vehicles1[4].id,
        mechanicId: mechanic1.id,
        workshopId: workshop1.id,
        startDate: new Date("2024-04-01"),
        endDate: new Date("2024-04-01"),
      },
    }),
    // IN_PROGRESS — workshop 1
    prisma.service.create({
      data: {
        serviceNo: "SVC-20240520-G7H8",
        complaint: "Suara berisik dari mesin saat akselerasi",
        diagnosis: "CVT aus, perlu ganti roller dan belt",
        status: ServiceStatus.IN_PROGRESS,
        vehicleId: vehicles1[1].id,
        mechanicId: mechanic1.id,
        workshopId: workshop1.id,
        startDate: new Date(),
      },
    }),
    // PENDING — workshop 1
    prisma.service.create({
      data: {
        serviceNo: "SVC-20240521-I9J0",
        complaint: "AC mobil tidak dingin, keluar bau tidak sedap",
        status: ServiceStatus.PENDING,
        vehicleId: vehicles1[5].id,
        workshopId: workshop1.id,
        startDate: new Date(),
      },
    }),
    // Workshop 2 services
    prisma.service.create({
      data: {
        serviceNo: "SVC-20240410-K1L2",
        complaint: "AC tidak dingin sama sekali, freon habis",
        diagnosis: "Freon habis + ada kebocoran di selang AC",
        status: ServiceStatus.DONE,
        vehicleId: vehicles2[0].id,
        mechanicId: mechanic3.id,
        workshopId: workshop2.id,
        startDate: new Date("2024-04-10"),
        endDate: new Date("2024-04-10"),
      },
    }),
    prisma.service.create({
      data: {
        serviceNo: "SVC-20240520-M3N4",
        complaint: "Lampu indikator menyala, mesin terasa berat",
        diagnosis: "Aki drop, alternator bermasalah",
        status: ServiceStatus.IN_PROGRESS,
        vehicleId: vehicles2[1].id,
        mechanicId: mechanic3.id,
        workshopId: workshop2.id,
        startDate: new Date(),
      },
    }),
    // Workshop 3 services
    prisma.service.create({
      data: {
        serviceNo: "SVC-20240505-O5P6",
        complaint: "Motor susah starter, tarikan berat",
        diagnosis: "Karburator kotor, filter udara tersumbat",
        status: ServiceStatus.DONE,
        vehicleId: vehicles3[0].id,
        workshopId: workshop3.id,
        startDate: new Date("2024-05-05"),
        endDate: new Date("2024-05-05"),
      },
    }),
  ]);

  console.log(`✅ ${services.length} services created`);

  // ── SERVICE ITEMS ─────────────────────────────────────────
  console.log("📦 Creating service items...");

  await Promise.all([
    // Service 1 items
    prisma.serviceItem.createMany({
      data: [
        {
          name: "Oli Mesin Pertamina Fastron 10W-40 1L",
          qty: 1,
          unitPrice: 65000,
          total: 65000,
          serviceId: services[0].id,
        },
        {
          name: "Filter Oli",
          qty: 1,
          unitPrice: 25000,
          total: 25000,
          serviceId: services[0].id,
        },
        {
          name: "Busi NGK",
          qty: 1,
          unitPrice: 35000,
          total: 35000,
          serviceId: services[0].id,
        },
        {
          name: "Jasa Tune Up",
          qty: 1,
          unitPrice: 75000,
          total: 75000,
          serviceId: services[0].id,
        },
      ],
    }),
    // Service 2 items
    prisma.serviceItem.createMany({
      data: [
        {
          name: "Kampas Rem Belakang",
          qty: 1,
          unitPrice: 85000,
          total: 85000,
          serviceId: services[1].id,
        },
        {
          name: "Minyak Rem",
          qty: 1,
          unitPrice: 35000,
          total: 35000,
          serviceId: services[1].id,
        },
        {
          name: "Jasa Servis Rem",
          qty: 1,
          unitPrice: 50000,
          total: 50000,
          serviceId: services[1].id,
        },
      ],
    }),
    // Service 3 items
    prisma.serviceItem.createMany({
      data: [
        {
          name: "Oli Mesin Shell Helix 10W-40 4L",
          qty: 1,
          unitPrice: 180000,
          total: 180000,
          serviceId: services[2].id,
        },
        {
          name: "Filter Oli",
          qty: 1,
          unitPrice: 45000,
          total: 45000,
          serviceId: services[2].id,
        },
        {
          name: "Filter Udara",
          qty: 1,
          unitPrice: 55000,
          total: 55000,
          serviceId: services[2].id,
        },
        {
          name: "Jasa Servis Berkala",
          qty: 1,
          unitPrice: 100000,
          total: 100000,
          serviceId: services[2].id,
        },
      ],
    }),
    // Service 4 items (IN_PROGRESS)
    prisma.serviceItem.createMany({
      data: [
        {
          name: "Roller CVT",
          qty: 6,
          unitPrice: 15000,
          total: 90000,
          serviceId: services[3].id,
        },
        {
          name: "Belt CVT",
          qty: 1,
          unitPrice: 120000,
          total: 120000,
          serviceId: services[3].id,
        },
        {
          name: "Kampas CVT",
          qty: 1,
          unitPrice: 85000,
          total: 85000,
          serviceId: services[3].id,
        },
        {
          name: "Jasa Ganti CVT",
          qty: 1,
          unitPrice: 100000,
          total: 100000,
          serviceId: services[3].id,
        },
      ],
    }),
    // Service 6 items (workshop 2, DONE)
    prisma.serviceItem.createMany({
      data: [
        {
          name: "Freon R134a 500gr",
          qty: 2,
          unitPrice: 95000,
          total: 190000,
          serviceId: services[5].id,
        },
        {
          name: "Selang AC",
          qty: 1,
          unitPrice: 250000,
          total: 250000,
          serviceId: services[5].id,
        },
        {
          name: "Jasa Service AC",
          qty: 1,
          unitPrice: 150000,
          total: 150000,
          serviceId: services[5].id,
        },
      ],
    }),
    // Service 8 items (workshop 3, DONE)
    prisma.serviceItem.createMany({
      data: [
        {
          name: "Jasa Bersih Karburator",
          qty: 1,
          unitPrice: 75000,
          total: 75000,
          serviceId: services[7].id,
        },
        {
          name: "Filter Udara",
          qty: 1,
          unitPrice: 35000,
          total: 35000,
          serviceId: services[7].id,
        },
        {
          name: "Oli Mesin",
          qty: 1,
          unitPrice: 45000,
          total: 45000,
          serviceId: services[7].id,
        },
      ],
    }),
  ]);

  console.log("✅ Service items created");

  // ── INVOICES ──────────────────────────────────────────────
  console.log("🧾 Creating invoices...");

  const invoices = await Promise.all([
    // Invoice 1 — PAID
    prisma.invoice.create({
      data: {
        invoiceNo: "INV-20240301-X1Y2",
        subtotal: 200000,
        tax: 0,
        discount: 0,
        total: 200000,
        status: InvoiceStatus.PAID,
        serviceId: services[0].id,
        workshopId: workshop1.id,
        dueDate: new Date("2024-03-08"),
      },
    }),
    // Invoice 2 — PAID
    prisma.invoice.create({
      data: {
        invoiceNo: "INV-20240315-Z3A4",
        subtotal: 170000,
        tax: 0,
        discount: 10000,
        total: 160000,
        status: InvoiceStatus.PAID,
        serviceId: services[1].id,
        workshopId: workshop1.id,
        dueDate: new Date("2024-03-22"),
      },
    }),
    // Invoice 3 — PAID
    prisma.invoice.create({
      data: {
        invoiceNo: "INV-20240401-B5C6",
        subtotal: 380000,
        tax: 0,
        discount: 0,
        total: 380000,
        status: InvoiceStatus.PAID,
        serviceId: services[2].id,
        workshopId: workshop1.id,
        dueDate: new Date("2024-04-08"),
      },
    }),
    // Invoice 6 — PARTIAL (workshop 2)
    prisma.invoice.create({
      data: {
        invoiceNo: "INV-20240410-D7E8",
        subtotal: 590000,
        tax: 0,
        discount: 0,
        total: 590000,
        status: InvoiceStatus.PARTIAL,
        serviceId: services[5].id,
        workshopId: workshop2.id,
        dueDate: new Date("2024-04-17"),
      },
    }),
    // Invoice 8 — UNPAID (workshop 3)
    prisma.invoice.create({
      data: {
        invoiceNo: "INV-20240505-F9G0",
        subtotal: 155000,
        tax: 0,
        discount: 0,
        total: 155000,
        status: InvoiceStatus.UNPAID,
        serviceId: services[7].id,
        workshopId: workshop3.id,
        dueDate: new Date("2024-05-12"),
      },
    }),
  ]);

  console.log(`✅ ${invoices.length} invoices created`);

  // ── PAYMENTS ──────────────────────────────────────────────
  console.log("💰 Creating payments...");

  await Promise.all([
    // Invoice 1 — fully paid
    prisma.payment.create({
      data: {
        amount: 200000,
        method: PaymentMethod.CASH,
        invoiceId: invoices[0].id,
        workshopId: workshop1.id,
        paidAt: new Date("2024-03-01"),
      },
    }),
    // Invoice 2 — fully paid
    prisma.payment.create({
      data: {
        amount: 160000,
        method: PaymentMethod.TRANSFER,
        referenceNo: "TRF-20240315-001",
        invoiceId: invoices[1].id,
        workshopId: workshop1.id,
        paidAt: new Date("2024-03-15"),
      },
    }),
    // Invoice 3 — fully paid
    prisma.payment.create({
      data: {
        amount: 200000,
        method: PaymentMethod.CASH,
        invoiceId: invoices[2].id,
        workshopId: workshop1.id,
        paidAt: new Date("2024-04-01"),
      },
    }),
    prisma.payment.create({
      data: {
        amount: 180000,
        method: PaymentMethod.QRIS,
        referenceNo: "QRIS-20240401-002",
        invoiceId: invoices[2].id,
        workshopId: workshop1.id,
        paidAt: new Date("2024-04-01"),
      },
    }),
    // Invoice 4 — partial paid (workshop 2)
    prisma.payment.create({
      data: {
        amount: 300000,
        method: PaymentMethod.CASH,
        invoiceId: invoices[3].id,
        workshopId: workshop2.id,
        paidAt: new Date("2024-04-10"),
      },
    }),
  ]);

  console.log("✅ Payments created");

  // ── ORDERS (marketplace) ──────────────────────────────────
  console.log("📋 Creating orders...");

  await Promise.all([
    // Order PENDING — booking
    prisma.order.create({
      data: {
        orderNo: "ORD-20240520-H1I2",
        type: OrderType.BOOKING,
        status: OrderStatus.PENDING,
        complaint: "Motor susah dinyalakan dan boros bensin",
        notes: "Mohon dicek karburator dan busi",
        preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 hari dari sekarang
        globalCustomerId: globalCustomers[0].id,
        workshopId: workshop1.id,
        vehicleId: vehicles1[0].id,
      },
    }),
    // Order PENDING — walk-in
    prisma.order.create({
      data: {
        orderNo: "ORD-20240521-J3K4",
        type: OrderType.WALK_IN,
        status: OrderStatus.PENDING,
        complaint: "Rem depan bunyi dan terasa keras",
        globalCustomerId: globalCustomers[1].id,
        workshopId: workshop1.id,
      },
    }),
    // Order CONFIRMED
    prisma.order.create({
      data: {
        orderNo: "ORD-20240519-L5M6",
        type: OrderType.BOOKING,
        status: OrderStatus.CONFIRMED,
        complaint: "AC mobil tidak dingin",
        preferredDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        globalCustomerId: globalCustomers[2].id,
        workshopId: workshop2.id,
        vehicleId: vehicles2[0].id,
      },
    }),
    // Order DONE
    prisma.order.create({
      data: {
        orderNo: "ORD-20240510-N7O8",
        type: OrderType.WALK_IN,
        status: OrderStatus.DONE,
        complaint: "Ganti oli rutin",
        globalCustomerId: globalCustomers[3].id,
        workshopId: workshop3.id,
        vehicleId: vehicles3[1].id,
      },
    }),
  ]);

  console.log("✅ Orders created");

  // ── SUMMARY ───────────────────────────────────────────────
  console.log("\n🎉 Seed completed successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 Summary:");
  console.log(
    `   🏪 Workshops     : ${workshops.length} (3 published, 1 draft)`,
  );
  console.log(`   👤 Operators     : ${users.length}`);
  console.log(`   🌍 Global Users  : ${globalCustomers.length}`);
  console.log(
    `   👥 Customers     : ${customers1.length + customers2.length + customers3.length}`,
  );
  console.log(
    `   🚗 Vehicles      : ${vehicles1.length + vehicles2.length + vehicles3.length}`,
  );
  console.log(`   🔧 Services      : ${services.length}`);
  console.log(`   🧾 Invoices      : ${invoices.length}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n🔑 Login credentials (semua pakai password: password123)");
  console.log("\n📌 Operator accounts:");
  console.log("   owner@majujaya.com     → Bengkel Maju Jaya Motor (Jakarta)");
  console.log("   owner@sejahteraauto.com → Bengkel Sejahtera Auto (Bandung)");
  console.log("   owner@primamotor.com   → Bengkel Prima Motor (Surabaya)");
  console.log(
    "   owner@karyamandiri.com → Bengkel Karya Mandiri (belum publish)",
  );
  console.log("\n🌍 Customer accounts:");
  console.log("   andi@gmail.com   → punya 2 kendaraan, beberapa order");
  console.log("   siti@gmail.com   → punya 1 kendaraan");
  console.log("   rizki@gmail.com  → punya 1 kendaraan");
  console.log("   maya@gmail.com   → punya 1 kendaraan");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
