--
-- PostgreSQL database dump
--

\restrict DyxJGgvQogVuNFqNcM5FjemXZDSJyDdBmWJax3SOb14sDBIFH17ohGmma57N7Mv

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: siswa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.siswa (
    id_siswa integer NOT NULL,
    nama character varying(100) NOT NULL,
    jurusan character varying(100) NOT NULL,
    tanggal_lahir date NOT NULL,
    alamat text NOT NULL
);


--
-- Data for Name: siswa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.siswa (id_siswa, nama, jurusan, tanggal_lahir, alamat) FROM stdin;
2	Siti Aminah	IPS	2007-01-20	Bandung
1	Budi Santoso	IPA	2006-05-12	Jakarta
4	Amar Husni	IPS	2005-06-13	palembang
5	rafanda	IPA	2006-06-18	BOGOR
6	Budi Santoso	IPA	2006-05-12	Jakarta
7	Siti Aminah	IPS	2007-01-20	Bandung
8	Rizky Pratama	IPA	2006-08-03	Surabaya
9	Dewi Lestari	IPS	2007-03-15	Yogyakarta
10	Ahmad Fauzi	IPA	2006-11-27	Semarang
11	Putri Rahayu	IPA	2007-02-09	Medan
12	Dimas Aditya	IPS	2006-07-18	Depok
13	Nurul Hidayati	IPS	2007-04-22	Bekasi
14	Fajar Nugroho	IPA	2006-12-05	Malang
15	Rina Wulandari	IPS	2007-06-30	Bogor
16	Yoga Permana	IPA	2006-09-14	Denpasar
17	Maya Sari	IPS	2007-05-08	Palembang
18	Andi Setiawan	IPA	2006-10-21	Makassar
19	Lestari Handayani	IPS	2007-01-11	Tangerang
20	Eko Prasetyo	IPA	2006-03-26	Solo
3	Renata Afia	IPA	2007-04-04	MURATARA
\.


--
-- Name: siswa siswa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.siswa
    ADD CONSTRAINT siswa_pkey PRIMARY KEY (id_siswa);


--
-- PostgreSQL database dump complete
--

\unrestrict DyxJGgvQogVuNFqNcM5FjemXZDSJyDdBmWJax3SOb14sDBIFH17ohGmma57N7Mv

