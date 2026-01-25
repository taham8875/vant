#!/bin/bash
# Docker Installation Script for Ubuntu 24.04
# Run this script with: bash install-docker.sh

set -e

echo "Installing Docker Engine and Docker Compose..."

# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index again
sudo apt-get update

# Install Docker Engine, Docker CLI, and containerd
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add current user to docker group (so you can run docker without sudo)
sudo usermod -aG docker $USER

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

echo ""
echo "✅ Docker installation complete!"
echo ""
echo "⚠️  IMPORTANT: You need to log out and log back in (or restart) for the docker group changes to take effect."
echo ""
echo "After logging back in, verify installation with:"
echo "  docker --version"
echo "  docker compose version"
echo "  docker ps"
echo ""
