# VPS Deployment Guide

## 1. Provision the server
- Create a Ubuntu 22.04 VPS (DigitalOcean/Hetzner, 1GB+ RAM)
- SSH in as root, then create a non-root user:
  ```bash
  adduser deploy
  usermod -aG sudo deploy
  su - deploy
  ```

## 2. Install system dependencies
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv nginx git

# Install Chrome + ChromeDriver for Selenium
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb
sudo apt install -y chromium-chromedriver
```

## 3. Install Node.js (for building React)
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

## 4. Deploy the app
```bash
sudo mkdir -p /var/www/phx-flights
sudo chown deploy:deploy /var/www/phx-flights
cd /var/www/phx-flights

git clone https://github.com/Americana808/PHX-Flight-data.git .

# Python virtualenv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Build React frontend
cd frontend
npm install
npm run build
cd ..
```

## 5. Set up systemd service
```bash
sudo cp phx-flights.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable phx-flights
sudo systemctl start phx-flights
```

## 6. Configure Nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/phx-flights
sudo ln -s /etc/nginx/sites-available/phx-flights /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
> Edit `nginx.conf` first — replace `your-domain-or-ip` with your actual IP or domain.

## 7. Set up auto-scrape cron job
```bash
crontab -e
```
Add this line to scrape every 30 minutes:
```
*/30 * * * * /var/www/phx-flights/venv/bin/python /var/www/phx-flights/skyharbot.py
```

## 8. (Optional) HTTPS with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Updating the app
```bash
cd /var/www/phx-flights
git pull
cd frontend && npm run build && cd ..
sudo systemctl restart phx-flights
```
