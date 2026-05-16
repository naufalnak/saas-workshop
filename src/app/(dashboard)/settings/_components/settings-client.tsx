// src/app/(dashboard)/settings/_components/settings-client.tsx
"use client";

import { useState, useTransition, useRef } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  Globe,
  Clock,
  Tag,
  Wrench,
  Loader2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import {
  updateWorkshopProfile,
  addWorkshopService,
  deleteWorkshopService,
} from "../actions";
import { formatCurrency } from "@/lib/utils";
import type { Workshop, WorkshopService } from "@prisma/client";

type WorkshopWithServices = Workshop & { workshopServices: WorkshopService[] };

const SPECIALTY_OPTIONS = [
  "Motor",
  "Mobil",
  "Truk",
  "AC Mobil",
  "Body Repair",
  "Cuci Kendaraan",
  "Ban & Velg",
  "Kelistrikan",
];

interface Props {
  workshop: WorkshopWithServices;
}

export function SettingsClient({ workshop }: Props) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    workshop.specialties ?? [],
  );
  const [isPublished, setIsPublished] = useState(workshop.isPublished);
  const formRef = useRef<HTMLFormElement>(null);
  const serviceFormRef = useRef<HTMLFormElement>(null);

  const portalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/bengkel/${workshop.slug}`
      : `/bengkel/${workshop.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("specialties", selectedSpecialties.join(","));
    formData.set("isPublished", isPublished ? "true" : "false");
    startTransition(async () => {
      await updateWorkshopProfile(formData);
    });
  };

  const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await addWorkshopService(formData);
      serviceFormRef.current?.reset();
      setShowAddService(false);
    });
  };

  const handleDeleteService = (id: string) => {
    if (!confirm("Hapus layanan ini?")) return;
    startTransition(() => deleteWorkshopService(id));
  };

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="flex-1 p-6 max-w-3xl space-y-6">
      {/* Publish toggle */}
      <div
        className={`rounded-xl border p-4 flex items-center justify-between ${
          isPublished
            ? "bg-green-50 border-green-200"
            : "bg-amber-50 border-amber-200"
        }`}>
        <div>
          <p
            className={`text-sm font-semibold ${
              isPublished ? "text-green-800" : "text-amber-800"
            }`}>
            {isPublished
              ? "✅ Bengkel kamu tampil di marketplace"
              : "⚠️ Bengkel kamu belum dipublikasikan"}
          </p>
          <p
            className={`text-xs mt-0.5 ${
              isPublished ? "text-green-600" : "text-amber-600"
            }`}>
            {isPublished
              ? "Pelanggan bisa menemukan dan memesan servis ke bengkel kamu"
              : "Aktifkan agar bengkel kamu bisa ditemukan pelanggan"}
          </p>
        </div>
        <button
          onClick={() => setIsPublished(!isPublished)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            isPublished ? "bg-green-500" : "bg-gray-300"
          }`}>
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              isPublished ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Profil form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" /> Profil Publik Bengkel
        </h3>

        <form ref={formRef} onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nama Bengkel *</label>
              <input
                name="name"
                required
                defaultValue={workshop.name}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Kota</label>
              <input
                name="city"
                defaultValue={workshop.city ?? ""}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Alamat Lengkap</label>
            <input
              name="address"
              defaultValue={workshop.address ?? ""}
              placeholder="Jl. Merdeka No. 1, Jakarta Selatan"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>No. Telepon</label>
            <input
              name="phone"
              defaultValue={workshop.phone ?? ""}
              placeholder="08123456789"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Deskripsi Bengkel</label>
            <textarea
              name="description"
              defaultValue={workshop.description ?? ""}
              rows={3}
              placeholder="Ceritakan bengkel kamu — spesialisasi, pengalaman, keunggulan..."
              className={inputClass + " resize-none"}
            />
          </div>

          {/* Jam operasional */}
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Jam Operasional
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  name="openHour"
                  type="time"
                  defaultValue={workshop.openHour ?? "08:00"}
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">Jam buka</p>
              </div>
              <div>
                <input
                  name="closeHour"
                  type="time"
                  defaultValue={workshop.closeHour ?? "17:00"}
                  className={inputClass}
                />
                <p className="text-xs text-gray-400 mt-1">Jam tutup</p>
              </div>
            </div>
          </div>

          {/* Spesialisasi */}
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Spesialisasi
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTY_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecialty(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    selectedSpecialties.includes(s)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-70">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Simpan Profil"
            )}
          </button>
        </form>
      </div>

      {/* Layanan bengkel */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-gray-400" />
            Layanan ({workshop.workshopServices.length})
          </h3>
          <button
            onClick={() => setShowAddService(true)}
            className="flex items-center gap-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition">
            <Plus className="w-3.5 h-3.5" /> Tambah Layanan
          </button>
        </div>

        {workshop.workshopServices.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Belum ada layanan. Tambahkan layanan agar pelanggan tahu apa yang
            bengkel kamu tawarkan.
          </p>
        ) : (
          <div className="space-y-2">
            {workshop.workshopServices.map((svc) => (
              <div
                key={svc.id}
                className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {svc.name}
                  </p>
                  {svc.description && (
                    <p className="text-xs text-gray-400">{svc.description}</p>
                  )}
                  <div className="flex gap-3 mt-0.5">
                    {(svc.priceMin || svc.priceMax) && (
                      <span className="text-xs text-blue-600">
                        {svc.priceMin && svc.priceMax
                          ? `${formatCurrency(svc.priceMin)} – ${formatCurrency(svc.priceMax)}`
                          : svc.priceMin
                            ? `Mulai ${formatCurrency(svc.priceMin)}`
                            : `s/d ${formatCurrency(svc.priceMax!)}`}
                      </span>
                    )}
                    {svc.duration && (
                      <span className="text-xs text-gray-400">
                        ~{svc.duration} menit
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteService(svc.id)}
                  disabled={isPending}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Portal link */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Link Profil Publik
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Share ke pelanggan agar bisa langsung booking ke bengkel kamu.
        </p>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <code className="text-sm text-blue-600 flex-1 truncate">
            /bengkel/{workshop.slug}
          </code>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition">
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Disalin!" : "Salin"}
          </button>

          <a
            href={`/bengkel/${workshop.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
            <ExternalLink className="w-3.5 h-3.5" /> Buka
          </a>
        </div>
      </div>

      {/* Modal tambah layanan */}
      <Modal
        open={showAddService}
        onClose={() => setShowAddService(false)}
        title="Tambah Layanan">
        <form
          ref={serviceFormRef}
          onSubmit={handleAddService}
          className="space-y-4">
          <div>
            <label className={labelClass}>
              Nama Layanan <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              required
              placeholder="Ganti Oli, Tune Up, dll"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Deskripsi</label>
            <input
              name="description"
              placeholder="Keterangan singkat layanan"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Harga Mulai (Rp)</label>
              <input
                name="priceMin"
                type="number"
                placeholder="50000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Harga Sampai (Rp)</label>
              <input
                name="priceMax"
                type="number"
                placeholder="100000"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Estimasi Durasi (menit)</label>
            <input
              name="duration"
              type="number"
              placeholder="30"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-70">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              "Tambah Layanan"
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}
