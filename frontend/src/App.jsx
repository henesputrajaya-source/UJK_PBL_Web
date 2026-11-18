import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, MapPin, Cake, Users, GraduationCap, CalendarClock, CheckCircle2, AlertTriangle, RefreshCw, Inbox, LayoutGrid, List } from "lucide-react";
import SiswaModal from "./components/SiswaModal.jsx";
import { createSiswa, deleteSiswa, getSiswa, updateSiswa } from "./api.js";

const bands = [
  "from-indigo-500 to-blue-600",
  "from-teal-400 to-emerald-600",
  "from-fuchsia-500 to-purple-600",
  "from-amber-400 to-orange-600",
  "from-rose-500 to-red-600",
  "from-sky-400 to-cyan-600",
];
const hash = (s = "") => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);
const band = (jurusan) => bands[hash(jurusan) % bands.length];

const inisial = (nama = "") =>
  nama.trim().split(/\s+/).slice(0, 2).map((k) => k[0]?.toUpperCase()).join("");

const tgl = (t) => (t ? new Date(`${t.slice(0, 10)}T00:00:00`) : null);
const formatTanggal = (t) =>
  tgl(t)?.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) ?? "-";
const umur = (t) => {
  const d = tgl(t);
  if (!d) return null;
  const n = new Date();
  let u = n.getFullYear() - d.getFullYear();
  if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) u--;
  return u;
};

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [terpilih, setTerpilih] = useState(null);
  const [hapus, setHapus] = useState(null);
  const [toast, setToast] = useState(null);
  const [tampilan, setTampilan] = useState(() => {
    try {
      return localStorage.getItem("bds-tampilan") === "tabel" ? "tabel" : "kartu";
    } catch {
      return "kartu";
    }
  });

  const pilihTampilan = (v) => {
    setTampilan(v);
    try {
      localStorage.setItem("bds-tampilan", v);
    } catch {
      /* abaikan jika penyimpanan browser tidak tersedia */
    }
  };

  const notif = (tipe, pesan) => {
    setToast({ tipe, pesan });
    setTimeout(() => setToast(null), 3200);
  };

  const muat = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getSiswa());
    } catch (e) {
      setError(`${e.message}. Pastikan backend berjalan di port 3000 dan database terhubung.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  const jurusanList = useMemo(() => [...new Set(data.map((s) => s.jurusan))].sort(), [data]);

  const tampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return data.filter(
      (s) =>
        (filter === "Semua" || s.jurusan === filter) &&
        (!q || [s.id_siswa, s.nama, s.jurusan, s.alamat].join(" ").toLowerCase().includes(q))
    );
  }, [data, cari, filter]);

  const rata = useMemo(() => {
    const u = data.map((s) => umur(s.tanggal_lahir)).filter((x) => x != null);
    return u.length ? Math.round(u.reduce((a, b) => a + b, 0) / u.length) : 0;
  }, [data]);

  const tutup = useCallback(() => setModalOpen(false), []);

  const simpan = async (form) => {
    if (terpilih) await updateSiswa(terpilih.id_siswa, form);
    else await createSiswa(form);
    setModalOpen(false);
    notif("ok", terpilih ? "Data berhasil diubah" : "Mahasiswa berhasil ditambahkan");
    await muat();
  };

  const konfirmasiHapus = async () => {
    try {
      await deleteSiswa(hapus.id_siswa);
      notif("ok", `${hapus.nama} dihapus`);
      await muat();
    } catch (e) {
      notif("err", e.message);
    }
    setHapus(null);
  };

  const stats = [
    { icon: Users, label: "Mahasiswa", nilai: data.length },
    { icon: GraduationCap, label: "Jurusan", nilai: jurusanList.length },
    { icon: CalendarClock, label: "Rata-rata usia", nilai: rata ? `${rata} th` : "-" },
  ];

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-6xl px-5 pb-6 pt-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" />
              BDS · LIBRARY
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Bank Data
              <br />
              Siswa
            </h1>
            <p className="mt-3 max-w-md text-slate-400">
              Semua data mahasiswa dalam satu tempat. Cari, tambah, ubah, dan hapus dengan cepat.
            </p>
          </div>

          <dl className="flex divide-x divide-white/10 rounded-2xl border border-white/10 bg-panel/70 backdrop-blur">
            {stats.map(({ icon: Icon, label, nilai }) => (
              <div key={label} className="px-5 py-4 sm:px-7">
                <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Icon size={14} /> {label}
                </dt>
                <dd className="mt-1 font-display text-3xl font-bold text-white">{nilai}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20">
        <div className="sticky top-0 z-20 -mx-5 bg-ink/80 px-5 py-4 backdrop-blur-md">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Cari nama, jurusan, atau alamat..."
                className="w-full rounded-2xl border border-white/10 bg-panel py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/40"
              />
            </div>
            <button
              onClick={() => { setTerpilih(null); setModalOpen(true); }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cobalt px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cobalt/30 transition hover:-translate-y-0.5 hover:bg-indigo-500"
            >
              <Plus size={18} /> Tambah mahasiswa
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {jurusanList.length > 1 &&
                ["Semua", ...jurusanList].map((j) => (
                  <button
                    key={j}
                    onClick={() => setFilter(j)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      filter === j ? "bg-white text-ink" : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {j}
                  </button>
                ))}
            </div>

            <div role="group" aria-label="Pilih tampilan" className="flex shrink-0 rounded-xl border border-white/10 bg-panel p-1">
              {[
                { id: "kartu", label: "Kartu", Icon: LayoutGrid },
                { id: "tabel", label: "Tabel", Icon: List },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => pilihTampilan(id)}
                  aria-pressed={tampilan === id}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    tampilan === id ? "bg-white text-ink" : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-rose-500/10 px-5 py-4 text-sm text-rose-300 ring-1 ring-rose-400/30">
            <span className="flex items-start gap-2"><AlertTriangle size={18} className="mt-0.5 shrink-0" /> {error}</span>
            <button onClick={muat} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1.5 font-semibold hover:bg-rose-500/30">
              <RefreshCw size={14} /> Coba lagi
            </button>
          </div>
        )}

        {!loading && tampilan === "tabel" && tampil.length > 0 && (
          <div className="mt-5 overflow-x-auto rounded-3xl border border-white/10 bg-panel shadow-xl shadow-black/30">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-semibold">ID</th>
                  <th className="px-5 py-4 font-semibold">Nama</th>
                  <th className="px-5 py-4 font-semibold">Jurusan</th>
                  <th className="px-5 py-4 font-semibold">Tanggal lahir</th>
                  <th className="px-5 py-4 font-semibold">Alamat</th>
                  <th className="px-5 py-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {tampil.map((s) => (
                  <tr key={s.id_siswa} className="transition hover:bg-white/5">
                    <td className="whitespace-nowrap px-5 py-3.5 font-display font-bold text-slate-400">
                      BDS-{String(s.id_siswa).padStart(4, "0")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${band(s.jurusan)} font-display text-xs font-extrabold text-white`}>
                          {inisial(s.nama)}
                        </span>
                        <span className="font-semibold text-white">{s.nama}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">{s.jurusan}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      {formatTanggal(s.tanggal_lahir)}
                      {umur(s.tanggal_lahir) != null && <span className="text-slate-500"> ({umur(s.tanggal_lahir)} th)</span>}
                    </td>
                    <td className="px-5 py-3.5">{s.alamat}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setTerpilih(s); setModalOpen(true); }} aria-label={`Edit ${s.nama}`} className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-cobalt hover:text-white">
                          <Pencil size={14} /> Edit
                        </button>
                        <button onClick={() => setHapus(s)} aria-label={`Hapus ${s.nama}`} className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-rose-500 hover:text-white">
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={`mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${!loading && tampilan === "tabel" ? "hidden" : ""}`}>
          {loading &&
            [0, 1, 2].map((i) => <div key={i} className="h-72 animate-pulse rounded-3xl bg-panel" />)}

          {!loading && tampilan === "kartu" &&
            tampil.map((s, i) => (
              <article
                key={s.id_siswa}
                style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}
                className="anim-deal group overflow-hidden rounded-3xl border border-white/10 bg-panel shadow-xl shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-white/25"
              >
                <div className={`flex items-center justify-between bg-gradient-to-br ${band(s.jurusan)} px-5 pb-10 pt-4`}>
                  <span className="font-display text-xs font-bold tracking-widest text-white/80">KARTU MAHASISWA</span>
                  <span className="font-display text-sm font-bold text-white">
                    BDS-{String(s.id_siswa).padStart(4, "0")}
                  </span>
                </div>

                <div className="px-5 pb-5">
                  <div className={`-mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-panel bg-gradient-to-br ${band(s.jurusan)} font-display text-xl font-extrabold text-white`}>
                    {inisial(s.nama)}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold leading-tight text-white">{s.nama}</h3>
                  <p className="text-sm font-medium text-slate-400">{s.jurusan}</p>

                  <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <Cake size={16} className="mt-0.5 shrink-0 text-slate-500" />
                      <span>
                        {formatTanggal(s.tanggal_lahir)}
                        {umur(s.tanggal_lahir) != null && <span className="text-slate-500"> ({umur(s.tanggal_lahir)} th)</span>}
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-slate-500" />
                      <span>{s.alamat}</span>
                    </li>
                  </ul>

                  <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
                    <button onClick={() => { setTerpilih(s); setModalOpen(true); }} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/5 py-2 text-sm font-semibold text-slate-200 transition hover:bg-cobalt hover:text-white">
                      <Pencil size={15} /> Edit
                    </button>
                    <button onClick={() => setHapus(s)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/5 py-2 text-sm font-semibold text-slate-200 transition hover:bg-rose-500 hover:text-white">
                      <Trash2 size={15} /> Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}
        </div>

        {!loading && !error && tampil.length === 0 && (
          <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-white/15 px-6 py-16 text-center">
            <Inbox size={40} className="text-slate-600" />
            <h3 className="mt-4 font-display text-xl font-bold text-white">
              {data.length ? "Tidak ada hasil yang cocok" : "Belum ada data mahasiswa"}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {data.length ? "Coba kata kunci atau jurusan lain." : "Tambahkan mahasiswa pertama untuk memulai."}
            </p>
            {!data.length && (
              <button onClick={() => { setTerpilih(null); setModalOpen(true); }} className="mt-5 rounded-xl bg-cobalt px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
                Tambah mahasiswa
              </button>
            )}
          </div>
        )}

        {!loading && tampil.length > 0 && (
          <p className="mt-6 text-center text-xs text-slate-500">
            Menampilkan {tampil.length} dari {data.length} mahasiswa
          </p>
        )}
      </main>

      <SiswaModal open={modalOpen} siswa={terpilih} onClose={tutup} onSubmit={simpan} />

      {hapus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setHapus(null)}>
          <div className="anim-pop w-full max-w-sm rounded-3xl border border-white/10 bg-panel p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
              <Trash2 size={22} />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold text-white">Hapus {hapus.nama}?</h2>
            <p className="mt-1 text-sm text-slate-400">Data ini akan dihapus permanen dari database dan tidak bisa dikembalikan.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setHapus(null)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10">Batal</button>
              <button onClick={konfirmasiHapus} className="rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600">Hapus data</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className={`anim-toast fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-2xl ${toast.tipe === "ok" ? "bg-emerald-600" : "bg-rose-600"}`}>
          {toast.tipe === "ok" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          {toast.pesan}
        </div>
      )}
    </div>
  );
}