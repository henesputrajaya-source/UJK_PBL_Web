import { useEffect, useState } from "react";
import { X, Hash, User, GraduationCap, CalendarDays, MapPin } from "lucide-react";

const kosong = { id_siswa: "", nama: "", jurusan: "", tanggal_lahir: "", alamat: "" };

const fields = [
  { name: "id_siswa", label: "ID siswa", icon: Hash, type: "number", ph: "Contoh: 1001", min: 1 },
  { name: "nama", label: "Nama lengkap", icon: User, ph: "Contoh: Budi Santoso" },
  { name: "jurusan", label: "Jurusan", icon: GraduationCap, ph: "Contoh: IPA" },
  { name: "tanggal_lahir", label: "Tanggal lahir", icon: CalendarDays, type: "date" },
  { name: "alamat", label: "Alamat", icon: MapPin, ph: "Jalan, kota", area: true },
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/40 [color-scheme:dark]";

export default function SiswaModal({ open, siswa, onClose, onSubmit }) {
  const [form, setForm] = useState(kosong);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm(
      siswa
        ? {
            id_siswa: String(siswa.id_siswa),
            nama: siswa.nama,
            jurusan: siswa.jurusan,
            tanggal_lahir: siswa.tanggal_lahir?.slice(0, 10) ?? "",
            alamat: siswa.alamat,
          }
        : kosong
    );
    setError("");
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, siswa, onClose]);

  if (!open) return null;

  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const simpan = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit({ ...form, id_siswa: Number(form.id_siswa) });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={simpan} className="anim-pop w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-panel shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between bg-gradient-to-r from-cobalt to-indigo-600 px-6 py-5">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              {siswa ? "Edit data siswa" : "Tambah siswa"}
            </h2>
            <p className="text-xs text-indigo-100">
              {siswa ? `ID saat ini: ${siswa.id_siswa}` : "Isi ID sendiri, harus unik"}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded-full p-1.5 text-white/80 hover:bg-white/15">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {fields.map(({ name, label, icon: Icon, ph, type, area, min }) => (
            <label key={name} className="block text-sm font-medium text-slate-300">
              {label}
              <div className="relative mt-1.5">
                <Icon size={16} className={`absolute left-3.5 text-slate-500 ${area ? "top-3.5" : "top-1/2 -translate-y-1/2"}`} />
                {area ? (
                  <textarea name={name} value={form[name]} onChange={ubah} required rows={3} placeholder={ph} className={inputClass} />
                ) : (
                  <input type={type || "text"} name={name} value={form[name]} onChange={ubah} required placeholder={ph} min={min} step={type === "number" ? 1 : undefined} className={inputClass} />
                )}
              </div>
            </label>
          ))}

          {error && <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-400/30">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10">
              Batal
            </button>
            <button type="submit" disabled={saving} className="rounded-xl bg-cobalt px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cobalt/30 transition hover:bg-indigo-500 disabled:opacity-60">
              {saving ? "Menyimpan..." : "Simpan data"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}