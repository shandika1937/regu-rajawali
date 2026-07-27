#!/bin/bash

# =============================================================
#  🚀 DEPLOY REGU RAJAWALI 1 KE VERCEL VIA TERMUX
#  =============================================================
#  Cara pakai:
#  1. Simpan script ini di HP kamu
#  2. Buka Termux
#  3. Ketik: bash deploy-termux.sh
#  4. Ikuti petunjuk di layar
# =============================================================

# Warna biar keren
BIRU='\033[0;34m'
EMAS='\033[1;33m'
HIJAU='\033[0;32m'
MERAH='\033[0;31m'
UNGU='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

clear

echo -e "${UNGU}"
echo "╔══════════════════════════════════════════════════╗"
echo "║                                                  ║"
echo "║   🦅  REGU RAJAWALI 1 - DEPLOY TO VERCEL        ║"
echo "║                                                  ║"
echo "║   «Solid • Disiplin • Kompak • Siap Berkarya»    ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# ===== CEK KONEKSI INTERNET =====
echo -e "${BIRU}[INFO]${NC} Mengecek koneksi internet..."
if ! ping -c 1 google.com &> /dev/null; then
    echo -e "${MERAH}[ERROR]${NC} Tidak ada koneksi internet! Pastikan HP terhubung ke WiFi/data."
    exit 1
fi
echo -e "${HIJAU}[OK]${NC} Internet terhubung!"
echo ""

# ===== STEP 1: UPDATE & INSTALL PAKET =====
echo -e "${EMAS}══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  📦 STEP 1/5: Install Paket Dibutuhkan${NC}"
echo -e "${EMAS}══════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BIRU}[INFO]${NC} Update paket Termux..."
pkg update -y && pkg upgrade -y

echo ""
echo -e "${BIRU}[INFO]${NC} Install curl, git, nodejs..."
pkg install -y curl git nodejs-lts

echo -e "${HIJAU}[OK]${NC} Paket berhasil diinstall!"
echo ""

# ===== STEP 2: CEK & INSTALL VERCEL CLI =====
echo -e "${EMAS}══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  📦 STEP 2/5: Install Vercel CLI${NC}"
echo -e "${EMAS}══════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BIRU}[INFO]${NC} Menginstall Vercel CLI..."
npm install -g vercel

echo -e "${HIJAU}[OK]${NC} Vercel CLI siap!"
echo ""

# ===== STEP 3: CEK DIREKTORI =====
echo -e "${EMAS}══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  📂 STEP 3/5: Cek Folder Website${NC}"
echo -e "${EMAS}══════════════════════════════════════════════════${NC}"
echo ""

# Cari folder regu-rajawali
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -d "$SCRIPT_DIR/assets" ] && [ -f "$SCRIPT_DIR/index.html" ]; then
    echo -e "${HIJAU}[OK]${NC} Folder website ditemukan: ${BOLD}$SCRIPT_DIR${NC}"
    cd "$SCRIPT_DIR"
elif [ -d "regu-rajawali" ]; then
    echo -e "${HIJAU}[OK]${NC} Folder 'regu-rajawali' ditemukan"
    cd regu-rajawali
elif [ -d "$HOME/regu-rajawali" ]; then
    echo -e "${HIJAU}[OK]${NC} Folder ditemukan di HOME"
    cd $HOME/regu-rajawali
else
    echo -e "${MERAH}[ERROR]${NC} Folder 'regu-rajawali' tidak ditemukan!"
    echo ""
    echo -e "${BIRU}Pilih salah satu:${NC}"
    echo "  1) Ketik path folder website kamu"
    echo "  2) Exit"
    read -p "Pilihan (1/2): " pilih
    if [ "$pilih" = "1" ]; then
        read -p "Masukkan path lengkap: " custom_path
        if [ -d "$custom_path" ]; then
            cd "$custom_path"
            echo -e "${HIJAU}[OK]${NC} Pindah ke $custom_path"
        else
            echo -e "${MERAH}[ERROR]${NC} Folder tidak ditemukan!"
            exit 1
        fi
    else
        exit 1
    fi
fi

