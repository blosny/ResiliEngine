FROM node:22-alpine 

WORKDIR /app
COPY package*.json ./
# Hata payını azaltmak için legacy-peer-deps ekledik
RUN npm install --legacy-peer-deps 
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]