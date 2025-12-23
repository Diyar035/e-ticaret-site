# 1. Node.js imajını indir
FROM node:18-alpine

# 2. Çalışma klasörünü ayarla
WORKDIR /app

# 3. Paket dosyalarını kopyala ve yükle
COPY package*.json ./
RUN npm install

# 4. Proje dosyalarını kopyala
COPY . .

# 5. Prisma istemcisini oluştur (Prisma klasörün olduğu için bu şart)
RUN npx prisma generate

# 6. Next.js projesini derle (Build al)
RUN npm run build

# 7. Portu aç ve başlat
EXPOSE 3000
CMD ["npm", "start"]