echo ""

# ===== STEP 4: LOGIN VERCEL =====
echo -e "${EMAS}══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  🔑 STEP 4/5: Login ke Vercel${NC}"
echo -e "${EMAS}══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${EMAS}[PENTING]${NC} Akan dibuka browser/login screen."
echo -e "  - Pilih ${BOLD}Continue with Email${NC} atau ${BOLD}GitHub${NC}"
echo -e "  - Kalau di Termux pilih: ${BOLD}Continue with Email${NC}"
echo -e "  - Masukkan email Vercel kamu"
echo -e "  - Cek email untuk kode verifikasi"
echo ""
read -p "Tekan ENTER untuk login ke Vercel..."
echo ""

vercel login

echo ""
echo -e "${HIJAU}[OK]${NC} Login berhasil!"
echo ""

# ===== STEP 5: DEPLOY =====
echo -e "${EMAS}══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  🚀 STEP 5/5: Deploy ke Vercel${NC}"
echo -e "${EMAS}══════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BIRU}[INFO]${NC} Memulai deployment..."
echo -e "  Project: ${BOLD}Regu Rajawali 1${NC}"
echo -e "  Folder: ${BOLD}$(pwd)${NC}"
echo ""

# Tanya nama project
read -p "Masukkan nama project Vercel (contoh: regu-rajawali-1): " project_name
if [ -z "$project_name" ]; then
    project_name="regu-rajawali-1"
fi

echo ""
echo -e "${BIRU}[INFO]${NC} Deploy ke Vercel..."
echo -e "  ${EMAS}Proses ini butuh beberapa saat. Sabar ya!${NC}"
echo ""

# Deploy dengan Vercel CLI
vercel --prod \
    --name "$project_name" \
    --yes \
    --public

DEPLOY_RESULT=$?

echo ""
if [ $DEPLOY_RESULT -eq 0 ]; then
    echo -e "${HIJAU}╔══════════════════════════════════════════════════╗${NC}"
    echo -e "${HIJAU}║              ✅  DEPLOY BERHASIL!               ║${NC}"
    echo -e "${HIJAU}╚══════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BOLD}Website kamu sekarang ONLINE!${NC}"
    echo -e "  🔗 Cek di: ${BIRU}https://${project_name}.vercel.app${NC}"
    echo ""
    echo -e "${EMAS}══════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}           🦅  APA YANG BISA DILAKUKAN${NC}"
    echo -e "${EMAS}══════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${BOLD}1.${NC} Buka link di atas di browser HP kamu"
    echo ""
    echo -e "  ${BOLD}2.${NC} Login Owner Panel:"
    echo -e "     - Double-click logo atau Ctrl+Shift+A"
    echo -e "     - Username: ${BOLD}owner${NC}"
    echo -e "     - Password: ${BOLD}own123${NC}"
    echo ""
    echo -e "  ${BOLD}3.${NC} Upload foto anggota dari panel owner"
    echo ""
    echo -e "  ${BOLD}4.${NC} Statistik online (Firebase Realtime)"
    echo ""

    # Simpan URL ke file
    echo "https://${project_name}.vercel.app" > deploy-url.txt
    echo -e "${HIJAU}[INFO]${NC} URL disimpan di: deploy-url.txt"
else
    echo -e "${MERAH}╔══════════════════════════════════════════════════╗${NC}"
    echo -e "${MERAH}║           ❌  DEPLOY GAGAL!                     ║${NC}"
    echo -e "${MERAH}╚══════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "Kemungkinan penyebab:"
    echo -e "  1. Belum login Vercel"
    echo -e "  2. Nama project sudah dipakai orang"
    echo -e "  3. Koneksi internet bermasalah"
    echo ""
    echo -e "${BIRU}Coba lagi dengan:${NC}"
    echo -e "  vercel --prod --name ${project_name} --yes --public"
fi

echo ""
echo -e "${UNGU}Terima kasih sudah menggunakan script deploy! 🦅${NC}"
echo -e "${UNGU}Regu Rajawali 1 • Solid • Disiplin • Kompak • Siap Berkarya${NC}"
echo ""
